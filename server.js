const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const User = require('./models/models').User;
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


/* DB SETUP */
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log('successfully connected to database');
});
mongoose.Promise = global.Promise;
/* end DB SETUP */


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(express.static(path.join(__dirname, 'build')));
app.use(session({
  secret: 'keyboard cat',
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  }),
}));

/* PASSPORT SETUP */
passport.use(new LocalStrategy(
  ((username, password, done) => {
    User.findOne({
      username,
    }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.',
        });
      }
      if (user.password !== password) {
        return done(null, false, {
          message: 'Incorrect password.',
        });
      }
      return done(null, user);
    });
  })));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());
/* END OF PASSPORT SETUP */

app.post('/register', (req, res) => {
  User.find()
    .then(result => {
      // console.log('found item: ', result);
      let in_list = [];
      for (let i = 0; i < result.length; i++) {
        let curr = result[i];
        // console.log('curr: ', curr);
        for (let j = 0; j < curr.out.length; j++) {
          let node = curr.out[j];
          // console.log('node: ', node);
          if (node.email === req.body.username) {
            let item = {
              'email': curr.username,
              'amount': node.amount
            }
            in_list.push(item);
          }
        }
      }
      console.log(in_list);
      return in_list;
    })
    .then(in_list => {
      new User({
        username: req.body.username,
        password: req.body.password,
        balance: 100,
        in: in_list,
        out: []
      }).save((err, user) => {
        if (err) {
          res.json({
            success: false,
            error: err,
          });
        } else {
          res.json({
            success: true,
          });
        }
      });
    })

});

app.get('/login', (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

app.get('/data', (req, res) => {
  let target = req.user;
  res.json({
    success: true,
    userData: target,
  });
});

app.post('/send', (req, res) => {
  let email = req.body.recipient;
  let amount = req.body.amount;
  let target = req.user;
  let transaction = {
    email: email,
    amount: amount
  }
  User.findOne(target)
    .then((result) => {
      result.out.push(transaction);
      result.save()
        .then(() => {
          User.findOne({
              username: email
            })
            .then(result => {
              res.json({
                success: true,
              });
              if (!result) {
                return;
              }
              let item = {
                'email': req.user.username,
                'amount': amount
              }
              console.log(item);
              result.in.push(item);
              return result.save();
            })
        })
        .catch((err) => {
          console.log('err: ', err);
          res.json({
            success: false,
            error: err,
          });
        });
    })
})
app.listen(PORT, error => {
  error
    ?
    console.error(error) :
    console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
module.exports = app;
