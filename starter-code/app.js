const app = require('express')()
require('./config/express')(app)

const index = require('./routes/index')
const users = require('./routes/users')
const authRoutes = require('./routes/auth')
const laundryRoutes = require('./routes/laundry')

app.use('/', index)
app.use('/users', users)
app.use('/', authRoutes)
app.use('/', laundryRoutes)

require('./config/error-handler')(app)

module.exports = app
