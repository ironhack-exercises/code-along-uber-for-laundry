const express = require('express')
const bcrypt = require('bcrypt')

const User = require('../models/user')

const router = express.Router()
const bcryptSalt = 10


router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: ''
  })
})

router.post('/signup', (req, res, next) => {
  const nameInput = req.body.name
  const emailInput = req.body.email
  const passwordInput = req.body.password

  if (emailInput === '' || passwordInput === '') {
    res.render('auth/signup', {
      errorMessage: 'Enter both email and password to sign up.'
    })
    return
  }

  User.findOne({ email: emailInput }, '_id', (err, existingUser) => {
    if (err) return next(err)

    if (existingUser !== null) {
      res.render('auth/signup', {
        errorMessage: `The email ${emailInput} is already in use.`
      })
      return
    }

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashedPass = bcrypt.hashSync(passwordInput, salt)

    const userSubmission = {
      name: nameInput,
      email: emailInput,
      password: hashedPass
    }

    new User(userSubmission)
      .save()
      .then(res.redirect('/'))
      .catch(res.render('auth/signup', {
        errorMessage: 'Something went wrong. Try again later.'
      }))
  })
})

router.get('/login', (req, res, next) => {
  res.render('auth/login', {
    errorMessage: ''
  })
})

router.post('/login', (req, res, next) => {
  const emailInput = req.body.email
  const passwordInput = req.body.password

  if (emailInput === '' || passwordInput === '') {
    res.render('auth/login', {
      errorMessage: 'Enter both email and password to log in.'
    })
    return
  }

  User.findOne({ email: emailInput }, (err, theUser) => {
    if (err || theUser === null) {
      res.render('auth/login', {
        errorMessage: `There isn't an account with email ${emailInput}.`
      })
      return
    }

    if (!bcrypt.compareSync(passwordInput, theUser.password)) {
      res.render('auth/login', {
        errorMessage: 'Invalid password.'
      })
      return
    }

    req.session.currentUser = theUser
    res.redirect('/')
  })
})


module.exports = router
