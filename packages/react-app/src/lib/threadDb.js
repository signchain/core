const e2e = require('./e2e-encrypt.js')
const e2ee = require('./e2ee.js')
const fileDownload = require('js-file-download')
const { Client, Where, ThreadID } = require('@textile/hub')
const wallet = require('wallet-besu')
const ethers = require('ethers')
const io = require('socket.io-client');

export const registerNewUser = async function(did, name, email, privateKey, userType, address){
    try {
        const {threadDb, client} = await getCredentials()
        const threadId = ThreadID.fromBytes(threadDb)
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
        const status = await client.create(threadId, 'RegisterUser', [data])
        console.log("User registration status:",status)
        return true
    }catch(err){
        throw err
    }
}

export const solveChallenge = (identity) => {
    return new Promise((resolve, reject) => {
        console.log("Trying to connect with socket!!")

        const socket = io("http://127.0.0.1:3001");

        socket.on("connect", () => {
            console.log('Connected to Server!!!')
            const publicKey = identity.public.toString();

            // Send public key to server
            socket.emit('message', JSON.stringify({
                pubKey: publicKey,
                type: 'token'
            }));

            socket.on("message", async (event) => {
                const data = JSON.parse(event)
                switch (data.type) {
                    case 'error': {
                        reject(data.value);
                        break;
                    }

                  //solve the challenge
                    case 'challenge': {
                        const buf = Buffer.from(data.value)
                        const signed = await identity.sign(buf)
                        socket.emit("challenge", signed);
                        break;
                    }

                  //get the token and store it
                    case 'token': {
                        resolve(data.value)
                        socket.disconnect();
                        break;
                    }
                }
            })
        });
    });
}

export const loginUserWithChallenge = async function(id){
    if (!id) {
        throw Error('No user ID found')
    }

    /** Use the identity to request a new API token when needed */
    const credentials = await solveChallenge(id);
    localStorage.setItem('payload',JSON.stringify(credentials))
    const client = await Client.withUserAuth(credentials.payload)
    console.log('Verified on Textile API!!')
    return client
}

export const getCredentials = async function(){
    const credentials = JSON.parse(localStorage.getItem('payload'))
    const threadDb = credentials.threadDbId
    const client = Client.withUserAuth(credentials.payload)
    return {client, threadDb}
}

export const getLoginUser = async function(privateKey){
    try {
        const {threadDb, client} = await getCredentials()
        let publicKey = e2e.getPublicKey(privateKey)
        const query = new Where('publicKey').eq(publicKey.toString("hex"))
        const threadId = ThreadID.fromBytes(threadDb)
        const result = await client.find(threadId, 'RegisterUser', query)
        if (result.length<1){
            console.log("Please register user!")
            return null
        }
        return result[0]
    }catch (err) {
        throw err
    }
}

export const getAllUsers = async function(loggedUser){
    const {threadDb, client} = await getCredentials()
    const threadId = ThreadID.fromBytes(threadDb)
    const registeredUsers = await client.find(threadId, 'RegisterUser', {})
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

export const registerDoc = async function(party, fileInfo, title, setSubmitting, signer, notary, caller,
                                          tx, writeContracts ){
    const {threadDb, client} = await getCredentials()
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

    const threadId = ThreadID.fromBytes(threadDb)
    const docId = await client.create(threadId, 'Document', [{
        title: title,
        documentHash: fileHash.toString("hex"),
        fileLocation: fileLocation,
        fileName: fileName,
        key: encryptedKeys
    }])
    console.log("Doc ID:",docId)

    //call contract and verify signature
    const date = new Date()
    const signatureID = await client.create(threadId, 'SignatureDetails', [{
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
        const user = await client.find(threadId, 'RegisterUser', query)
        console.log("USER222:",user)
        if (user[0].documentInfo.length===1 && user[0].documentInfo[0]._id==="-1"){
            user[0].documentInfo = [info]
            user[0].nonce = user[0].nonce+1
        }else {
            user[0].documentInfo.push(info)
            user[0].nonce = user[0].nonce+1
        }
        await client.save(threadId,'RegisterUser',[user[0]])
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

export const attachSignature = async function(documentId, signer, caller, fileHash){
    const {threadDb, client} = await getCredentials()
    const query = new Where('address').eq(caller.address)
    const threadId = ThreadID.fromBytes(threadDb)
    const user = await client.find(threadId, 'RegisterUser', query)
    const signatureId = user[0].documentInfo.filter((value)=>value.documentId===documentId)
    const signature = await signDocument(fileHash, signer, caller.nonce)
    //verify signature contract call
    const signStatus = await client.findByID(threadId, 'SignatureDetails', signatureId[0].signatureId)
    const date = new Date()
    signStatus.signature.push({
        signer: caller.address,
        signatureDigest: signature[1],
        timestamp: date.toDateString(),
        nonce: signature[0]
    })
    await client.save(threadId,'SignatureDetails',[signStatus])
    console.log("Updated signature!!")

    user[0].nonce = user[0].nonce+1
    await client.save(threadId,'RegisterUser',[user[0]])
    console.log("Updated Nonce!!:")
    return true
}

export const notarizeDoc = async function(docId, fileHash, tx, writeContracts , signer, caller){
    const signature = await attachSignature(docId, signer, caller, fileHash)
    console.log("Signature added!!")
    const result = await tx(writeContracts.Signchain.notarizeDoc(fileHash))
    console.log("Result:", result)
    return true
}

export const getNotaryInfo = async function(fileHash, tx, writeContracts) {
    return await tx(writeContracts.Signchain.notarizedDocs(fileHash))
}

export const getAllFile = async function( loggedUserKey,address,tx, writeContracts ){
    const {threadDb, client} = await getCredentials()
    const threadId = ThreadID.fromBytes(threadDb)
    const query = new Where('publicKey').eq(loggedUserKey)
    const users = await client.find(threadId, 'RegisterUser', query)
    let result = []
    let documents =[]
    for (let i=0;i<users[0].documentInfo.length;i++){
        if (users[0].documentInfo.length===1 && users[0].documentInfo[0]._id==='-1'){
            break;
        }
        const document = await client.findByID(threadId, 'Document', users[0].documentInfo[i].documentId)
        const hash = document.documentHash
        const signDetails = await client.findByID(threadId, 'SignatureDetails', users[0].documentInfo[i].signatureId)
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



