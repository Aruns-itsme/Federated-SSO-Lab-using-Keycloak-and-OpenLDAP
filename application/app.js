const express = require('express');
const session = require('express-session');
const passport = require('passport');
const OpenIDConnectStrategy = require('passport-openidconnect').Strategy;
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'supersecret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Authentication Middleware
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}

// Passport OIDC Strategy
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use('oidc', new OpenIDConnectStrategy({
    issuer: process.env.KEYCLOAK_ISSUER,
    authorizationURL: process.env.KEYCLOAK_AUTH_URL,
    tokenURL: process.env.KEYCLOAK_TOKEN_URL,
    userInfoURL: process.env.KEYCLOAK_USERINFO_URL,
    clientID: process.env.KEYCLOAK_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: 'openid profile email'
}, (issuer, profile, done) => done(null, profile)));

// Routes
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/profile');
    } else {
        res.render('index', { user: req.user });
    }
});

app.get('/login', passport.authenticate('oidc'));

app.get('/callback', passport.authenticate('oidc', {
    failureRedirect: '/'
}), (req, res) => res.redirect('/profile'));

app.get('/profile', ensureAuthenticated, (req, res) => {
    res.render('profile', { user: req.user });
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      const keycloakLogout = `${process.env.KEYCLOAK_LOGOUT_URL}?redirect_uri=${encodeURIComponent(process.env.POST_LOGOUT_REDIRECT_URI)}`;
      res.redirect(keycloakLogout);
    });
  });
});

// Start Server
app.listen(3000, () => console.log('App running on http://0.0.0.0:3000'));

