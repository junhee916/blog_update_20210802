const express = require('express')
const router = express.Router()
const boardModel = require('../model/board')
const multer = require('multer')
const checkAuth = require('../middleware/check_auth')
const {
    boards_delete_all,
    boards_delete_board,
    boards_get_all,
    boards_get_board,
    boards_register,
    boards_update
} = require('../controller/board')

const storage = multer.diskStorage({

    // destination은 위치이기 때문에 이미지를 넣는 장소를 어디에 할 것인지 물어보는 것임으로 uploads 파일 위치를 넣는다.
    destination : function (req, file, cb){
        cb(null, './uploads')
    },
    // filename은 말그래도 filename을 어떻게 할 것인지 물어보는 것이기 때문에 orginalname으로 지정한다. 
    filename : function(req, file, cb){
        cb(null, file.originalname)
    }
})

// fileFilter에 역할은 jpeg or png이면 filter을 허용하겠다는 의미이다.
const fileFilter = (req, file, cb) => {

    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }
    else{
        cb(null, false)
    }
}

const upload = multer({

    storage : storage,
    limit : {
        // fileszie는 5mb로 설정
        filesize : 1024*1024*5
    },
    fileFilter : fileFilter
})

// total get board
router.get('/', boards_get_all)

// detail get board
router.get('/:boardId', checkAuth, boards_get_board)

// register board
router.post('/', checkAuth, upload.single('boardImage'), boards_register)

// update board
router.put('/:boardId', checkAuth, boards_update)

// total delete board
router.delete('/', boards_delete_all)

// detail delete board
router.delete('/:boardId', checkAuth, boards_delete_board)

module.exports = router