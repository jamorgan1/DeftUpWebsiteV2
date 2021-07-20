if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const workerRouter = require('./routes/workers')

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

const passport = require('passport')
// const initializePassport = require('./passport-config')
// initializePassport(
//     passport,
//         email => worker.find(user => worker.email === email),
//     id => worker.find(user => worker.id === id)
// )
require('./passport-config')(passport)

app.set('view-engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static("views"))
app.use(express.urlencoded({ extended: false}))
app.set('layout', './layouts/layout.ejs')
app.use(expressLayouts)
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false /*don't save empty values in session*/
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.use('/', indexRouter)
app.use('/workers', workerRouter)

app.get('/DeftUpPro', checkNotAuthenticated, (req, res) => {
    res.render('DeftUpPro.ejs')
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/Register', checkNotAuthenticated, (req, res) => {
    res.render('workers/DefterAccount.ejs')
})

app.get('/CustomerAccount', checkNotAuthenticated, (req, res) => {
    res.render('CustomerAccount.ejs')
})

app.get('/Categories', checkNotAuthenticated, (req, res) => {
    res.render('Categories.ejs')
})

app.get('/AboutUs',(req, res) => {
    res.render('AboutUs.ejs')
})

app.get('/Help',(req, res) => {
    res.render('Help.ejs')
})

app.get('/Hire',(req, res) => {
    res.render('hire.ejs')
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.listen(process.env.PORT || 3000)
