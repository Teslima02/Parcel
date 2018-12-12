import express from 'express';
import guard from 'connect-ensure-login';
import Account from '../models/account';
import Category from '../models/category';
import subCategory from '../models/subCategory';

const router = express.Router();


router.get('/', guard.ensureLoggedIn(), async (req, res) => {
  const user = await Account.findById(req.user._id);
  const categories = await Category.find();
  res.render('category/index', { categories, user, success: req.flash('success'), error: req.flash('error'), layout: 'layouts/user' });
});

router.get('/view/:_id', guard.ensureLoggedIn(), async (req, res) => {
  const user = await Account.findById(req.user._id);
  const getCatId = await Category.findById(req.params._id);
  const subCategories = await subCategory.find({ _categoryId: getCatId._id });
  res.render('category/viewCat', { user, subCategories, getCatId, success: req.flash('success'), error: req.flash('error'), layout: 'layouts/user' });
});


router.post('/', guard.ensureLoggedIn(), async (req, res) => {
  const newCat = new Category();
  newCat.name = req.body.name;
  newCat._createdBy = req.user._id;
  newCat.save((err, category) => {

    const subCat = new subCategory();
    subCat.name = req.body.subCategory;
    subCat._createdBy = req.user._id;
    subCat._categoryId = category._id;
    subCat.save((err) => {
      if (err) {
        console.log(err);
      } else {
        req.flash('success', 'Category Created successfully');
        res.redirect('/category');
      }
    });
  });

});


router.post('/update', guard.ensureLoggedIn(), async (req, res) => {
  const category = await Category.findById({ _id: req.body.categoryId });
  if (category !== null) {
    category.name = req.body.name;
    category.save((err) => {
      if ((err)) {
        console.log(err);
      } else {
        req.flash('success', 'Category Update successfully');
        res.redirect('/category');
      }
    });
  }
});


router.post('/sub-category', guard.ensureLoggedIn(), async (req, res) => {
  // const subCat = await subCategory.findOne({ _categoryId: req.body.categoryId });

  // if (subCat !== null) {
  const newSubCat = new subCategory();
  newSubCat.name = req.body.name;
  newSubCat._categoryId = req.body.categoryId;
  newSubCat.save((err) => {
    if ((err)) {
      console.log(err);
    } else {
      req.flash('success', 'Sub-Category Created successfully');
      res.redirect(`/category/view/${newSubCat._categoryId}`);
    }
  });
  // } else {
  //   req.flash('error', 'Fail to add Sub-Category');
  //   res.redirect(`/category/view/${subCat._id}`);
  // }
});


router.post('/get/category', guard.ensureLoggedIn(), async (req, res) => {
  const subCat = await subCategory.find({ _categoryId: req.body.categoryId });

  return res.json(subCat);
});


export default router;
