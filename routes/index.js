
const express = require('express')
const router = express.Router()

router.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {fname: req.user.firstname, lname: req.user.lastname, skill: req.user.skill, address: req.user.address, phone: req.user.phone, email: req.user.email})
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

module.exports = router