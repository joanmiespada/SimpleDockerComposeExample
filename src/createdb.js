import path from 'path'
import mongo from 'mongodb'
import Immutable from 'immutable'
import fs from 'fs'
const dbname = 'blockchain'
const urlmongo =  'mongodb://localhost:27017'
const dbcollection = 'transactions'

class CreateDB
{ 
    

    async importFile(fileToBeImported)
    {
        var contents = fs.readFileSync(fileToBeImported, 'utf8');
        const data = JSON.parse(contents)
        return data
    }

    async storeInDB(documents)
    {
        let client, database
        try{
            client = await mongo.MongoClient.connect(urlmongo)
            database = await client.db(dbname)

            const collection = database.collection(dbcollection)

            collection.remove() 
            
            for(let i=0;i<documents.size;i++)
            {
                const aux = await documents.get(i)
                collection.insert({_id: i, doc: aux})
                 
            }

        }catch(err) {
            console.log(err)
        }finally{
            

            client.close()
        }
    }

    start(filesToRead)
    {
        const files = new Immutable.List(filesToRead)
        const docs= []
        files.map( x=>{     
            const doc = this.importFile( path.resolve(__dirname,'..','transactions', x))
            docs.push(doc)
        })
        const docsToProcess = new Immutable.fromJS(docs)
        this.storeInDB(docsToProcess)
        
    }
}

export default CreateDB