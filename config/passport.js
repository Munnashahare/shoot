const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config/db');

const Admin = require('../models/admin');
const Merchant = require('../models/merchant');
const User = require('../models/user');

module.exports = function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secret;

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log(jwt_payload);
        if(jwt_payload.userType == 'admin')
        {
            Admin.getAdminById(jwt_payload._id, (err, user) => {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    user.userType = jwt_payload.userType;
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }  else if(jwt_payload.userType == 'merchant')
        {
            Merchant.getMerchantById(jwt_payload._id, (err, user) => {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    user.userType = jwt_payload.userType;
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        } else if(jwt_payload.userType == 'user')
        {
            User.getUserById(jwt_payload._id, (err, user) => {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    user.userType = jwt_payload.userType;
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        } else {
            return done(null, false);
        }
    }));
}