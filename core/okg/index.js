const mongoUlti = require('../mongo')
const _key_collection = mongoUlti._key_collection

class OKG {

    constructor() {

    }

    async dateKey() {
        /*
        1) Find key with available is true
        2) Update feild available to false
        3) Return key
        */
        const cursor = await _key_collection.findOneAndUpdate(
            { "available": true },
            { $set: { available: false } }
        )

        return cursor.value._id
    }

    async releaseKey(hash) {
        /*
        1) Update feild available of key to true
        */
        await _key_collection.updateOne(
            { _id: { $eq: hash} },
            { $set: { available: hash } }
        )

    }

    async createOptionalKey() {
        /*
        1) Check a key is not includes special digit
        2) Some specific logic
        */
    }

    async deleteKey() {
        /*
        1) Delete key base on key _id
        */
    }
}

module.exports = OKG