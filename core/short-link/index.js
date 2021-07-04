
const _db = require('../mongo/index')
const Okr = require('../okg')
const { UrlModel } = require('../mongo/documents')

const _url_collection = _db._url_collection
const HOST = process.env.HOST

class ShortLink {

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

    async delete(hash) {
        /* remove url */
        await _url_collection.deleteOne(
            { _id: { $eq: hash} }
        )
        /* release key */
        let okg = new Okr()
        await okg.releaseKey(hash)
    }

    findResourceLink(hash) {
        /* Create resource link */
        return HOST + '/' + hash
    }

}

module.exports = ShortLink