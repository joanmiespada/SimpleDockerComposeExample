import path from 'path'
import fs from 'fs'
import {collectionTrans, collectionUsers } from './constants'
import uuid from 'uuid/v1'

class CreateDB
{ 
    constructor(database)
    {
        this.database= database
    }
    
    async importFile(fileToBeImported)
    {
        var contents = fs.readFileSync(fileToBeImported, 'utf8');
        const data = JSON.parse(contents)
        return data
    }

    async storeTransactions(collection, documents)
    {       
        for(let i=0; i<documents.length; i++)
        {
            documents[i].then(async (data)=> 
            { 
                const rest = await collection.insertOne({_id: i, data})
                if( rest.result.n !== 1 || rest.result.ok !== 1 )
                    throw new Error('insert document fail')
                
            })
        }
    }

    async storeUsers(collection, users)
    {
        const finalUserDocs = []
        for(let i=0; i<users.length;i++){
            //console.log( `${i} ${users[i].name}` )
            const user = users[i]
            const userDoc = {_id:uuid(), order:i, name: user.name, address: user.address, totalAmount:0, transactions: 0}
            finalUserDocs.push(userDoc)
        }
        //console.log(finalUserDocs)
        const rest = await collection.insertMany(  finalUserDocs ) 
        //console.log(rest)
        if( rest.result.n !== 7 || rest.result.ok !== 1 )
            throw new Error(`error storing users`)
    }

    loadFiles(filesToRead)
    {
        
        const docs= []
        filesToRead.map( x=>{     
            const doc = this.importFile( path.resolve(__dirname,'..','transactions', x))
            docs.push(doc)
        })
        return docs
    }

    async loadMainData(filesToRead, users)
    {
    
        try{
            
            const docsToProcess = this.loadFiles(filesToRead)
            
            let collection1 = this.database.collection(collectionTrans)
            collection1.remove() 

            await this.storeTransactions(collection1, docsToProcess)

            let collection2 = this.database.collection(collectionUsers)
            collection2.remove() 

            await this.storeUsers(collection2, users)
            
        }catch(err) {
            console.log(err) //eslint-disable-line 
        }
    }
}

export default CreateDB