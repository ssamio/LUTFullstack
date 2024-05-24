const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./models/User');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET
};
 
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        const user = User.findOne({email: jwt_payload.email}).exec();
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    })
  );
};
