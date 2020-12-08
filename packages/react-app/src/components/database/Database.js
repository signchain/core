import React,{useState} from 'react'
import {createUserAuth, Client,PrivateKey} from '@textile/hub'

export default function Database(){

    const [dbClient,setDBClient] = useState(null)
    const [threadID,setThreadID] = useState(null)
    const [dbInfo,setDB] = useState(null)

    const keyInfo = {
        key:'be645tj5wtjuginby3fwnqhe57y',
        secret:'bcm7zjaxlipajgsm6qd6big7lv52cihf2whbbaji'
    }

    const registrationSchema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'RegisterUser',
        type: 'object',
        properties: {
            _id: {type:'string'},
            did: {type:'string'},
            name: {type: 'string'},
            email: {type: 'string'},
            address: { type: 'string'},
            publicKey: { type: 'string'},
            userType: { type: 'number'},
            nonce: {type:'number'},
            documentInfo: {
                type:'array',
                items: {
                    type: 'object',
                    properties: {
                        documentId: {type:'string'},
                        signatureId: {type:'string'}
                    }
                }
            }
        },
    }

    const documentSchema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'Document',
        type: 'object',
        properties: {
            _id: {type:'string'},
            title: {type:'string'},
            documentHash : {type: 'string'},
            fileLocation: {type: 'string'},
            fileName: {type: 'string'},
            key: {
                type: 'array',
                items :{
                    type: 'object',
                    properties:{
                        address: {type: 'string'},
                        cipherKey: {type:'string'}
                    }
                }
            }
        },
    }

    const signatureDetails = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'SignatureDetails',
        type: 'object',
        properties: {
            _id: {type:'string'},
            signers:{
                type:'array',
                items: {type:'string'}
            },
            signature: {
                type: 'array',
                items: {
                    type:'object',
                    properties:{
                        signer: {type:'string'},            //user address
                        signatureDigest: {type: 'string'},
                        timeStamp: {type: 'string'},
                        nonce: {type: 'number'}
                    }
                },
            }
        }
    }

    const setThreadDb = async ()=>{
        const userAuth = await createUserAuth(keyInfo.key,keyInfo.secret)
        const privateKey = await PrivateKey.fromRandom()
        console.log("User:",privateKey)
        const dbClient = await Client.withUserAuth(userAuth)
        const token = await dbClient.getToken(privateKey)
        console.log("ThreadDB setup done!!!")
        setDBClient(dbClient)
    }

    const createDB = async ()=>{
        const threadId = await dbClient.newDB()
        console.log("threadID:",threadId.buf)
        console.log("Copy the threadID and paste it in index.js file!!!")
        setThreadID(threadId)
        console.log("DB created!!!")
    }

    const getDBInfo = async ()=>{
        console.log("Creating DB!!")
        const dBInfo = await dbClient.getDBInfo(threadID)
        console.log("dbInfo:",dBInfo)
        setDB(dBInfo)
    }

    const createCollection = async ()=>{
        console.log("Creating tables!!!")
        const result1 = await dbClient.newCollection(threadID, {name:'RegisterUser', schema: registrationSchema})
        const result2 = await dbClient.newCollection(threadID, {name:'Document', schema: documentSchema})
        await dbClient.newCollection(threadID, {name:'SignatureDetails', schema: signatureDetails})
        console.log("Tables created!!:")
        setThreadID(threadID)
    }

    const getRegisteredUsers = async ()=>{
        console.log("Getting users!!!")
        const users = await dbClient.find(threadID, 'RegisterUser', {})
        console.log('Users:', users)
    }

    const getAllDocuments = async ()=>{
        console.log("Getting documents")
        const users = await dbClient.find(threadID, 'Document', {})
        console.log('Users:', users)
    }

    return(
        <div>
            <h1>Database Functions</h1>
            <button onClick={setThreadDb}>Setup</button><br/><br/>
            <button onClick={createDB}>Create DB</button><br/><br/>
            <button onClick={getDBInfo}>Get DB Info</button><br/><br/>
            <button onClick={createCollection}>Create Table</button><br/><br/>
            <button onClick={getRegisteredUsers}>Get All Users</button><br/><br/>
            <button onClick={getAllDocuments}>Get All Document</button><br/><br/>
        </div>
    )
}