var express = require("express")
var router = express.Router()
var axios = require("axios")

const _db = require("../core/mongo")
const _url_collection = _db._url_collection
const _user_collection = _db._user_collection
const jwt = require("jsonwebtoken")
const { UserModel } = require("../core/mongo/documents")

/* GET users listing. */
router.get("/authenticate-with-fb", async (req, res, next) => {
    try {
        /* User token */
        const fb_token = req.get("Authorization")
        const fb_user_id = req.query.fb_user_id

        /* Search user information from Fb */
        let endpoint = `https://graph.facebook.com/${fb_user_id}?access_token=${fb_token}&fields=birthday,email,hometown,name,picture`
        let fb_user = await axios.get(endpoint)
        let status = fb_user.status

        /* Authenticate fb token */
        if (status != "200") {
            res.status(400)
            throw new Error("Fb status code is bad")
        }

        let data = fb_user.data
        let fullName = data.name
        let email = data.email
        let avatar = data.picture.data.url

        /* Find User in our DB , if not then create one base on id */
        const user_information = await _user_collection.findOne({
            FacebookID: { $eq: fb_user_id },
        })
        let _id = null

        if (!user_information) {
            const user = new UserModel(avatar, email, fb_user_id, fullName)
            const new_user_information = await _user_collection.insertOne(user)
            _id = new_user_information.insertedId
        } else _id = user_information._id

        /* Create token */
        const expiresIn = "90 days"
        const jwt_token = jwt.sign({ _id }, process.env.APP_SECRET, {
            expiresIn,
        })

        res.json({
            expiresIn,
            jwt: jwt_token,
            user: {
                fullName,
                email,
                avatar,
            },
        })
    } catch (error) {
        if (res.statusCode == 200) res.status(500)
        res.send({
            error: error.name,
            message: error.message,
        })
    }
})

router.post("/register", async (req, res, next) => {
    try {
        // Get user information
        const email = req.body.email
        const fullname = req.body.fullname
        const password = req.body.password
        const avatar = req.body.avatar
        // Validate
        if (!email || !fullname || !password) {
            throw new Error("User information is't valid")
        }
        const returnedUser = await _user_collection.findOne({
            Email: { $eq: email },
        })
        if (returnedUser) {
            throw new Error("User is duplicated")
        }
        // Create new user
        const encryptedPassword = jwt.sign(password, process.env.APP_SECRET)
        await _user_collection.insertOne(
            new UserModel(avatar, email, null, fullname, encryptedPassword)
        )
        return res.json({
            message: "Create success",
        })
    } catch (error) {
        if (res.statusCode == 200) res.status(500)
        res.json({
            error: error.name,
            message: error.message,
        })
    }
})

router.post("/login", async (req, res, next) => {
    try {
        // Get user information
        const email = req.body.email
        const password = req.body.password
        // Validate
        const returnedUser = await _user_collection.findOne({
            Email: { $eq: email },
        })
        if (!returnedUser) {
            throw new Error("Email or password is't valid")
        }

        const decoded = jwt.decode(
            returnedUser.Password,
            process.env.APP_SECRET
        )
        // Create token
        if (decoded == password) {
            const expiresIn = "90 days"
            const jwt_token = jwt.sign(
                { _id: returnedUser._id },
                process.env.APP_SECRET,
                {
                    expiresIn,
                }
            )
			delete returnedUser.Password
            res.json({
                expiresIn,
                jwt: jwt_token,
                user: returnedUser
            })
        } else {
            throw new Error("Email or password is't valid")
        }
    } catch (error) {
        if (res.statusCode == 200) res.status(500)
        res.json({
            error: error.name,
            message: error.message,
        })
    }
})

module.exports = router
