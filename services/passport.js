const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('./postgres-pool');
const bcrypt = require('bcrypt-nodejs');

// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    const sql = `select * from login where email = '${email}'`
    pool.query(sql)
    .then(res => {
      const user = res.rows[0];
      if (!user) {
        return done(null, false, { message: 'Invalid credentials.\n' });
      }
      if (!bcrypt.compareSync(password, user.hash)) {
        return done(null, false, { message: 'Invalid credentials.\n' });
      }
      return done(null, user);
    })
    .catch(error => done(error));
  }
));

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const sql = `select * from login where id = '${id}'`
  pool.query(sql)
  .then(res => done(null, res.rows[0]) )
  .catch(error => done(error, false))
});

module.exports = {
  passport
};