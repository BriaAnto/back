const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    const user = await User.findById(id);
    done(null, user)
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'password',
    passReqToCallback:  true
}, async (req, usuario, password, done, next) => {

    const user = await User.findOne({'usuario': usuario});
    if(user){
        return done(null, false, req.flash('mensajeRegistro', 'El nombre de usuario ya existe'));
    } else {

        const newUser = new User();
        newUser.usuario = usuario;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser, next);  
        
    }

}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, usuario, password, done) => {

    const user = await User.findOne({usuario: usuario});
    if(!user){
        return done(null, false, req.flash('mensajeSesion', 'El nombre de usuario no existe.'));
    }
    if(!user.comparePassword(password)) {
        return done(null, false, req.flash('mensajeSesion', 'Contraseña incorrecta'));
    }

    done(null, user);

}));