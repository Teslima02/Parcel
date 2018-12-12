import express from 'express';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import guard from 'connect-ensure-login';
import Account from '../models/account';
import Category from '../models/category';
import Media from '../models/media';

const router = express.Router();


router.get('/', guard.ensureLoggedIn(), async (req, res) => {
  const user = await Account.findById(req.user._id);
  const categories = await Category.find();
  res.render('upload/index', { user, categories, success: req.flash('success'), error: req.flash('error'), layout: 'layouts/user' });
});

router.post('/', async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    const fileUpload = files.media;
    const member = fields;

    if (member.title === null || member.price === null || member.description === null || member.forWho === null || member.subCatId === null || member.type === null) {
      req.flash('error', 'Please Fill All The Required Forms');
      res.redirect('/upload');
    }

    if (fileUpload && fileUpload.name) {
      const name = `${Math.round(Math.random() * 10000)}.${fileUpload.name.split('.').pop()}`;
      const dest = path.join(__dirname, '..', 'public', 'assets', 'user', 'media', name);
      const data = fs.readFileSync(fileUpload.path);
      fs.writeFileSync(dest, data);
      fs.unlinkSync(fileUpload.path);
      member.media = name;
      member.fileSize = fileUpload.size;
      member.fileType = fileUpload.type;
    }

    const newUpload = new Media();
    newUpload._createdBy = req.user._id;
    newUpload._subCategoryId = member._subCatId;
    newUpload.media = member.media;
    newUpload.title = member.title;
    newUpload.price = member.price;
    newUpload.fileSize = member.fileSize;
    newUpload.fileType = member.fileType;
    newUpload.type = member.type;
    newUpload.language = member.language;
    newUpload.description = member.description;
    newUpload.forWho = member.forWho;
    newUpload.save((err) => {
      if (err) {
        console.log(err);
      } else {
        req.flash('success', 'File Upload Successfully');
        res.redirect('/upload');
      }
    });
  });
});


export default router;
