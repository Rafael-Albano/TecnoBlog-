const express = require('express');
const router = express.Router();
const moment = require('moment');
const Category = require('../models/Category');
const Article = require('../models/Article');
const slugify = require('slugify');
const { adminAuth } = require('../middlewares/adminAuth');


router.use((req, res, next) => {
  console.log(`Time: ${moment().format('LLL')}`);

  next();
});

router.get('/admin/articles', adminAuth, (req, res) => {
  Article.findAll({
    include: [{ model: Category }],
    // raw: true,
    // order: [
    //   ['id','ASC']
    // ],
  }).then(articles => {
    console.log(articles);
    res.render('admin/articles/index',{ articles });
  }).catch(error => {
    res.json(error);
  })
});

router.get('/admin/articles/new', adminAuth, (req, res) => {
  Category.findAll({ raw: true }).then(categories => {
    console.log(categories);
    res.render('admin/articles/new', { categories });
  })
  
});

router.post('/article/save', (req, res) => {
  const { title, id_category: categoryId, content_article: body } = req.body;



  Article.create({
    title,
    slug: slugify(title),
    body,
    categoryId
  }).then(() =>  res.redirect('/admin/articles'));

  // res.send({msg: "ok"});
});

router.post('/admin/articles/delete', (req, res) => {
  let { id } = req.body;

  if(id == undefined){
    res.redirect('/admin/articles');
    return;
  }

  if(isNaN(id)){
    res.redirect('/admin/articles');
    return;
  }


  // Deletar categoria
  Article.destroy({
    where: {
      id
    }
  }).then(() => res.redirect('/admin/articles'));

});

router.get('/admin/article/edit/:id', (req, res) => {

  console.log("teste");
  let { id } = req.params;

  Article.findByPk(id)
  .then((article) => {
    if(article === null){
      console.log("Caiii na merda aquiii");
      res.redirect('/admin/articles');
      return;  
    }

    Category.findAll().then(categories => {
      res.render("admin/articles/edit", {article, categories})
    });

  }).catch(err => res.redirect("/"));
});

router.post('/admin/articles/update', (req, res) => {
  let { id, new_title, content_article } = req.body;

  // console.log("1");

  if(isNaN(id)){ 

    // console.log("2");
    res.redirect('/admin/categories/edit/'+id);
    return;
  }

  if(new_title === ""){
    // console.log("3");

    res.redirect('/admin/categories/edit/'+id);
    return;
  }

  // console.log("4");

  Article.update({
    title: new_title,
    slug: slugify(new_title),
    body: content_article
  },{
    where:{
      id
    }
  }).then(() => res.redirect('/admin/articles'));

});

router.get("/article/page/:num", (req, res) => {

  let { num: page } = req.params;
  let limit = 4;
  let offset = (isNaN(page) || page <= 1) ? 0 : parseInt( (page) - 1 ) * limit;

  

  Article.findAndCountAll({
    order: [
      ['id', 'DESC']
    ],
    limit,
    offset
  }).then(articles => {

    // let totalPage = (article.count % limit == 0) ? (article.count / limit) : Math.trunc(article.count / limit) + 1;
    
    let next = ((offset + limit) >= articles.count) ? false : true;
    let result = {
      page: parseInt(page),
      next,
      articles
    }

    Category.findAll()
      .then(categories => {

        if(!categories){
          res.redirect('/admin/articles');
        }

        res.render('admin/articles/page', {
          result,
          categories,
          
        })
      })
  })
});

module.exports = router;