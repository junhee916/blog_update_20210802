/*
* controller을 사용하는 목적은 코드를 좀 더 클린하게 하기 위함
* router은 router에 기능만 하게 하고 조작하는 부위를 따로 분리해서 
* router에 연결한다.
*/

const userModel = require('../model/user')
const jwt = require('jsonwebtoken')

exports.users_get_all = async (req, res) => {

    try{
        const users = await userModel.find()

        res.status(200).json({
            msg : "get users",
            count : users.length,
            userInfo : users.map(user => {
                return {
                    id : user._id,
                    name : user.name,
                    email : user.email,
                    password : user.password
                }
            })
        })
    }
    catch(err){

        res.status(500).json({
            msg : err.message
        })
    }
};

exports.users_get_user = async (req, res) => {

    const id = req.params.userId

    try{
        const user = await userModel.findById(id)

        // user에 대한 정보를 지웠을 경우 해당 아이디를 찾을 수 없기 때문에 조건문 작성
        if(!user){
            return res.status(401).json({
                msg : "no userId"
            })
        }
        else{
            res.status(200).json({
                msg : "get user",
                userInfo : {
                    id : user._id,
                    name : user.name,
                    email : user.email,
                    password : user.password
                }
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.users_signup = async (req, res) => {

    // 회원가입할 때에는 name, email, password를 입력

    const {name, email, password} = req.body

    try{
        // id 중복확인을 해야하기 때문에 db에서 email 유무 확인
        const user = await userModel.findOne({email})

        if(user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{
            
            // email이 사용이 가능하면 이제 해당 정보를 저장할 수 있게 한다.
            const user = new userModel({
                name,
                email,
                password
            })

            // save를 진행할 때 password 암호화를 해야하는데 그 작업은 model/user에서 진행한다. 
            await user.save()

            res.status(200).json({
                msg : "success signup",
                userInfo : {
                    id : user._id,
                    name : user.name,
                    email : user.email,
                    password : user.password
                }
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.users_login = async (req, res) => {

    // 로그인 할 때에는 email, password 만 입력

    const {email, password} = req.body

    try{

        // email 유무 확인을 통해 로그인 진행
        const user = await usermodel.findOne({email})

        if(!user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{
            // 비밀번호 compare 진행을 model/user에서 진행 
            await user.comparePassword()

            // login을 하면 token을 줄 수 있게 셋팅 -> token을 가지고 유저일 때만 가능한 혜택들을 줄 예정 
            const payload = {
                id : user._id,
                email : user.email
            }

            const token = jwt.sign(
                payload,
                process.env.SECRET_KEY,
                {expiresIn : '1h'}
            )

            res.status(200).json({
                msg : "success login",
                tokenInfo : token
            })
        }

    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.users_update = async (req, res) => {

    const id = req.params.userId

    // update 진행했을 때 변경된 내용을 담기 위한 그릇 변수
    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    try{
        const user = await userModel.findByIdAndUpdate(id, {$set : updateOps})

        if(!user){
            return res.status(401).json({
                msg : "no userId"
            })
        }
        else{
            res.status(200).json({
                msg : "update user by id: ", id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.users_delete_all = async (req, res) => {

    try{
        await userModel.remove()

        res.status(200).json({
            msg : "delete users"
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.users_delete_user = async (req, res) => {

    const id = req.params.userId

    try{
        const user = await userModel.findByIdAndRemove(id)

        if(!user){
            return res.status(401).json({
                msg : "no userId"
            })
        }
        else{
            res.status(200).json({
                msg : "delete user by id: ", id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};