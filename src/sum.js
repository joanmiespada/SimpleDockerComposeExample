import {collectionTrans, collectionUsers } from './constants'

class Sum
{
    constructor(database)
    {
        this.database= database
    }

    async start()
    {
        const collectUsers = this.database.collection(collectionUsers)
        const collecTrans = this.database.collection(collectionTrans)
        const cursorTrans =  collecTrans.find({})

        const counters = {smallest: 0, largest:0, withoutRef:{items:0, total:0 } }

        while(cursorTrans.hasNext() && !cursorTrans.isClosed())
        {
            const doc = await cursorTrans.next()
            //console.log(doc.data.transactions[0])

            //cursorTrans.forEach(doc => 
            //cursorTrans.next().then( doc=>
            const transactions = doc.data.transactions
            for(let i=0; i<transactions.length; i++)
            {
                const operation = transactions[i]
                //doc.data.transactions.forEach( async (operation) =>{ 
                    
                if(operation.confirmations > 6)
                {

                    
                    const user = await collectUsers.findOne({ address: operation.address })
                    
                    if(user){
                        let newTotalAmount =0, newTotalTransactions=0;

                        newTotalAmount = user.totalAmount + operation.amount
                        newTotalTransactions = user.transactions +1
                        //console.log(`${user._id}-${user.name}  currentAmmount: ${user.totalAmount} newAmount:${operation.amount} direction:${operation.category}`)
                        
                        await collectUsers.updateOne( {_id: user._id}, {$set: { totalAmount: newTotalAmount, transactions: newTotalTransactions   } }  ) 

                        //console.log(` ${user._id} ${user.name} new ammont ${newTotalAmount} `)
                        
                    }else{
                        counters.withoutRef.items +=1
                        counters.withoutRef.total +=operation.amount
                    }

                    if(operation.amount > counters.largest )
                            counters.largest = operation.amount
                    if(operation.amount < counters.smallest)
                            counters.smallest = operation.amount

                    //userTotalAmoun.map( (x,i)=> `${i}  ammount: ${x}`)    
                }//else
                 //console.log(`transaction not enough confirmations `)    
                //})
            }
         //)
        }
        
        return counters;
        
        
    }
    
}

export default Sum