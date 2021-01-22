import {definitions} from "../ceramic/config.json"
const e2e = require('./e2e-encrypt.js')
const e2ee = require('./e2ee.js')
const fileDownload = require('js-file-download')
const { Client, Where, ThreadID } = require('@textile/hub')
const wallet = require('wallet-besu')
const ethers = require('ethers')
const io = require('socket.io-client');


export const registerNewUser = async function(did, name, email, privateKey, userType, address, password){
    try {
        const {threadDb, client} = await getCredentials()
        console.log("GET CREDENTIALS FUNCTION",client)
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

        const query = new Where('address').eq(address)
        const query1 = new Where('email').eq(email).or(query)
        const result = await client.find(threadId, 'RegisterUser', query1)
        console.log("Query1:",result)
        if (result.length<1){
            const status = await client.create(threadId, 'RegisterUser', [data])
            localStorage.setItem("USER", JSON.stringify(data))
            localStorage.setItem("password", "12345");
            console.log("User registration status:",status)
            return true
        }
        return false
    }catch(err){
        throw err
    }
}

export const solveChallenge = (identity) => {
    return new Promise((resolve, reject) => {
        console.log("Trying to connect with socket!!")

        const socket = io(process.env.REACT_APP_API_SERVER_URL);

        socket.on("connect", () => {
            console.log('Connected to Server!!!')
            const publicKey = identity.public.toString();

            // Send public key to server
            socket.emit('authInit', JSON.stringify({
                pubKey: publicKey,
                type: 'token'
            }));

            socket.on("authMsg", async (event) => {
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
                        socket.emit("challengeResp", signed);
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

export const getLoginUser = async function(address, idx){
    try {
        const {threadDb, client} = await getCredentials()
        const query = new Where('address').eq(address)
        const threadId = ThreadID.fromBytes(threadDb)
        const result = await client.find(threadId, 'RegisterUser', query)
        const ceramicResult = await idx.get(definitions.profile, idx.id)
        if (result.length<1 || ceramicResult === null){
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
            nonce: result.nonce,
            did: result.did
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
    console.log("party: ",party)
    const {threadDb, client} = await getCredentials()
    let encryptedKeys=[]
    let userAddress=[]
    let sharedParty = []
    let notaryStatus = false

    const { fileHash, fileLocation, fileName, cipherKey } = fileInfo
    setSubmitting(true)
    console.log("Party:",party)
    const signature = await signDocument(fileHash, signer, caller.nonce)
    console.log("sign:",signature)

    //prepare encrypted aes key for every user
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

        if (party[i].address!==caller.address) {
            console.log('iff')
            const counterParty = {
                name: party[i].name,
                address: party[i].address,
                email: party[i].email,
                did: party[i].did
            }
            sharedParty.push(counterParty)
        }
        encryptedKeys.push(docInfo)
        userAddress.push(party[i].address)
    }
    console.log("Counter party:", sharedParty)

    //get notary
    if(notary!==null){
        notaryStatus = true
        const res = await tx(writeContracts.Signchain.saveNotarizeDoc(
          fileHash,
          notary.address,
          {value: ethers.utils.parseUnits(notary ? "0.1" : "0", "ether")}
        ))
        console.log("result:",res)
    }

    //store document
    const threadId = ThreadID.fromBytes(threadDb)
    const docId = await client.create(threadId, 'Document', [{
        title: title,
        createdBy: {
            name:caller.name,
            address: caller.address,
            did: caller.did
        },
        documentHash: fileHash.toString("hex"),
        fileLocation: fileLocation,
        fileName: fileName,
        key: encryptedKeys,
        notaryStatus: notaryStatus,
        sharedTo: sharedParty
    }])
    console.log("Doc ID:",docId)

    //store signature
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

    //metadata
    const info = {
        documentId: docId[0],
        signatureId: signatureID[0],
        title: title,
        createdBy: {
            name:caller.name,
            address: caller.address,
            _id: caller._id
        },
        sharedWith: sharedParty,
        date: date.toDateString(),
        fileName: fileName
    }

    //add document to users profile
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
    return {docId, signatureID}
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
    console.log("Caller Doc:",caller)
    const {threadDb, client} = await getCredentials()
    const query = new Where('publicKey').eq(caller.key)
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
    return await tx(writeContracts.Signchain.getNotarizeDocument(fileHash))
}

export const getAllFile = async function( loggedUserKey ){
    const {threadDb, client} = await getCredentials()
    const threadId = ThreadID.fromBytes(threadDb)
    const query = new Where('publicKey').eq(loggedUserKey)
    const users = await client.find(threadId, 'RegisterUser', query)
    console.log("Document:",users[0].documentInfo)
    let result = []
    for (let i=0;i<users[0].documentInfo.length;i++){
        if (users[0].documentInfo.length===1 && users[0].documentInfo[0]._id==='-1'){
            break;
        }
        const documentDetails = users[0].documentInfo[i];
        let value={
            createdBy: documentDetails.createdBy,
            date: documentDetails.date,
            title: documentDetails.title,
            fileName: documentDetails.fileName,
            documentId: documentDetails.documentId,
            signatureId: documentDetails.signatureId,
            sharedWith: documentDetails.sharedWith
        }
        result.push(value)
    }
    return result
}

export const getSingleDocument = async function(address, tx, writeContracts, documentId, signatureId){
    const {threadDb, client} = await getCredentials()
    const threadId = ThreadID.fromBytes(threadDb)
    const document = await client.findByID(threadId, 'Document', documentId)
    console.log("Document:", document)
    const hash = document.documentHash
    const signDetails = await client.findByID(threadId, 'SignatureDetails', signatureId)

    console.log("NotaryStatus:",document.notaryStatus)
    let signStatus = false
    let partySigned = false

    if (signDetails.signers.length !== signDetails.signature.length){
        const array = signDetails.signature.filter((item) => item.signer === address.toString())
        if (array.length===1){
            partySigned = true
        }
    }else{
        signStatus = true
        partySigned = true
    }

    let counterParty = document.sharedTo

    for (let i=0;i<counterParty.length;i++){
        if (signDetails.signature[i].signer===counterParty[i].address){
            counterParty[i].partySigned = true
            counterParty[i].timestamp = signDetails.signature[i].timestamp
        }else{
            counterParty[i].partySigned = false
            counterParty[i].timestamp = 'NA'
        }
    }

    let value = {
        createdBy: document.createdBy.name,
        createdByDid: document.createdBy.did,
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
        notaryStatus: document.notaryStatus,
        sharedTo: counterParty,
        notary: 0,
        notarySigned: false
    }

    if (document.notaryStatus) {
        const notaryInfo = await getNotaryInfo(hash, tx, writeContracts)
        console.log("NotaryInfo:", notaryInfo)
        value.notary = notaryInfo.notaryAddress
        value.notarySigned = notaryInfo.notarized
    }

    return value;
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

    console.log("Strorage typr:", storageType)
    return new Promise((resolve)=>{
        if (storageType==="AWS") {
            e2ee.getFileAWS(documentLocation).then((encryptedFile) => {
                e2e.decryptFile(encryptedFile, decryptedKey).then((decryptedFile) => {
                    const hash2 = e2e.calculateHash(new Uint8Array(decryptedFile)).toString("hex")
                    fileDownload(decryptedFile, name.concat(".").concat(fileFormat))
                    resolve(true)
                })
            })
        }else if (storageType==="FLEEK"){
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


