const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
function initializePassport(user){
    console.log(array)
    const users = array
    function verifyCallback(username, password, done) {
        console.log(array)
        user = username
        console.log(user)
        /*User.findOne({ username: username }, function (err, user) {
          if (err) { return done(err); }
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
        });
      }*/
      
}
verifyCallback();
passport.use(new LocalStrategy(verifyCallback));
}


module.exports = initializePassport;
