var fs = require('fs')

/* 
1) Create Data
2) Shuffle Data
3) Create File
4) Save File
*/

const GAUS = require('./GAUS-algorithm')
const shuffle = require('./shuffle-algorithm')
const Base32 = require('./base32')

const source = new Base32().get()
const keys = GAUS(
    source,
    5,
    100000,
    0,
)

shuffle(keys)

let documents = keys.map(key => {
    return {
        _id: key,
        available: true
    }
})

fs.writeFile(
    'keys.json',
    JSON.stringify(documents),
    'utf8',
    () => {
        
    }
)