const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')

const User = mongoose.model('User')
const opts = {}

opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken()
opts.secretOrKey = 'secret'

module.exports = passport => {
  passport.use(
    new JWTStrategy(opts, async (jwtPayload, done) => {
      const user = await User.findById(jwtPayload.id)
      if (user) {
        return done(null, user)
      }
      return done(null, false)
    })
  )
}
