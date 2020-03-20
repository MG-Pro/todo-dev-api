const express = require('express')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const validateRegisterInput = require('../validation/register')
const validateLoginInput = require('../validation/login')
const validateNewPasswordInput = require('../validation/newPassword')
const User = require('../models/User')

const router = express.Router()

router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body)

  if (!isValid) {
    return res.status(400).json(errors)
  }
  User.findOne({
    email: req.body.email,
  }).then(user => {
    if (user) {
      return res.status(400).json({
        email: 'Email already exists',
      })
    }
    const avatar = gravatar.url(req.body.email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    })
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      avatar,
    })

    bcrypt.genSalt(10, (saltErr, salt) => {
      if (saltErr) {
        console.error('There was an error', saltErr)
      } else {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) console.error('There was an error', err)
          else {
            newUser.password = hash
            newUser
              .save()
              .then(userData => {
                res.json(userData)
              })
              .catch(e => console.log(e))
          }
        })
      }
    })
  })
})

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body)

  if (!isValid) {
    return res.status(400).json(errors)
  }

  const { email, password } = req.body.email

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = 'User not found'
      return res.status(404).json(errors)
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          email: user.email,
          name: user.email.replace(/@(.*)/, ''),
          avatar: user.avatar,
        }
        jwt.sign(payload, 'secret', { expiresIn: '7d' }, (err, token) => {
          if (err) console.error('There is some error in token', err)
          else {
            res.json({
              success: true,
              token: `Bearer ${token}`,
            })
          }
        })
      } else {
        errors.password = 'Incorrect Password'
        return res.status(400).json(errors)
      }
    })
  })
})

router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    return res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    })
  }
)

router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { id } = req.params

    const { errors, isValid } = validateNewPasswordInput(req.body)

    if (!isValid) {
      return res.status(400).json(errors)
    }

    const user = await User.findById(id)
    if (!user) {
      return res.status(400).json({
        msg: 'User not found',
      })
    }
    const isMatch = await bcrypt.compare(req.body.old_password, user.password)
    if (!isMatch) {
      return res.status(400).json({
        old_password: 'Incorrect old password',
      })
    }

    const salt = await bcrypt.genSalt(10)

    user.password = bcrypt.hash(req.body.new_password, salt)
    const savedUser = await user.save()

    const payload = {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.email.replace(/@(.*)/, ''),
      avatar: savedUser.avatar,
    }

    const token = await jwt.sign(payload, 'secret', { expiresIn: '7d' })
    res.json({
      success: true,
      token: `Bearer ${token}`,
    })
  }
)

module.exports = router
