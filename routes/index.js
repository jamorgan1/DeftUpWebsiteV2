
const express = require('express')
const router = express.Router()

router.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {name: req.user.firstname})
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

module.exports = router