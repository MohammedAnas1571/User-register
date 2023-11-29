const express =require('express')
const session=require('express-session')
const nocache=require('nocache')
const path = require('path')
const hbs=require('hbs')
const mongoose=require('mongoose')
const methodOverride=require('method-override')
//..................//

const app=express()
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine','hbs')
hbs.registerPartials(path.join(__dirname, 'views', 'partials'))

app.use(express.urlencoded({extended:true}))
app.use(
    session({
      secret: "uuidv5",
      resave: false,
      saveUninitialized: true,
    })
)
app.use(nocache())
app.use(methodOverride('_method'))

mongoose.connect('mongodb://127.0.0.1:27017/USM')
.then(()=>console.log('db connected'))
.catch((error)=>console.log(error))

app.use('/', require('./routes/user'))
app.use('/admin',require('./routes/admin'))

app.use((req,res)=>{res.send('<h1> <center>404-page not found</center> </h1>')})
app.listen(2000,()=>console.log('server started'))