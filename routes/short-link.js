var express = require('express');
var router = express.Router();
const OKG = require('../core/okg')
const ShortLink = require('../core/short-link')
const shortLinkInstant = new ShortLink()

const _db = require('../core/mongo')
const _url_collection = _db._url_collection
const _user_collection = _db._user_collection
const jwt = require('jsonwebtoken')

router.post(
    '/',
    async (req, res, next) => {
        try {
            /* 
            Body
              - original link
              - expire
              - optional key
              - user token 
            */
            const body = req.body
            let originUrl = body.originUrl
            let expire = body.expire
            let optionalKey = body.optionalKey
            let userToken = body.userToken


            /* Find user _id , If token not exsit just pass */
            const bearerToken = req.get('Authorization')
            let _id = null
            if (bearerToken) {
                const token = bearerToken.slice(7)
                const payload = jwt.verify(token, process.env.APP_SECRET)
                _id = payload._id
            }


            /* Validate */
            if (!expire) expire = null

            /* Need more validate ... */

            const resourceLink = await shortLinkInstant.createUrl(
                _id,
                originUrl,
                expire
            )

            res.json({ resourceLink })
        } catch (e) {
            console.log(e.message);
            if (res.statusCode == 200)
                res.status(500)
            res.json({
                error: e.name,
                message: e.message
            })
        }
    }
)

router.delete('/:hash', async (req, res, next) => {
    try {
        /* Check permision */
        const hash = req.params.hash
        const bearerToken = req.get('Authorization')
        if (!bearerToken) {
            res.status(401)
            throw new Error('No permision')
        }
        const token = bearerToken.slice(7)
        const payload = jwt.verify(token,  process.env.APP_SECRET)
        const _id = payload._id

        const url = await _url_collection.findOne(
            { _id: { $eq: hash } }
        )

        if (
            !url ||
            url.userId != _id
        ) {
            res.status(401)
            throw new Error('No permision')
        }

        /* Nếu permision pass */

        await shortLinkInstant.delete(hash)
        res.json({
            message: 'delete success'
        })
    } catch (error) {
        if (res.statusCode == 200)
            res.status(500)
        res.json({
            error: error.name,
            message: error.message
        })
    }
})

router.get('/all', async (req, res, next) => {
    try {
        /*
            - Sort
            - Filter
            - Pagination
                . Page is 0 index
                . Should return total pages


        */

        /* Input */
        const page = req.query.page || 0
        
        /* Verify Input */
        if (page < 0) {
            res.status(400)
            throw new Error('Page number is invalid')
        }

        /* Verify token */
        const bearerToken = req.get('Authorization')
        if (!bearerToken) {
            res.status(401)
            throw new Error('No permision')
        }
        const token = bearerToken.slice(7)
        const payload = jwt.verify(token,  process.env.APP_SECRET)
        const _id = payload._id

        /* Retrive from DB */
        const limit = 20
        const skip = page * limit

        const totalItems = await _url_collection.count(
            { userId: { $eq: _id } }
        )
        const totalPages = Math.ceil(totalItems / limit) 

        const items = await _url_collection.find(
            { userId: { $eq: _id } }
        )
        .limit(limit)
        .skip(skip)
        .toArray()

        res.json({
            totalItems,
            currentPage: page,
            totalPages,
            items 
        })

    } catch (e) {
        if (res.statusCode == 200)
            res.status(500)

        res.json({
            error: e.name,
            message: e.message
        })
    }

})

router.get('/:hash', async (req, res, next) => {
    try {
        /* Input */
        const hash = req.params.hash
        const bearerToken = req.get('Authorization')

        /*  
            Verify input
            - if url have no owner => anyone can read
            - else user must own it
        */
        const url = await _url_collection.findOne(
            { _id: { $eq: hash } }
        )

        if (url.userId) {
            if (!bearerToken) {
                res.status(401)
                throw new Error('No permision')
            }

            if (bearerToken) {
                const token = bearerToken.slice(7)
                const payload = jwt.verify(token,  process.env.APP_SECRET)
                const _id = payload._id
        
                if (_id != url.userId) {
                    res.status(401)
                    throw new Error('No permision')
                }
            }

        }

        /* Return data */
        res.json(url)


    } catch (e) {
        if (res.statusCode == 200)
            res.status(500)

        res.json({
            error: e.name,
            message: e.message
        })
    }
})

module.exports = router;

