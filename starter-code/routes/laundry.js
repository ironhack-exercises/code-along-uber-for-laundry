const User = require('../models/user')
const router = require('express').Router()

router.use((req, res, next) => {
  if (req.session.currentUser) return next()
  res.redirect('/login');
})

router.get('/dashboard', (req, res, next) => {
  res.render('laundry/dashboard')
})

router.post('/launderers', (req, res, next) => {
  const userId = req.session.currentUser._id
  const laundererInfo = {
    fee: req.body.fee,
    isLaunderer: true
  }

  User.findByIdAndUpdate(userId, laundererInfo, { new: true }, (err, theUser) => {
    if (err) return next(err)

    req.session.currentUser = theUser

    res.redirect('/dashboard')
  })
})


module.exports = router
