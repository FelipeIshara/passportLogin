const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

const mongoose = require('mongoose')
const passport = require('passport')
const User = require('./models/user')
const session = require('express-session')
const flash = require('express-flash')
const initializePassport = require('./passport-config.js')
const  methodOverride = require('method-override')
//initialize passport configurations
initializePassport()

//configuração do mongoose - conexão com banco dados
mongoose.connect('mongodb://localhost/studyTrack', {useNewUrlParser: true, useUnifiedTopology: true}) 
const db = mongoose.connection
db.on('error', error => console.error(error)) 
db.once('open', () => console.log('Connected to Mongoose'))
//view engine config
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))
//para mostrar os erros
app.use(flash())
//session config
app.use(session({
  secret: 'fuck',
  resave: true,
  saveUninitialized: false,
}));

//iniciando midlewares
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))


app.get('/', checkAuthenticated,(req,res)=>{
  res.render('index', {name: req.user.name})
  
})

//pagina de login
app.get('/login', checkNotAuthenticated, (req,res)=>{
  res.render('login')
})

//autenticação
app.post('/', checkNotAuthenticated, passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

//pagina de registro
app.get('/register',checkNotAuthenticated, (req,res)=>{
  res.render('register')
})

//requisição de registro
app.post('/register',checkNotAuthenticated, async (req,res)=>{
  //hashing password
  try { 
    //verificar se usuário já existe
    const userAlreadyExist = await User.find({ username: req.body.username })
    if(userAlreadyExist != ''){
      return res.send("este usuário já eiste")
    } 
    //hashing password
    hashPassword = await bcrypt.hash(req.body.password, 10)
    //pegando os dados do registro
    const user = new User({
      name: req.body.name, 
      username: req.body.username,
      password: hashPassword   
    }) 
    const newUser = await user.save()
    console.log(newUser)
    return res.render('login')
  } catch(err) {
      console.log(err)
      res.redirect('/register')
    }
})

//logout
app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

//midleware para pgs em que o usuário deve estar autenticado
function checkAuthenticated(req,res,next) {
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/login')
}

//midleware para pgs em que o usuário não pode estar autenticado
function checkNotAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return res.redirect('/')
  }
  next()

}
app.listen(3000)