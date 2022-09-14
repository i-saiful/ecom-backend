const userRouter = require('../routers/userRouter');
const categoryRouter = require('../routers/categoryRouter')
const productRouter = require('../routers/productRouter')
const cartRouter = require('../routers/cartRouter')

module.exports = (app) => {
    app.use('/api/user', userRouter);
    app.use('/api/category', categoryRouter)
    app.use('/api/product', productRouter)
    app.use('/api/cart', cartRouter)
}