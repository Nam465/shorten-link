
const _db = require('../mongo/index')
const Okr = require('../okg')
const env = require('../../env')
const { UrlModel } = require('../mongo/documents')

const _url_collection = _db._url_collection
const _key_collection = _db._key_collection
const HOST = env.HOST

class Url {

    async createUrl(
        userId,
        originUrl,
        expire
    ) {
        /* Find key */
        const okr = new Okr()
        const hash = await okr.dateKey()

        let url = new UrlModel(
            hash,
            userId,
            originUrl,
            expire
        )

        /* Mongodb auto check duplicate key */
        await _url_collection.insertOne(url)
        return this.findResourceLink(url._id)

    }

    async readUrlByHash(hash) {
        const url = await _url_collection.findOne(
            { _id: { $eq: hash }}
        )

        findResourceLink(hash)
        
        return resource
    }

    async deleteUrl(hash) {
        /* remove url */
        await _url_collection.deleteOne(
            { _id: { $eq: hash} }
        )
        /* release key */
        await _key_collection.updateOne(
            { _id: { $eq: hash} },
            { $set: { available: hash } }
        )
    }

    findResourceLink(hash) {
        /* Create resource link */
        return HOST + '/' + hash
    }

}

module.exports = Url