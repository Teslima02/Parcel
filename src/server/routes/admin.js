import express from 'express';
import guard from 'connect-ensure-login';
import passport from 'passport';
import Account from '../models/account';

const router = express.Router();

router.get('/dashboard', guard.ensureLoggedIn(), async (req, res) => {
  const user = await Account.findById(req.user._id);
  res.render('admin/dashboard', { user, success: req.flash('success'), error: req.flash('error'), layout: 'layouts/user' });
});

router.post('/', async (req, res) => {

  if (req.body.password !== req.body.cpassword) {

    req.flash('error', 'Password Do Not Match');
    res.redirect('/register');

  } else {

    const newUser = req.body;
    const password = req.body.password;
    delete newUser.password;
    delete newUser.cpassword;

    Account.register(new Account(newUser), password,
                     async (err, account) => {
                       if (err) {
                         console.log(err);
                       } else {
                         req.flash('success', 'Congratulation Account Created Successfully');
                         res.redirect('/login');
                       }
                     });

  }

});


// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve redirecting
//   the user to google.com.  After authorization, Google will redirect the user
//   back to this application at /auth/google/callback

router.get('/auth/google',
           passport.authenticate('google', { scope:
            [
              'https://www.googleapis.com/auth/plus.login',
              // 'https://www.googleapis.com/auth/plus.profile.emails.read'
            ]
           }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.

router.get('/auth/google/callback',
           passport.authenticate('google', {
             failureRedirect: '/login'
           }),
           (req, res) => {
             res.redirect('/dashboard');
           }
);


// router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {

//   res.send('welcome to google');

//   /* passport.authenticate('google', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/login'
//   })*/
// //  ,
// //  function(req, res) {
// //    res.redirect('/dashboard');
// //  }
//  }
// );


export default router;
