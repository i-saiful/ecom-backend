const userRouter = require('../routers/userRouter');
const categoryRouter = require('../routers/categoryRouter')
const productRouter = require('../routers/productRouter')

module.exports = (app) => {
    app.use('/api/user', userRouter);
    app.use('/api/category', categoryRouter)
    app.use('/api/product', productRouter)
}