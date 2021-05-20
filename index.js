const express  = require('express');
const { sequelize: connection, Datatype, Op} = require('./config/database/connection');
const session = require('express-session');

const articlesController = require('./controllers/ArticlesController');
const categoriesController = require('./controllers/CategoriesControllers');
const usersController = require('./user/UsersController');

const Article = require('./models/Article');
const Category = require('./models/Category');
// const User = require("./user/User");

const app = express();
const port = 3000;

// View engine.
app.set('view engine', 'ejs');

// Session.

app.use(session({
  secret: "cokie_secret",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 3000000 }
}))

// Static.
app.use(express.static('public'));


// Read data formulary
app.use(express.urlencoded({ extended: false} ));
app.use(express.json());

// Conecting with database.
connection.authenticate()
  .then(() => console.log('Connection has been established successfully !'))
  .catch(error => console.error('Unable to connect to the database:', error));


// Usando a rota definida.
app.use('/', articlesController);
app.use('/', categoriesController);
app.use('/', usersController);

// app.get('/session', (req, res) => {
//   req.session.treinamento = "Formação nodejs";
//   req.session.ano = 2021;
//   let email = req.session.email = "rafael.albano88@gmail.com"
//   req.session.user = {
//     username : "Rafael Albano",
//     ip: req.ip,
//     email,
//     id: 10
//   }

//   res.send("Sessão gerada !");
// });

// app.get('/leitura', (req, res) => {
//   res.json(req.session.user);
// });


app.get('/', (req, res) => {
  let limit = 4;

  Article.findAll({
    order: [
      ['id', 'DESC']
    ],
    limit
  }).then( articles => {

    Category.findAll().then(categories => {
      res.render('index', { 
        categories,
        articles 
      });
    });
    
  });
    
});

app.get('/:slug', (req, res) => {
  const { slug } = req.params;

  
  Article.findOne({
    where:{

      slug,
    }
  }).then(article => {
   
    if(!article){
      res.redirect('/');
    }
    Category.findAll().then(categories => {
      res.render("article", {article, categories} );
    });
    
  }).catch(error => {
    res.redirect('/');
  });
  
});

app.get("/category/:slug", (req, res) => {

  const { slug } = req.params;

  Category.findOne({
    where: {
      slug
    },
    include: [{model: Article}]
  }).then(category => {
    if(!category){
      res.redirect("/");
    }

    console.log(categories.articles);

    Category.findAll().then(categories => res.render('index', {articles: categories.articles, categories}));
  }).catch(error => {
    res.redirect("/")
  });
});



app.listen(port, (error) => {
  return (error) ? console.log(error) : console.log(`Server listening at http://localhost:${port}`);
});