const express = require('express')
const router = express.Router()
const Worker = require('../models/worker')
const bcrypt = require('bcrypt')

// All workers route
router.get('/', async (req, res) => {
    let searchOptions
    if (req.query.skill != null && req.query.skill != '') {
        searchOptions = new RegExp(req.query.skill, 'i')
    }
    try {
        const workers = await Worker.find({skill: searchOptions})
        res.render('workers/index.ejs', { workers: workers})
    } catch {
        res.redirect('/')
    }
})

// New worker route
router.get('/DefterAccount', (req, res) => {
    res.render('workers/DefterAccount.ejs', { worker: new Worker() })
})

router.get('/DefterAccount', checkNotAuthenticated, (req, res) => {
    res.render('DefterAccount.ejs')
})

router.post('/', checkNotAuthenticated, async (req, res) => {
    let errors = []
    if (req.body.password != req.body.password2) {
        errors.push({msg: 'Passwords do not match'})
    }
    Worker.findOne({email: req.body.email})
        .then(worker => {
            if (worker) {
                // User exists
                console.log("Email already exists")
                errors.push({msg: 'Email already exists'})
                // res.render('workers/DefterAccount.ejs', {
                //     worker: worker
                // })
            }
        })
    if (errors.length > 0) {
        console.log("There is an error")
        res.render('workers/DefterAccount.ejs', {errors})
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const worker = new Worker({ lastname: req.body.last,
            firstname: req.body.first,
            phone: req.body.phone,
            gender: req.body.gender,
            email: req.body.email,
            password: hashedPassword,
            skill: req.body.skill
        })

        try {
            const newWorker = await worker.save()
            res.redirect('/login')
            } catch {
            console.log("There is an error")
                res.render('workers/DefterAccount.ejs', {
                    errors,
                    worker: worker
                })
            }
    }

    // const hashedPassword = await bcrypt.hash(req.body.password, 10)
    // const worker = new Worker({ lastname: req.body.last,
    //     firstname: req.body.first,
    //     phone: req.body.phone,
    //     gender: req.body.gender,
    //     email: req.body.email,
    //     address: req.body.address,
    //     password: hashedPassword,
    //     skill: req.body.skill
    // })

    
    
    // try {
    //     const newWorker = await worker.save()
    //     res.redirect('/login')
    // } catch {
    //     res.render('workers/DefterAccount.ejs', {
    //         errors,
    //         worker: worker
    //     })
    // }
})

router.get('/Categories', checkNotAuthenticated, (req, res) => {
    res.render('Categories.ejs')
})

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports = router
