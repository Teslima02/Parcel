import express from 'express';
import guard from 'connect-ensure-login';
import Account from '../models/account';

const router = express.Router();


router.get('/dashboard', guard.ensureLoggedIn(), async (req, res) => {
  const user = await Account.findById(req.user._id);
  res.render('user/dashboard', { user, success: req.flash('success'), error: req.flash('error'), layout: 'layouts/user' });
});

router.post('/', async (req, res) => {

  if (req.body.password !== req.body.cpassword) {

    req.flash('error', 'Password Do Not Match');
    res.redirect('/register');

  } else {

    const newUser = req.body;
    const password = req.body.password;
    newUser.email = req.body.username;
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


export default router;
