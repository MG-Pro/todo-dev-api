const express = require('express')

const router = express.Router()

router.get('*', (req, res) => {
  res.html('<h1>TodoDev app API</h1>')
})

module.exports = router
