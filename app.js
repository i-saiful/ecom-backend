require('express-async-errors')
const express = require('express')
const app = express();
const compression = require('compression')
const cors = require('cors')
const morgan = require('morgan')
const error = require('./middlewares/error')

const userRouter = require('./routers/userRouter');
const categoryRouter = require('./routers/categoryRouter')
const productRouter = require('./routers/productRouter')

app.use(express.json())
app.use(compression())
app.use(cors())
if (process.env.NODE_ENV === 'development')
    app.use(morgan('dev'))

app.use('/api/user/', userRouter);
app.use('/api/category', categoryRouter)
app.use('/api/product',productRouter)

app.use(error)

module.exports = app;