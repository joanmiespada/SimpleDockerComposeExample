import path from 'path'
import fs from 'fs'
import {collectionTrans, collectionUsers, everyThingIsOk } from './constants'
import uuid from 'uuid/v1'

class StoreDB
{ 
    constructor(database)
    {
        this.database= database
    }
    
    importFile(fileToBeImported)
    {
        var contents = fs.readFileSync(fileToBeImported, 'utf8');
        const data = JSON.parse(contents)
        return data
    }

    storeTransactions(collection, documents)
    {
        return new Promise( async (resolve, reject) => {

            const docus = []
            documents.forEach((data,i)=> docus.push({_id:i, data }) )
           
            collection.insertMany(docus).then((rest)=>{
                if( rest.result.n !== documents.length || rest.result.ok !== everyThingIsOk )
                    reject('insert document fail')
                else
                    resolve()
            })
        })
    }

    storeUsers(collection, users)
    {
        return new Promise ( (resolve,reject) =>{

            const finalUserDocs = []

            users.forEach( (user,i)=> 
                finalUserDocs.push( {_id:uuid(), order:i, name: user.name, 
                                    address: user.address, totalAmount:0, transactions: 0}   )  )
 
            collection.insertMany(  finalUserDocs ).then( rest =>{
                if( rest.result.n !== users.length || rest.result.ok !== everyThingIsOk )
                    reject(`error storing users`)
                else
                    resolve()
            }) 
            
        })
        
    }

    loadFiles(filesToRead)
    {
        
        const docs= []
        filesToRead.forEach( file=>{     
            docs.push( this.importFile( path.resolve(__dirname,'..','transactions', file)))
        })
        return docs
    }

    loadMainData(filesToRead, users)
    {
    
        return new Promise( (resolve,reject) => {

            try{
                
                const docsToProcess = this.loadFiles(filesToRead)
                
                let collection1 = this.database.collection(collectionTrans)

                collection1.remove().then(()=>{

                    this.storeTransactions(collection1, docsToProcess).then( ()=>{

                        let collection2 = this.database.collection(collectionUsers)
                        collection2.remove().then(()=>{

                            this.storeUsers(collection2, users).then(()=>{
                                resolve()
                            })

                        }) 
    
                    })
                    
                }) 

            }catch(err) {
                reject(err)
            }

        })
    }
}

export default StoreDB