import express from 'express';
import passport from 'passport';
import Account from '../models/account';
// import Subscription from '../models/subscription';
const router = express.Router();


router.get('/dashboard', async (req, res) => {
  const user = await Account.findById(req.user._id);
  if (user.roleId === 'admin' && user.roleId === 'animator') {
    res.redirect('/user/dashboard');
  } else if (user.roleId === 'admin') {
    res.redirect('/admin/dashboard');
  } else if (user.roleId === 'animator') {
    res.redirect('/animator/dashboard');
  }
});


router.get('/', (req, res) => {
  res.render('website/index', { msg: req.flash('info'), layout: 'layouts/website' });
});


router.get('/register', async (req, res) => {
  // const business = await Business.find();
  res.render('auth/signup', { success: req.flash('success'), error: req.flash('error'), layout: false });
});


router.get('/login', (req, res) => {
  res.render('auth/login', { success: req.flash('success'), error: req.flash('error'), user: req.user,
                             layout: false });
});


router.post('/login', passport.authenticate('local',
                                            { failureRedirect: '/login',
                                              failureFlash: true }),
            async (req, res, next) => {
              const user = await Account.findById(req.user._id);
              if (user.roleId === 'admin') {
                res.redirect('/admin/dashboard');
              } else {

                if (!user) res.redirect('/login');
                req.session.save((err) => {
                  if (err) {
                    return next(err);
                  }

                  if (user) {
                    res.redirect('/user/dashboard');
                  }
                  //  else if (user.enterProduct === true) {
                  //   res.redirect('/product');
                  // } else if (user._roleId.name === 'admin' && user._roleId.roleType === 'Store') {
                  //   res.redirect('/admin/dashboard');
                // }
                });
              }
            });


router.get('/logout', (req, res, next) => {
  req.logout();
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});


router.get('/ping', (req, res) => {
  res.status(200).send('pong!');
});

export default router;
