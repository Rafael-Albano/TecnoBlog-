const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');

router.get("/admin/users", (req, res) => {

  User.findAll().then(users => res.render('admin/users/index', {
    users
  }));
  
});

router.get("/admin/users/create", (req, res) => {
  res.render('./admin/users/create');
});

router.post("/user/create", (req, res) => {
  

  let { email, pass } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(pass, salt);

  User.findOrCreate({
    raw: true,
    where: {
      email
    },
    defaults: {
      passworld: hash
    }
  }).then((user, created) => {
    if(!user[1]){
      
      // console.log(user);
      // console.log(user[1]);
      res.redirect('/admin/users/create');
      return;
    }


    res.send("Page user");
  }).catch(error => {


    res.send("Page user catch");

  });
  
});

router.get('/login', (req, res) => {
  res.render('admin/users/login');
});

router.post('/authenticate', (req, res) => {
  const { email, pass } = req.body;

  User.findOne({
    raw: true,
    where: {
      email
    }
  })
    .then(user => {

      console.log(user);
      if(!user){
        res.redirect('/login');
      }

      let passValidate = bcrypt.compareSync(pass, user.passworld);

      if(!passValidate){
        res.redirect('/login');
      }

      req.session.user = {
        id: user.id,
        email: user.email,
      };


      res.redirect('/admin/articles');

    });
});

router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
})
module.exports = router;