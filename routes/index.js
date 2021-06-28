var express = require('express');
var router = express.Router();
const OKG = require('../core/okg')
const Url = require('../core/url')

router.get('/', async (req, res, next) => {
  try {
    let okg = new OKG()
    let key = await okg.dateKey()

    res.json({
      key: key
    })
  } catch (error) {
    res.json({
      message: 'error'
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

      let url = new Url()
      const resourceLink = await url.createUrl(
        null,
        originUrl,
        expire
      )

      res.json({ resourceLink })
    } catch (e) {
      console.error(e);
      res.json({
        message: 'error'
      })
    }



  }
)

module.exports = router;
