const e2e = require('./e2e-encrypt.js')
const e2ee = require('./e2ee.js')
const fileDownload = require('js-file-download')
const {PrivateKey, createUserAuth, Client, Where, ThreadID} = require('@textile/hub')
const wallet = require('wallet-besu')
const ethers = require('ethers')

const keyInfo = {
    key:'be645tj5wtjuginby3fwnqhe57y',
    secret:'bcm7zjaxlipajgsm6qd6big7lv52cihf2whbbaji'
}

const threadDbId = [1, 85, 125, 191, 215, 114, 237, 51, 20, 250, 73, 167, 140, 79, 44, 163, 178, 32,
    196, 123, 8, 91, 204, 186, 30, 22, 91, 219, 60, 220, 108, 199, 131, 224]

export const authorizeUser = async (password)=>{
    try {
        const userAuth = await createUserAuth(keyInfo.key, keyInfo.secret)
        const seed = e2e.convertPass(password)
        const seedPhase = new Uint8Array(Buffer.from(seed))
        const identity = PrivateKey.fromRawEd25519Seed(seedPhase)
        const privateKey = await PrivateKey.fromString(identity.toString())
        const dbClient = await Client.withUserAuth(userAuth)
        const token = await dbClient.getToken(privateKey)
        console.log("User authorized!!!")
        return dbClient
    }catch (err){
        console.log('ERROR:',err)
        return null
    }
}

export const registerNewUser = async function(did, name, email, privateKey, userType, address, dbClient){
    try {
        const threadId = ThreadID.fromBytes(threadDbId)
        let publicKey = e2e.getPublicKey(privateKey)
        const data = {
            did:did,
            name: name,
            email: email,
            address: address,
            publicKey: publicKey.toString("hex"),
            userType: userType,
            nonce: 0,
            documentInfo: [{_id:"-1"}]
        }
        const status = await dbClient.create(threadId, 'RegisterUser', [data])
        console.log("User registration status:",status)
        return true
    }catch(err){
        throw err
    }
}

export const getLoginUser = async function(privateKey, dbClient){
    try {
        let publicKey = e2e.getPublicKey(privateKey)
        const query = new Where('publicKey').eq(publicKey.toString("hex"))
        const threadId = ThreadID.fromBytes(threadDbId)
        const result = await dbClient.find(threadId, 'RegisterUser', query)
        console.log("RESULT:",result)
        if (result.length<1){
            console.log("Please register user!")
            return null
        }
        return result[0]
    }catch (err) {
        throw err
    }
}

export const getAllUsers = async function(dbClient,loggedUser){
    console.log("Logg:",loggedUser)
    const threadId = ThreadID.fromBytes(threadDbId)
    const registeredUsers = await dbClient.find(threadId, 'RegisterUser', {})
    const userType = {party: 0, notary: 1}
    let caller
    let userArray = []
    let notaryArray = []

    for (let i=0;i<registeredUsers.length;i++){
        const result = registeredUsers[i]
        const value = {
            address: result.address,
            name: result.name,
            email: result.email,
            key: result.publicKey,
            userType: result.userType,
            nonce: result.nonce
        }
        if (loggedUser === result.publicKey) {
            caller =value
        }else if (result.userType === userType.notary){
            notaryArray.push(value)
        }
        else {
            userArray.push(value)
        }
    }
    return {
        userArray: userArray,
        notaryArray: notaryArray,
        caller: caller
    }
}

export const registerDoc = async function(party, fileInfo, title, setSubmitting, signer, notary, dbClient, caller,
                                          tx, writeContracts ){

    let encryptedKeys=[]
    let userAddress=[]
    const { fileHash, fileLocation, fileName, cipherKey } = fileInfo
    setSubmitting(true)
    console.log("Party:",party)
    const signature = await signDocument(fileHash, signer, caller.nonce)
    console.log("sign:",signature)
    for (let i=0;i<party.length;i++){
        let aesEncKey = await e2e.encryptKey(Buffer.from(party[i].key,"hex"), cipherKey)
        let userKey = {
            iv: aesEncKey.iv.toString("hex"),
            ephemPublicKey: aesEncKey.ephemPublicKey.toString("hex"),
            ciphertext: aesEncKey.ciphertext.toString("hex"),
            mac: aesEncKey.mac.toString("hex")
        }

        const docInfo = {
            address: party[i].address,
            cipherKey: JSON.stringify(userKey)
        }
        encryptedKeys.push(docInfo)
        userAddress.push(party[i].address)
    }
    console.log("Log:",encryptedKeys)

    if(notary!==null){
        const res = await tx(writeContracts.Signchain.saveNotarizeDoc(
          fileHash,
          notary.address,
          {value: ethers.utils.parseUnits(notary ? "0.1" : "0", "ether")}
        ))
        console.log("result:",res)
    }

    const threadId = ThreadID.fromBytes(threadDbId)
    const docId = await dbClient.create(threadId, 'Document', [{
        title: title,
        documentHash: fileHash.toString("hex"),
        fileLocation: fileLocation,
        fileName: fileName,
        key: encryptedKeys
    }])
    console.log("Doc ID:",docId)

    //call contract and verify signature
    const date = new Date()
    const signatureID = await dbClient.create(threadId, 'SignatureDetails', [{
        signers: userAddress,
        signature:[{
            signer: caller.address,
            signatureDigest: signature[1],
            timestamp: date.toDateString(),
            nonce: signature[0]
        }]
    }])
    console.log("Signature ID:",signatureID)

    const info = {
        documentId: docId[0],
        signatureId: signatureID[0]
    }

    for (let i=0; i<party.length; i++){
        const query = new Where('publicKey').eq(party[i].key)
        const user = await dbClient.find(threadId, 'RegisterUser', query)
        console.log("USER222:",user)
        if (user[0].documentInfo.length===1 && user[0].documentInfo[0]._id==="-1"){
            user[0].documentInfo = [info]
            user[0].nonce = user[0].nonce+1
        }else {
            user[0].documentInfo.push(info)
            user[0].nonce = user[0].nonce+1
        }
        await dbClient.save(threadId,'RegisterUser',[user[0]])
        console.log("Updated!!:")
    }
    console.log("File uploaded!!!")
    setSubmitting(false)
}

const signDocument = async function (fileHash, signer, replayNonce){
    const params = [
        ["bytes32", "uint"],
        [fileHash, replayNonce]
    ];
    const paramsHash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(...params));
    return [replayNonce, await signer.signMessage(ethers.utils.arrayify(paramsHash))]
}

export const attachSignature = async function(documentId, signer, caller, fileHash, dbClient){
    const query = new Where('address').eq(caller.address)
    const threadId = ThreadID.fromBytes(threadDbId)
    const user = await dbClient.find(threadId, 'RegisterUser', query)
    const signatureId = user[0].documentInfo.filter((value)=>value.documentId===documentId)
    const signature = await signDocument(fileHash, signer, caller.nonce)
    //verify signature contract call
    const signStatus = await dbClient.findByID(threadId, 'SignatureDetails', signatureId[0].signatureId)
    const date = new Date()
    signStatus.signature.push({
        signer: caller.address,
        signatureDigest: signature[1],
        timestamp: date.toDateString(),
        nonce: signature[0]
    })
    await dbClient.save(threadId,'SignatureDetails',[signStatus])
    console.log("Updated signature!!")

    user[0].nonce = user[0].nonce+1
    await dbClient.save(threadId,'RegisterUser',[user[0]])
    console.log("Updated Nonce!!:")
    return true
}

export const notarizeDoc = async function(docId, fileHash, tx, writeContracts , signer, caller, dbClient){
    const signature = await attachSignature(docId, signer, caller, fileHash, dbClient)
    console.log("Signature added!!")
    const result = await tx(writeContracts.Signchain.notarizeDoc(fileHash))
    console.log("Result:", result)
    return true
}

export const getNotaryInfo = async function(fileHash, tx, writeContracts) {
    return await tx(writeContracts.Signchain.notarizedDocs(fileHash))
}

export const getAllFile = async function(dbClient, loggedUserKey,address,tx, writeContracts){
    const threadId = ThreadID.fromBytes(threadDbId)
    const query = new Where('publicKey').eq(loggedUserKey)
    const users = await dbClient.find(threadId, 'RegisterUser', query)
    let result = []
    let documents =[]
    for (let i=0;i<users[0].documentInfo.length;i++){
        if (users[0].documentInfo.length===1 && users[0].documentInfo[0]._id==='-1'){
            break;
        }
        const document = await dbClient.findByID(threadId, 'Document', users[0].documentInfo[i].documentId)
        const hash = document.documentHash
        const signDetails = await dbClient.findByID(threadId, 'SignatureDetails', users[0].documentInfo[i].signatureId)
        const notaryInfo = await getNotaryInfo(hash, tx, writeContracts)
        let signStatus = true
        let partySigned = false
        if (signDetails.signers.length !== signDetails.signature.length){
            const array = signDetails.signature.filter((item) => item.signer === address.toString())
            console.log("Array:",i," :",signDetails, ": address: ",address)
            if (array.length===1){
                partySigned = true
            }
            signStatus = false;
        }else{
            signStatus = true
            partySigned = true
        }
        let value = {
            docId: document._id,
            hash: hash,
            documentLocation:document.fileLocation,
            key: document.key,
            title: document.title,
            timestamp: signDetails.signature[0].timestamp,
            signStatus: signStatus,
            signers: signDetails.signers,
            signatures: signDetails.signature,
            partySigned: partySigned,
            notary: notaryInfo.notaryAddress,
            notarySigned: notaryInfo.notarized
        }
        result.push(value)
    }
    return result
}

export const downloadFiles = async function (name, key, loggedUser,documentLocation, password){

    let cipherKey = null
    for (let i=0;i<key.length;i++){
        if (key[i].address===loggedUser){
            cipherKey = key[i].cipherKey
            break;
        }
    }
    cipherKey = JSON.parse(cipherKey)

    let encryptedKey = {
        iv: Buffer.from(cipherKey.iv,"hex"),
        ephemPublicKey: Buffer.from(cipherKey.ephemPublicKey,"hex"),
        ciphertext: Buffer.from(cipherKey.ciphertext,"hex"),
        mac: Buffer.from(cipherKey.mac,"hex")
    }
    const privateKey = await wallet.login(password);
    const decryptedKey = await e2e.decryptKey(privateKey[0],encryptedKey)
    const fileSplit= documentLocation.split(".")
    const fileFormat = fileSplit[fileSplit.length - 1]
    const storageType = fileSplit[fileSplit.length - 2]

    return new Promise((resolve)=>{
        if (storageType==="AWS") {
            e2ee.getFileAWS(documentLocation).then((encryptedFile) => {
                e2e.decryptFile(encryptedFile, decryptedKey).then((decryptedFile) => {
                    const hash2 = e2e.calculateHash(new Uint8Array(decryptedFile)).toString("hex")
                    fileDownload(decryptedFile, name.concat(".").concat(fileFormat))
                    resolve(true)
                })
            })
        }else if (storageType==="Fleek"){
            e2ee.getFileFleek(documentLocation).then((encryptedFile) => {
                e2e.decryptFile(encryptedFile, decryptedKey).then((decryptedFile) => {
                    const hash2 = e2e.calculateHash(new Uint8Array(decryptedFile)).toString("hex")
                    fileDownload(decryptedFile, name.concat(".").concat(fileFormat))
                    resolve(true)
                })
            })
        }else {
            documentLocation = documentLocation.slice(0, documentLocation.lastIndexOf("."))
            e2ee.getFileSlate(documentLocation).then((encryptedFile) => {
                e2e.decryptFile(encryptedFile, decryptedKey).then((decryptedFile) => {
                    const hash2 = e2e.calculateHash(new Uint8Array(decryptedFile)).toString("hex")
                    fileDownload(decryptedFile, name.concat(".").concat(fileFormat))
                    resolve(true)
                })
            })
        }
    })
}



