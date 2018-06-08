import path from 'path'
import Immutable from 'immutable'
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

    async storeInDB(collection, documents)
    {       
        for(let i=0;i<documents.size;i++)
        {
            documents.get(i).then( (data) => collection.insertOne({_id: i, data}))        
        }
    }

    async storeUsers(collection, users)
    {
        for(let i=0; i<users.size;i++){
            const user = await users.get(i)

            const aux = await collection.insert( {_id:uuid(), order:i, name: user.name, address: user.address, totalAmount:0, transactions: 0} ) 
            console.log(aux.result) 
            console.log(`name: ${user.name}`)
            
            if(aux.result.ok !== 1)
                throw new Error(`user with name: ${user.name} and id ${user.id} not saved correctly`)
        }
    }

    loadFiles(filesToRead)
    {
        
        const docs= []
        filesToRead.map( x=>{     
            const doc = this.importFile( path.resolve(__dirname,'..','transactions', x))
            docs.push(doc)
        })
        return new Immutable.fromJS(docs)
    }

    async loadMainData(filesToRead, users)
    {
    
        try{
            
            const docsToProcess = this.loadFiles(filesToRead)
            
            let collection1 = this.database.collection(collectionTrans)
            collection1.remove() 

            await this.storeInDB(collection1, docsToProcess)

            let collection2 = this.database.collection(collectionUsers)
            collection2.remove() 

            await this.storeUsers(collection2, users)
            
        }catch(err) {
            console.log(err) //eslint-disable-line 
        }
    }
}

export default CreateDB