import mongo from 'mongodb'
import StoreDB from './storedb'
import Calculate from './calculate'
import Render from './render'
import {urlMongoContainer, urlMongoLocalhost, dbName} from './constants'


const files = [ 'transactions-1.json',
                'transactions-2.json']

const listOfusers = [
    {name:'Wesley Crusher', address:'mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ'},  
    {name:'Leonard McCoy', address:'mmFFG4jqAtw9MoCC88hw5FNfreQWuEHADp'},
    {name:'Jonathan Archer', address:'mzzg8fvHXydKs8j9D2a8t7KpSXpGgAnk4n'},
    {name:'Jadzia Dax', address:'2N1SP7r92ZZJvYKG2oNtzPwYnzw62up7mTo'},
    {name:'Montgomery Scott', address:'mutrAf4usv3HKNdpLwVD4ow2oLArL6Rez8'},
    {name:'James T. Kirk', address:'miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM'},
    {name:'Spock', address:'mvcyJMiAcSXKAEsQxbW9TYZ369rsMG6rVV'}
]
let urlMongo
if(process.env.NODE_ENV === 'development')
    urlMongo = urlMongoLocalhost
else
    urlMongo = urlMongoContainer

try{

    mongo.MongoClient.connect(urlMongo).then( client =>{

        const database = client.db(dbName)

        const data = new StoreDB(database)

        data.loadMainData(files,listOfusers).then(()=>{
            
            const operate = new Calculate(database)

            operate.start()
                .then((tops)=> {
                    
                    const render = new Render(database)
                    render.draw(tops).then( ()=> client.close() )
                } )
                .catch( err=> { 
                    console.log(err) //eslint-disable-line 
                    client.close()
                })

        }).catch( err=> {
            console.log(err)//eslint-disable-line 
            client.close()
        })
    }).catch( err=> console.log(err))//eslint-disable-line 
            
}catch(err)
{
    console.log(err)//eslint-disable-line 
}




