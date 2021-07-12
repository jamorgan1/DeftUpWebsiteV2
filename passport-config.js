const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

// function initialize(passport, getUserByEmail, getUserById) {
//     const authenticateUser = async (email, password, done) => {
//         const user = getUserByEmail(email)
//         if (user == null) {
//             console.log('No user with that email address')
//             return done(null, false, { messages: 'No user with that email address' })
//         }
//
//         try {
//             if (await bcrypt.compare(password, user.password)) {
//                 return done(null, user)
//             } else {
//                 console.log('Incorrect password')
//                 return done(null, false, { messages: 'Incorrect password' })
//             }
//         } catch (e) {
//             return done(e)
//         }
//     }
//     passport.use(new localStrategy({ usernameField: 'email' }, authenticateUser))
//     passport.serializeUser((user, done) => done(null, user.id))
//     passport.deserializeUser((id, done) => {
//         return done(null, getUserById(id))
//     })
// }
//
// module.exports = initialize

const mongoose = require('mongoose')
const Worker = require('./models/worker')

module.exports = function (passport) {
    passport.use(
        new localStrategy({ usernameField: 'email'}, (email, password, done) => {
            // Match worker
            Worker.findOne({email: email})
                .then(worker => {
                    if (!worker) {
                        return done(null, false, {message: 'That email is not registered'})
                    }
                    
                    bcrypt.compare(password, worker.password, (err, isMatch) => {
                        if (err) throw err
                        
                        if (isMatch){
                            return done(null, worker)
                        } else 
                            return done(null, false, {message: 'Password incorrect'})
                    })
                })
                .catch(err => console.log(err))
        })
    )

    passport.serializeUser((worker, done) => done(null, worker.id))
    passport.deserializeUser((id, done) => {
        Worker.findById(id, function (err, worker) {
            done(null, worker)
        })
    })
}