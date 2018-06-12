import {collectionUsers } from './constants'

class Render
{
    constructor(database)
    {
        this.database= database
    }

    renderUser(user)
    {
        //console.log(user)
        console.log(`Deposited for ${user.name}: count=${user.transactions} sum=${user.totalAmount}`)//eslint-disable-line
    }

    draw(tops)
    {
        return new Promise( (resolve,reject) => {

            const collectUsers = this.database.collection(collectionUsers)
            const cursor  = collectUsers.find().sort({order:1})
            
            cursor.toArray().then(list => {
                list.forEach( user => this.renderUser(user) )
                console.log(`Deposited without reference: count=${tops.withoutRef.items} sum=${tops.withoutRef.total}`)//eslint-disable-line
                console.log(`Smallest valid deposit: ${tops.smallest}`)//eslint-disable-line
                console.log(`Largest valid deposit: ${tops.largest}`)//eslint-disable-line
                resolve()
            }).catch(err => reject(err))  
        })
    }
}

export default Render