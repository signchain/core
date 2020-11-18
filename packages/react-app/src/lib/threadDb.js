import {getNotaryInfo} from "./e2ee";

const e2e = require('./e2e-encrypt.js')
const e2ee = require('./e2ee.js')
const fileDownload = require('js-file-download')
const {PrivateKey, createUserAuth, Client, Where, ThreadID} = require('@textile/hub')
const fleekStorage = require('@fleekhq/fleek-storage-js')
const wallet = require('wallet-besu')
const ethers = require('ethers')

let fromUser

const keyInfo = {
    key:'be645tj5wtjuginby3fwnqhe57y',
    secret:'bcm7zjaxlipajgsm6qd6big7lv52cihf2whbbaji'
}

const threadDbId = [1, 85, 99, 157, 222, 13, 22, 72, 96, 32, 153, 96, 32, 162, 85, 157, 29, 146,
    214, 75, 9, 49, 56, 114, 130, 72, 139, 200, 123, 33, 51, 80, 191, 201]

const fleekApiKey = "t8DYhMZ1ztjUtOFC8qEDqg=="
const fleekApiSecret = "XwZyU7RZ3H2Z1QHhUdFdi4MJx8j1axJm2hEq1olRWeU="

export const init = async function(seed) {
    const identity = await generateIdentity(seed)
    const dbClient = await setThreadDb(identity)
    return {
        client: dbClient,
        identity: identity
    }
}

const generateIdentity = async (seedString) => {
    const seed = seedString.substring(0,32)
    console.log("seed:",seed)
    const seedPhase = new Uint8Array(Buffer.from(seed))
    const identity = PrivateKey.fromRawEd25519Seed(seedPhase)
    console.log("identity generated!!",identity)
    return identity
}

const setThreadDb = async (identity)=>{
    const userAuth = await createUserAuth(keyInfo.key,keyInfo.secret)
    const privateKey = await PrivateKey.fromString(identity.toString())
    const dbClient = await Client.withUserAuth(userAuth)
    const token = await dbClient.getToken(privateKey)
    console.log("ThreadDB setup done!!!")
    return dbClient
}

export const registerUser = async function(name, email, password, privateKey, userType, address,
                                           identity,dbClient){
    try {
        const query = new Where('email').eq(email)
        const threadId = ThreadID.fromBytes(threadDbId)
        const result = await dbClient.find(threadId, 'RegisterUser', query)
        if (result.length>0) {
            console.log("Email exists!")
            return false
        }
        let publicKey = e2e.getPublicKey(privateKey)
        const hashPass = e2e.convertPass(password)
        const data = {
            name: name,
            email: email,
            address: address,
            password: hashPass.toString("hex"),
            publicKey: publicKey.toString("hex"),
            userType: userType,
            documentId: ["-1"]
        }
        const insertStatus = await insertData(dbClient,data,'RegisterUser')
        console.log("User registration status:",insertStatus)
        return true
    }catch(err){
        throw err
    }
}

const insertData = async (dbClient,data,schemaName) =>{
    const threadId = ThreadID.fromBytes(threadDbId)
    const insertStatus = await dbClient.create(threadId, schemaName, [data])
    console.log("Insert Data status:",insertStatus)
    return true
}

export const loginUser = async function(email,password,identity,dbClient){
    try {
        const hashPass = e2e.convertPass(password)
        const query = new Where('email').eq(email)
        const threadId = ThreadID.fromBytes(threadDbId)
        const result = await dbClient.find(threadId, 'RegisterUser', query)
        console.log("RESULT:",result)
        if (result.length<1){
            console.log("Please register user!")
            return null
        }
        if (result[0].password!==hashPass.toString("hex")){
            console.log("Wrong pass!!")
            return null
        }
        return result[0]._id
    }catch (err) {
        throw err
    }
}

export const getAllUsers = async function(dbClient,loggedUser){
    console.log("Logg:",loggedUser)
    //const query = new Where('email').ne(loggedUser)
    const threadId = ThreadID.fromBytes(threadDbId)
    const registeredUsers = await dbClient.find(threadId, 'RegisterUser', {})
    console.log("REGISTERED:",registeredUsers)
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
        console.log("RESULT:",result)
        if (loggedUser === result.email) {
            caller =value
        }else if (result.userType === userType.notary){
            notaryArray.push(value)
        }
        else {
            userArray.push(value)
        }
    }
    console.log("UserArray:",userArray)
    console.log("nota:",notaryArray)
    console.log("caller:",caller)
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
        const query = new Where('email').eq(party[i].email)
        const user = await dbClient.find(threadId, 'RegisterUser', query)
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


export const getAllFile = async function(dbClient, loggedUser, tx, writeContracts,address){
    const threadId = ThreadID.fromBytes(threadDbId)
    const query = new Where('email').eq(loggedUser)
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

export const downloadFile = async function (name, key, loggedUser,documentLocation, password){

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



