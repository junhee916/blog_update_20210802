// dotenv 경로 연결한 것을 가져오기 위함 
require('dotenv').config()

const express = require('express')
const app = express()

// 프론트에서 req.body로 값을 요청하거나 내보낼 때 필요함 
const bodyParser = require('body-parser')
// 터미널을 통해 서버 상태 확인 가능 
const morgan = require('morgan')
// cors는 프론트에서 별도로 서버 상태 확인하는 것인데 우선 추후 변동은 없음 
const cors = require('cors')

// connect router
const userRouter = require('./router/user')
const boardRouter = require('./router/board')
const commendRouter = require('./router/commend')

// connect mongodb
const connectDB = require('./config/database')
connectDB()

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

app.use(morgan('dev'))
app.use(cors())

// express static 
app.use('/uploads', express.static('uploads'))

app.use('/user', userRouter)
app.use('/board', boardRouter)
app.use('/commend', commendRouter)

// .env 경로 PORT = 5000 만약 안될 시에는 7000으로 port 연결 진행 
const PORT = process.env.PORT || 7000

app.listen(PORT, console.log("connected server..."))