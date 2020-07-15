const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const initializePassport = require('./passport-config.js')
const mongoose = require('mongoose')
//"database"

const User = require('./models/user')

/*initializePassport()*/

//config para ter acesso a req.body
app.use(express.urlencoded({extended:false}))
app.set('view engine', 'ejs')

//configuração do mongoose
mongoose.connect('mongodb://localhost/studyTrack', {useNewUrlParser: true, useUnifiedTopology: true}) 
const db = mongoose.connection
db.on('error', error => console.error(error)) 
db.once('open', () => console.log('Connected to Mongoose'))


app.get('/', async (req,res)=>{
  res.render('index', {name:"Felipe"})
  
})

//pagina de login
app.get('/login', (req,res)=>{
  res.render('login')
})

//pagina de registro
app.get('/register', (req,res)=>{
  res.render('register')
})

//requisição de registro
app.post('/register', async (req,res)=>{
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

app.listen(3000)