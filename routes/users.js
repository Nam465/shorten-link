var express = require('express');
var router = express.Router();
var axios = require('axios')

const _db = require('../core/mongo')
const _url_collection = _db._url_collection
const _user_collection = _db._user_collection
const jwt = require('jsonwebtoken')
const env = require('../env')
const { UserModel } = require('../core/mongo/documents')


/* GET users listing. */
router.get('/authenticate-with-fb', async (req, res, next) => {
	try {
		/* User token */
		const fb_token = 'EAAEtaZB04qzABACUW8sPLSuobp4ZC1Fr1Axqmk7ijkRB1EodEWcbQZBD0b6H6tWZAVZC6qIkAdJTfipO5nxyMI6wAuRYRKXm3FBhm0kGM0Os6TeaEDlZA8o3nggBlG27Q0ACy5hfE9OrCZC6TWEj4dErK52GOcnYcT11ZCGmEaf2sfoNZAU5Q8A4jfkVZAqcwIHn9gNt9Ej3yVHalruBPFCoZAP'
		const fb_user_id = '103779895306735'

		/* Search user information from Fb */
		let endpoint = `https://graph.facebook.com/${fb_user_id}?access_token=${fb_token}&fields=birthday,email,hometown,name,picture`
		let fb_user = await axios.get(endpoint)
		let status = fb_user.status

		/* Authenticate fb token */
		if (status != '200') {
			res.status(400)
			throw new Error('Fb status code is bad')
		}

		let data = fb_user.data
		let fullName = data.name
		let email = data.email
		let avatar = data.picture.data.url

		/* Find User in our DB , if not then create one base on id */
		const user_information = await _user_collection.findOne(
			{ FacebookID: { $eq: fb_user_id } }
		)
		let _id = null

		if (!user_information) {
			const user = new UserModel(
				avatar,
				email,
				fb_user_id,
				fullName
			)
			const new_user_information = await _user_collection.insertOne(user)
			_id = new_user_information.insertedId
		} else
			_id = user_information._id

		/* Create token */
		const expiresIn = '90 days'
		const jwt_token = jwt.sign(
			{ _id },
			env.APP_SECRET,
			{ expiresIn }
		)

		res.json({
			expiresIn,
			jwt: jwt_token
		})
	} catch (error) {
		if (res.statusCode == 200)
			res.status(500)
		res.send({
			error: error.name,
			message: error.message
		})
	}
});



module.exports = router;
