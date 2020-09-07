const express = require('express')
const app = express()
const port = 3500

const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const pug = require('pug')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const { url } = require('./config/database')
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true  
})

require('./config/passport')(passport)

// settings
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// middlewares
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:false}))
app.use(session({
    secret: 'mrcrowley',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// routes
require('./app/routes')(app, passport)

// static files
app.use(express.static( path.join(__dirname, 'public') ))

app.listen(port, ()=>{
    console.log(`server on port ${port}`)
})