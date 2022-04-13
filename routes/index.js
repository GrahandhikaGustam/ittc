var express = require('express');
var router = express.Router();
var modul = require('../modul/modul');
var authentication_mdl = require("../middlewares/authentication");
var session_store;

/* GET home page. */
router.get('/', authentication_mdl.is_login, function(req, res, next) {
	res.render('dashboard', {title:"Dashboard"});
});

router.get('/profile', authentication_mdl.is_login, function(req, res, next) {
	res.render('profile', {title:"Profil"});
});

router.get('/login',function(req,res,next){
	res.render('login');
});

router.post('/login',function(req,res,next){
	session_store=req.session;
	req.assert('username', 'Please fill the Username').notEmpty();
	req.assert('username', 'Email not valid').isEmail();
	req.assert('password', 'Please fill the Password').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_pass = req.sanitize( 'password' ).escape().trim(); 
		v_user = req.sanitize( 'username' ).escape().trim();

		if(v_user == 'admin@ITTC.com' && v_pass == 'admin') {
			session_store.is_login = true;
			res.redirect('/daftarbarang');
		} else {
			req.flash('msg_error', "Wrong email address or password. Try again."); 
			res.redirect('/login');
		}
	}
	else
	{
		errors_detail = "<p>Sorry there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		console.log(errors_detail);
		req.flash('msg_error', errors_detail); 
		res.redirect('/login'); 
	}
});

router.get('/logout', function(req, res)
{ 
	req.session.destroy(function(err)
	{ 
		if(err)
		{ 
			console.log(err); 
		} 
		else 
		{ 
			res.redirect('/login'); 
		} 
	}); 
});

module.exports = router;