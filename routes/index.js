var express = require('express');
var router = express.Router();
const OKG = require('../core/okg')
const ShortLink = require('../core/short-link')
const shortLinkInstant = new ShortLink()

const _db = require('../core/mongo')
const _url_collection = _db._url_collection


router.get('/:hash', async (req, res, next) => {
	try {
		/* 
		  Nếu tồn tại 1 short link với mã hash được cho 
			- Mã hash này có đủ điều kiện được đọc không ? ( check expire time )
			- Redirect tới Origin link
		*/
		const hash = req.params.hash
		const document = await _url_collection.findOne(
			{ _id: { $eq: hash } }
		)

		if (!document)
			throw Error('Url not exsit')

		const currentTime = Date.now
		if (currentTime > document.expireDate)
			throw Error('Url is out date')

		res.redirect(document.originUrl)

	} catch (error) {
		console.log(error)

		res.json({
			error: error.name,
			message: error.message || 'Có lỗi xảy ra'
		})
	}
})

router.post(
	'/create-shorten-link',
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

			/* Validate */
			if (!expire) expire = null

			/* Need more validate ... */

			const resourceLink = await shortLinkInstant.createUrl(
				null,
				originUrl,
				expire
			)

			res.json({ resourceLink })
		} catch (e) {
			console.error(e);
			res.json({
				error: 'error'
			})
		}
	}
)


router.delete('/delete/:hash', async (req, res, next) => {
	try {
		/* Check permision */


		/* Nếu permision pass */

		const hash = req.params.hash
		await shortLinkInstant.delete(hash)
		res.json({
			message: 'delete success'
		})
	} catch (error) {
		console.log(error);
		res.json({
			error: 'error'
		})
	}
})

module.exports = router;

