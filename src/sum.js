import {collectionTrans, collectionUsers } from './constants'

const Receive = 'receive' 
const Send = 'send'

const printArray = (items) =>
{
    items.map( (x,i)=> console.log(`x:${x} i:${i}`) )
}

class Sum
{
    constructor(database)
    {
        this.database= database
    }

    async start()
    {
        
           

            let collecTrans = this.database.collection(collectionTrans)
            const cursorTrans =  collecTrans.find({})

            cursorTrans.forEach(doc => {
                doc.data.transactions.forEach( async (operation) =>{ 
                    

                    const collect = this.database.collection(collectionUsers)
                    const user = await collect.findOne({ address: operation.address })
                    
                    if(user && user._id===0){
                        let newTotalAmount =0;

                       
                        newTotalAmount = user.totalAmount + operation.amount
                        
                        console.log(`${user._id}-${user.name}  currentAmmount: ${user.totalAmount} newAmount:${operation.amount} direction:${operation.category}`)
                        
                        await collect.updateOne( {_id: user._id}, {$set: { totalAmount: newTotalAmount  } }  ) 

                        console.log(` ${user._id} ${user.name} new ammont ${newTotalAmount} `)
                        
                    }

                    //userTotalAmoun.map( (x,i)=> `${i}  ammount: ${x}`)    
                    
                })
            })
            
        
        
    }
    
}

export default Sum