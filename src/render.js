import {collectionUsers } from './constants'

class Render
{
    constructor(database)
    {
        this.database= database
    }

    renderUser(user)
    {
        console.log(`Deposited for ${user.name}: count=${user.transactions} sum=${user.totalAmount}`)
    }

    async draw(tops)
    {

        const collectUsers = this.database.collection(collectionUsers)

        const cursor = collectUsers.find({}).sort({order:1})

        while(cursor.hasNext() && !cursor.isClosed())
        {
            const user = await cursor.next()
            this.renderUser(user)
        }
        console.log(`Deposited without reference: count=${tops.withoutRef.items} sum=${tops.withoutRef.total}`)
        console.log(`Smallest valid deposit: ${tops.smallest}`)
        console.log(`Largest valid deposit: ${tops.largest}`)

    }
}

export default Render