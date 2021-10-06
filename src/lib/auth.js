module.exports = {
    isLoggedIn(req, res, next) {
        //Método retorna true si el usr o su sesión existe
        //Si existe continua con el código, sino redirecciona al signin
        if(req.isAuthenticated()){
            return next();
        }else{
            return res.redirect('/');
        }
    },
    isNotLoggedIn(req, res, next){
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/principal');
    }
}