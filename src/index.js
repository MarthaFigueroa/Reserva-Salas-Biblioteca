const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
// const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');
const mysqlConnection = require('./database');
require('../src/lib/passport');
const { database } = require('./keys');

// Initializations
const app = express();
// require('./lib/passport');

//Server settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));  //Establece con __dirname la ruta de este doc (index.js) y le concatena la carpeta 'views'
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), //Obteniene la ruta de views y le concatena la carpeta layouts
    partialsDir: path.join(app.get('views'), 'partials'), //Obteniene la ruta de views y le concatena la carpeta partials
    extname: '.hbs', //Extensión de los archivos
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');
app.use(express.urlencoded({extended: false}));  //Método para aceptar desde los formularios los datos que mande el usr
app.use(express.json());  //Se puedan enviar/recibir json

// Middlewares: Funciones que se ejecutan cada vez que el usr envía una petición al servidor
app.use(session({
    secret: 'mysqlnodejs',
    resave: false, //No se renueve la session
    saveUninitialized: false, //No se vuelva a establecer la session
    store: new MySQLStore(database) //Donde se guardará la session, en este caso en una db
}));
// app.use(flash());
app.use(morgan('dev'));
// app.use(express.urlencoded({extended: false}));
// app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Global Variables
app.use((req, res, next) => {
    //Si existe el mensaje, lo hace disponible en todas las vistas
    // app.locals.success = req.flash('success');  
    // app.locals.message = req.flash('message');
    app.locals.user = req.user;  //Guarda el usr para poder ser accesible desde cualquier vista

    next();
});


//Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links')); //a los links les proceda el /links/<link o id> para acceder a las rutas correctas (add, edit, delete)

//Public
app.use(express.static(path.join(__dirname, 'public')));
//Configure Passport
app.use(passport.initialize());
app.use(passport.session());

// app.use(cookieSession({
// 	name: 'session-name',
// 	keys: ['key1', 'key2']
// }));

// Auth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    
    // const email = req.user.emails[0].value;
    res.redirect('/formulario_reserva');
  }
);
//Logout
app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

//Starting Server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});