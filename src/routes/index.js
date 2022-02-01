const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/registro', (req, res, next) => {
    res.render('signup');
});

router.post('/registro', passport.authenticate('local-signup', {
    successRedirect: '/iniciar_sesion',
    failureRedirect: '/registro',
    passReqToCallback: true
})); 

router.get('/iniciar_sesion', (req, res, next) => {
    res.render('signin');
});

router.post('/iniciar_sesion', passport.authenticate('local-signin', {
    successRedirect: '/perfil',
    failureRedirect: '/iniciar_sesion',
    passReqToCallback: true
}));

router.get('/cerrar_sesion', (req, res, next) => {
    req.logout();
    res.redirect('/iniciar_sesion');
});

router.get('/dashboar',(req, res, next) => {
    res.send('dashboar');
});

router.use((req, res, next) => {
    autenticado(req, res, next);
    next();
});

router.get('/perfil',(req, res, next) => {
    res.render('profile');
});

//dashboar

function autenticado(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

module.exports = router;