const express        = require('express')
const path           = require('path')
const favicon        = require('serve-favicon')
const logger         = require('morgan')
const cookieParser   = require('cookie-parser')
const bodyParser     = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const mongoose       = require('mongoose')
const {dbURL}        = require('./db')
const session        = require("express-session")
const MongoStore     = require("connect-mongo")(session)

module.exports = app => {
  mongoose.connect(dbURL, {useMongoClient: true})
        .then(() => console.log('Conectado a la BBDD'))

  // view engine setup
  app.set('views', path.join(__dirname, '../views'))
  app.set('view engine', 'ejs')
  app.set('layout','layouts/main-layout')
  app.use(expressLayouts)
  app.locals.title = 'Uber for Laundry'

  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
  app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, '../public')))

  app.use(session({
    secret: 'never do your own laundry again',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  }))

  app.use((req, res, next) => {
    if (req.session.currentUser) {
      res.locals.currentUserInfo = req.session.currentUser
      res.locals.isUserLoggedIn = true
    } else {
      res.locals.isUserLoggedIn = false
    }

    next()
  })
}
