require('dotenv/config');
const app = require('./app')
const mongoose = require('mongoose')

const DB = process.env.MONGODB_SERVER.replace('<password>', process.env.MONGODB_SERVER_PASSWORD)
mongoose.connect(DB)
    .then(() => console.log('Connected to MongoDB!'))
    .catch(() => console.log('MongoDB connection Failed!'))

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Surver Running on Port ${port}`))