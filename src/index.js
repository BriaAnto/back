const express =  require('express');
const engine = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');

const app = express();
require('./database');
require('./passport/local-auth');

app.use(cors());
app.use(express.json());


app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));//-----no recibir imagenes

app.use(session({
    secret: 'myscretsession',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.mensajeRegistro = req.flash('mensajeRegistro');
    app.locals.mensajeSesion = req.flash('mensajeSesion');
    app.locals.user = req.user;
    next();
});

app.use('/', require('./routes/index'));

app.listen(app.get('port'), () => {
    console.log('servidor en puerto', app.get('port'));
});