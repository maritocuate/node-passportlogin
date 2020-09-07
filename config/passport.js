const LocalStrategy = require('passport-local').Strategy
const User = require('../app/models/user')
const { deleteOne } = require('../app/models/user')

module.exports = function(passport) {
    
    passport.serializeUser( (user, done)=>{
        done(null, userId)
    })

    passport.deserializeUser( (id, done){
        User.findById(id, (error, user)=>{
            done(error, user)
        })
    })

    // signup
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, email, password, done)=>{
        User.findOne({'local.email':email}, (error, user)=>{
            if(error){ return done(error) }
            if(user){
                return done(null, false, req.flash('signupMessage', 'the email is already taken'))
            }else{
                var newUser = new User()
                newUser.local.email = email
                newUser.local.password = newUser.generateHash(password)
                newUser.save(function(error){
                    if(error){ throw error }
                    return done(null, newUser)
                })
            }
        })
    }))

    // login
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, email, password, done)=>{
        User.findOne({'local.email':email}, (error, user)=>{
            if(error){ return done(error) }
            if(!user){
                return done(null, false, req.flash('loginMessage', 'no user found'))
            }
            if(!user.validatePassword(password)){
                return done(null, false, req.flash('loginMessage', 'wrong password'))
            }
            return done(null, user)
        })
    }))
}

