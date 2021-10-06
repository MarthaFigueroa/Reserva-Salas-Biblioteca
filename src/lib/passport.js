const passport = require('passport');
// const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// const helpers = require('../lib/helpers');

// const pool = require('../database'); //Conectar con db

//Guarda el usr que está autenticando en una session, guarda su id
//Este al ser guardado, se puede utilizar en las variables Globales del index.js
passport.serializeUser((user, done)=>{
    // done(null, user.id);
    done(null, user);
});

//Deserializa el Usuario a partir de verificar que exista el id en db
passport.deserializeUser((user, done)=>{
    // const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    // done(null, rows[0]); //En caso de error al deserialize establecer a true rows[0]
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "795346938454-jaajfk54bjvol2tadnsgl2f503c2mcvp.apps.googleusercontent.com",
    clientSecret: "DdZ4m3F5XpJRIX3nX6UNfuqI",
    callbackURL: "https://bibliotecareservas.uneatlantico.es/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }
));

/*

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done)=>{
    console.log(req.body);
    
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        console.log('password: ', password);
        console.log('user password: ', user.password);
        
        console.log(validPassword);
        
        if(validPassword){
            done(null, user, req.flash('success','Welcome '+user.username));
        }else{
            done(null, false, req.flash('message','Incorrect Password'));
        }
    }else{
        done(null, false, req.flash('message','The Username does not exists'));
    }
    
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true//Permite recibir el objeto request dentro de la function del LocalStrategy
}, async (req, username, password, done) =>{  
    //Callback que recibe un request, username, password, y done(terminado proceso de autenticación siga con el siguiente proceso)
    // console.log(req.body);
    const {fullname} = req.body;
    const newUser = {
        username,
        password,
        fullname
    };

    newUser.password = await helpers.encryptPassword(password); //Cifrar la contraseña
    console.log(newUser.password);
    
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    // console.log(result);
    newUser.id = result.insertId;
    return done(null, newUser); //Null para no error, y manda el obj. del newUser 
}));
*/