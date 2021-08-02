const mongoose = require('mongoose')

const connectDB = async () => {

    try{
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex : true
        })

        console.log("connected mongodb...")
    }
    catch(err){
        console.log(err)
        // 완성이 안될 때 process.exit(1)로 설정
        process.exit(1)
    }
}

module.exports = connectDB