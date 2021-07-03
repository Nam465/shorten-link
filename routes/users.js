var express = require('express');
var router = express.Router();
var axios = require('axios')

const _db = require('../core/mongo')
const _url_collection = _db._url_collection
const _user_collection = _db._user_collection

/* GET users listing. */
router.get('/login', async (req, res, next) => {
  try {
    /* User token */
    const token = 'EAAEtaZB04qzABAFJcwp32sCD7A6P2MfK1PYVohvyC0UX66rZB4tebzUb9zAzc8fpCgZCQKeqC6069QXTiNrLngxHiRAskcjcNzKSiIOsJ9byK11I6BSer9oiuk1baU24ZA4ySrYcR6FyTgUVN47MBhdbdAyOQfsdzo2wrRUCmZAPSZCRYn4jHKKq6i6m3F1d5ZC1yFe8uiYozHbIh66VdfN'
    const user_id = '103779895306735'

    /* Search user information from Fb */
    let endpoint = `https://graph.facebook.com/${user_id}?access_token=${token}&fields=birthday,email,hometown,name,picture`
    let user_fb = await axios.get(endpoint)
    let status = user_fb.status
    if (status != '200')
      throw new Error('Fb status code is bad')
    let data = user_fb.data
    let id = user_fb.id
    let fullName = user_fb.userName
    let email = user_fb.email
    let avatar = user_fb.picture.data.url

    /* Use user email to search in our DB */

    
    console.log(data);

    res.send('respond with a resource');
  } catch (error) {
    res.send({
      error: error.name,
      message: error.message
    })
  }


});

module.exports = router;
