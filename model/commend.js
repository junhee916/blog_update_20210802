const mongoose = require('mongoose')

/*
* commend는 비유저도 댓글을 남길 수 있게 하기 위해서 user에 required : true로 지정 안함 
*/

const commendSchema = mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user'
        },
        board : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'board',
            required : true
        },
        commend : {
            type : String,
            required : true
        }
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('commend', commendSchema)