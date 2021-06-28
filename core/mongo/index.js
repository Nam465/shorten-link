const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mongo_namluong:mongo_namluong@cluster0.zrhm7.mongodb.net/MIN_LINK_PROJECT?retryWrites=true&w=majority";
const DB_NAME = 'MIN_LINK_PROJECT'
const KEY_COLECTION = 'KEY_DB'
const URL_COLLECTION = 'URL_DB'

let _db = null
let _key_collection = null
let _url_collection = null

const client = new MongoClient(
    uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)


const mongoUlti = {
    _db,
    _key_collection,
    _url_collection,
    connect: async () => {
        await client.connect()
        mongoUlti._db = client.db(DB_NAME)
        mongoUlti._key_collection = mongoUlti._db.collection(KEY_COLECTION)
        mongoUlti._url_collection = mongoUlti._db.collection(URL_COLLECTION)
    },
}

module.exports = mongoUlti