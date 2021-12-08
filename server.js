require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn');

const SECRET_SESSION = process.env.SECRET_SESSION;
console.log(SECRET_SESSION);

// code for Spotify API
const axios = require('axios');
const querystring = require('querystring');
let buff = new Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
let authKey = buff.toString('base64');
let headers = {
    Authorization: `Basic ${authKey}`
}

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use(session({
  secret: SECRET_SESSION,    // What we actually will be giving the user on our site as a session cookie
  resave: false,             // Save the session even if it's modified, make this false
  saveUninitialized: true    // If we have a new session, we save it, therefore making that true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(res.locals);
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', (req, res) => {
  res.render('index');
})

// Add this above /auth controllers
app.get('/profile', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  res.render('profile', { id, name, email });
});

// controllers
app.use('/auth', require('./controllers/auth'));


app.get('/test-albums', function(req, res) {

  axios.post('https://accounts.spotify.com/api/token', 
      querystring.stringify({ grant_type: 'client_credentials'}),
     { 
          headers: headers 
  })
  .then(function(response) {                    
      token = response.data.access_token
      console.log('TOKEN', token);
      const config = {
          headers: {
              Authorization: `Bearer ${token}`
          }
      }

      axios.get('https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy', config)
      .then(response => {
          console.log(response.data);
          res.json({ data: response.data });
          // res.render('whateverpage', { data: response.data });
      })
      .catch(err => {
          console.log('ERROR', err);
      });

      // another axios call here for [song] [album] [artist] .....
      console.log(token);
    })
  .catch(function(err) {
      console.log("error", err.message)
  })
});

app.get('/test-albums-tracks', function(req, res) {

  axios.post('https://accounts.spotify.com/api/token', 
      querystring.stringify({ grant_type: 'client_credentials'}),
     { 
          headers: headers 
  })
  .then(function(response) {                    
      token = response.data.access_token
      console.log('TOKEN', token);
      const config = {
          headers: {
              Authorization: `Bearer ${token}`
          }
      }

      axios.get('https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy/tracks', config)
      .then(response => {
          console.log(response.data);
          res.json({ data: response.data });
          // res.render('whateverpage', { data: response.data });
      })
      .catch(err => {
          console.log('ERROR', err);
      });

      // another axios call here for [song] [album] [artist] .....
      console.log(token);
    })
  .catch(function(err) {
      console.log("error", err.message)
  })
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
