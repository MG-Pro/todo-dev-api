const express = require('express')

const router = express.Router()

router.get('*', (req, res) => {
  res.send('<h1 style="font-family: sans-serif">TodoDev App API</h1>')
})

module.exports = router
