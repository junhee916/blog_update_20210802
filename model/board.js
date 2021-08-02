const mongoose = require('mongoose')

/*
* 게시판을 작성할 때에는 로그인 된 대상자만 가능하기 때문에 user을 참조해서 진행해서 만든다.
*/

const boardSchema = mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user',
            required : true
        },
        contents : {
            type : String,
            required : true
        },
        boardImage : {
            type : String
        }
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('board', boardSchema)

