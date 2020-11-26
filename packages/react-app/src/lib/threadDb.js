import {getNotaryInfo} from "./e2ee";

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

const threadDbId = [1, 85, 96, 42, 105, 247, 113, 107, 30, 172, 138, 152, 79, 105, 200, 155, 166, 203, 19,
    199, 98, 41, 139, 71, 6, 103, 216, 114, 197, 198, 186, 245, 57, 72]

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
            documentId: ["-1"]
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

export const registerDoc = async function(party, fileHash, cipherKey, title, fileLocation, fileName,
                                          setSubmitting, signer, notary, dbClient,  tx, writeContracts){

    let encryptedKeys=[]
    let userAddress=[]

    setSubmitting(true)
    console.log("Party:",party)
    const signature = await signDocument(fileHash, tx, writeContracts , signer)
    console.log("sign:",signature)
    for (let i=0;i<party.length;i++){
        let aesEncKey = await e2e.encryptKey(Buffer.from(party[i].key,"hex"), cipherKey)
        let userKey = {
            iv: aesEncKey.iv.toString("hex"),
            ephemPublicKey: aesEncKey.ephemPublicKey.toString("hex"),
            ciphertext: aesEncKey.ciphertext.toString("hex"),
            mac: aesEncKey.mac.toString("hex")
        }

        const json = {
            email: party[i].email,
            key: JSON.stringify(userKey)
        }
        encryptedKeys.push(json)
        userAddress.push(party[i].address)
    }
    console.log("Log:",encryptedKeys)

    const threadId = ThreadID.fromBytes(threadDbId)
    const status = await dbClient.create(threadId, 'Document', [{
        documentHash: fileHash.toString("hex"),
        fileLocation: fileLocation,
        fileName: fileName,
        key: encryptedKeys
    }])
    console.log("Status:",status)

    for (let i=0; i<party.length; i++){
        const query = new Where('publicKey').eq(party[i].key)
        const user = await dbClient.find(threadId, 'RegisterUser', query)
        console.log("USER222:",user)
        if (user[0].documentId.length===1 && user[0].documentId[0]==="-1"){
            user[0].documentId = [status[0]]
        }else {
            user[0].documentId.push(status[0])
        }
        await dbClient.save(threadId,'RegisterUser',[user[0]])
        console.log("Updated!!:")
    }
    console.log("File uploaded!!!")
    tx(writeContracts.Signchain.signAndShareDocument(
        fileHash,
        title,
        userAddress,
        signature[0],
        signature[1],
        notary ? notary.address : '0x0000000000000000000000000000000000000000',
        {value: ethers.utils.parseUnits(notary ? "0.1" : "0", "ether")}
    )).then((receipt) => {
        console.log("Document signed!!!!")
        setSubmitting(false)
    })

}

const signDocument = async function (fileHash, tx, writeContracts , signer){
    const selfAddress = await signer.getAddress()
    console.log("Self:",selfAddress)
    const replayNonce = await tx(writeContracts.Signchain.replayNonce(selfAddress))
    console.log("Nonce:",replayNonce)
    const params = [
        ["bytes32", "uint"],
        [fileHash, replayNonce]
    ];
    const paramsHash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(...params));
    return [replayNonce, await signer.signMessage(ethers.utils.arrayify(paramsHash))]
}


export const getAllFile = async function(dbClient, loggedUserKey, tx, writeContracts,address){
    const threadId = ThreadID.fromBytes(threadDbId)
    const query = new Where('publicKey').eq(loggedUserKey)
    const users = await dbClient.find(threadId, 'RegisterUser', query)
    let result = []
    let documents =[]
    for (let i=0;i<users[0].documentId.length;i++){
        const document = await dbClient.findByID(threadId, 'Document', users[0].documentId[i])
        const hash = document.documentHash
        const signDetails = await tx(writeContracts.Signchain.getSignedDocuments(hash))
        const notaryInfo = await getNotaryInfo(hash, tx, writeContracts)
        let signStatus = true
        let partySigned = false
        if (signDetails.signers.length !== signDetails.signatures.length){
            const array = signDetails.signatures.filter((item) => item[0]===address.toString())
            if (array.length===1){
                partySigned = true
            }
            signStatus = false;
        }else{
            signStatus = true
            partySigned = true
        }
        let value = {
            hash: hash,
            documentLocation:document.fileLocation,
            key: document.key,
            title: signDetails.title,
            timestamp: parseInt(signDetails.timestamp) * 1000,
            signStatus: signStatus,
            signers: signDetails.signers,
            signatures: signDetails.signatures,
            owner: signDetails.owner,
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
        if (key[i].email===loggedUser){
            cipherKey = key[i].key
            break;
        }
    }
    console.log("CIPHERKEY:",cipherKey)
    cipherKey = JSON.parse(cipherKey)

    let encryptedKey = {
        iv: Buffer.from(cipherKey.iv,"hex"),
        ephemPublicKey: Buffer.from(cipherKey.ephemPublicKey,"hex"),
        ciphertext: Buffer.from(cipherKey.ciphertext,"hex"),
        mac: Buffer.from(cipherKey.mac,"hex")
    }
    const privateKey = await wallet.login(password);
    const decryptedKey = await e2e.decryptKey(privateKey[0],encryptedKey)
    console.log("documemt:",documentLocation)
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



