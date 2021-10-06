const express = require('express');
const passport = require('passport');
// const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const router = express.Router();
const mysqlConnection = require('../database');

const checkUserLoggedIn = (req, res, next) => {
	req.user ? next(): res.redirect('/');
}

router.get('/', (req, res)=>{
    res.render('index');
});

router.get('/formulario_reserva', (req, res)=>{
    const email = req.user.emails[0].value;
    const name = req.user.displayName;
    const data_user = {email: email, name: name};
    res.render('links/formulario_reserva', data_user);
});

router.get('/ReservaExitosa', checkUserLoggedIn, (req, res)=>{
    res.render('links/ReservaExitosa');
});

router.get('/ReservaEliminada', (req, res)=>{
    res.render('links/ReservaEliminada');
});

module.exports = router;