const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

/*
* required -> 꼭 들어가야하는 input value / unique -> 중복이 되면 안됨 
* unique가 email에만 적용되는 이유는 아이디 중복확인을 하기 위함이다. 
*/

const userSchema = mongoose.Schema(
    {
        name : {
            type : String
        },
        email : {
            type : String,
            required : true,
            unique : true,
            match : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        },
        password : {
            type : String,
            required : true
        }
    },
    {
        timestamps : true
    }
)


// router/user - signup 에서 save를 진행할 때 password를 암호화 작업 
userSchema.pre('save', async function(next){

    try{
        const salt = await bcrypt.genSalt(10)

        const passwordHash = await bcrypt.hash(this.password, salt)

        this.password = passwordHash;

        next()
    }
    catch(err){
        next(err)
    }
})

// router/user - login할 때 비밀번호 암호화했던 것을 isInputPassword와 비교해서 동일한 지 확인
userSchema.methods.comparePassword = function(isInputPassword, cb){

    bcrypt.compare(isInputPassword, this.password, (err, isMatch) => {
        
        if(err) return cb(null, err)
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('user', userSchema)