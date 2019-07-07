const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin',(req, res) => {
    res.render('users/signin');
});
router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if (name.length <= 0) {
        errors.push({ text: 'Please Insert A Valid Name' });
    }
    if (password != confirm_password) {
        errors.push({ text: 'passwords do not match' });
    }
    if (password.length < 4) {
        errors.push({ text: 'password must be at least 4 characters' });
    }
    
    if (errors.length > 0) {
        res.render('users/signup', { errors, name, email, password, confirm_password });
        console.log('Errors detected'+errors.length);
        
    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash('error_msg', 'The Email Is Already In Use');
        } else {
            const newUser = new User({ name, email, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();    
            req.flash('success:msg', 'Successfully registered');
            res.redirect('/users/signin');
        }
        
    }
    
});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
