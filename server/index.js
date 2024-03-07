import express from 'express';
import apiRouter from './apiRouter.js'

const app = express()
const PORT = process.env.PORT || 3005

app.use(express.json())
app.use('/api', apiRouter)


const start = async () => {
    try {
        app.listen(PORT, () => {console.log(`Server started on port ${PORT}...`)})
    } catch (e) {
        console.log(e)
    }
}

start()
