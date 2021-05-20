const express = require('express');
const router = express.Router();
const moment = require('moment');
const { route } = require('./ArticlesController');
const Category = require('../models/Category');
const slugify = require('slugify');

router.use((req, res, next) => {
  console.log(`Time: ${moment().format('LLL')}`);
  next();
});

router.get('/admin/categories/new', (req, res) => {
  res.render('./admin/categories/new');
});

router.post('/categories/save', (req, res) =>{

  let { title } = req.body;

  if(title == undefined){
    res.redirect('/admin/categories/new');
    return;
  }

  Category.create({
    title,
    slug: slugify(title)
  }).then(() => res.redirect('/admin/categories'));
});

router.get('/admin/categories', (req, res) => {

  Category.findAll({raw: true})
    .then((categories) => {
      
      res.render('./admin/categories/index', { categories });
    });
  
});

router.post('/admin/category/delete', (req, res) => {
  let { id } = req.body;

  if(id == undefined){
    res.redirect('/admin/categories');
    return;
  }

  if(isNaN(id)){
    res.redirect('/admin/categories');
    return;
  }


  // Deletar categoria
  Category.destroy({
    where: {
      id
    }
  }).then(() => res.redirect('/admin/categories'));

});

router.get('/admin/categories/edit/:id', (req, res) => {

  let { id } = req.params;

  if(isNaN(id)){
    res.redirect('/admin/categories');
    return;
  }

  if(id == undefined){
    res.redirect('/admin/categories');
    return;
  }

  Category.findByPk(id)
  .then((category) => {
    if(category === null){
      res.redirect('/admin/categories');
      return;  
    }

    res.render('./admin/categories/edit', { category });
  });
});

router.post('/admin/categories/update', (req, res) => {
  let { id, new_title } = req.body;

  console.log("1");

  if(isNaN(id)){ 

    console.log("2");
    res.redirect('/admin/categories/edit/'+id);
    return;
  }

  if(new_title === ""){
    console.log("3");

    res.redirect('/admin/categories/edit/'+id);
    return;
  }

  console.log("4");

  Category.update({
    title: new_title,
    slug: slugify(new_title)
  },{
    where:{
      id
    }
  }).then(() => res.redirect('/admin/categories'));

});

module.exports = router;


