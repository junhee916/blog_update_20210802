const jwt = require('jsonwebtoken')

// middelware의 역할은 token을 사용하고자할 때 token을 복호화해서 유저와 비유저를 구분해서 진행할 수 있게 도와준다. 
module.exports = async (req, res, next) => {

    try{
        const token = req.headers.authorization.split(' ')[1]

        const decode = jwt.verify(token, process.env.SECRET_KEY)

        req.userData = decode;

        next();
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
}