exports.boards_get_all = async (req, res) => {

    try{
        // populate를 진행하게 되면 참조했던 해당 데이터를 필요한 것만 가지고 오게 할 수 있다. 
        const boards = await boardModel.find()
        .populate('user', ['email'])

        res.status(200).json({
            msg : "get boards",
            count : boards.length,
            boardInfo : boards.map(board => {
                return {
                    id : board._id,
                    user : board.user,
                    contents : board.contents,
                    boardImage : board.boardImage
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

exports.boards_get_board = async (req, res) => {

    const id = req.params.boardId

    try{
        const board = await boardModel.findById(id)
        .populate('user', ['email'])
        
        if(!board){
            return res.status(401).json({
                msg : "no boardId"
            })
        }
        else{
            res.status(200).json({
                msg : "get board",
                boardInfo : {
                    id : board._id,
                    user : board.user,
                    contents : board.contents,
                    boardImage : board.boardImage
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

exports.boards_register = async (req, res) => {

    // 게시판을 작성할 때 필요한 정보는 user, board, boardImage 이지만 boardImage는 별도로 진행

    // board는 중복됨으로 contents로 수정해서 다시 진행할 예정 -> json형식인데 잘못된 방법으로 진행하고 있었음 수정하고 다시 진행  

    const { user, contents } = req.body

    const newBoard = new boardModel({
        user,
        contents,
        boardImage : req.file.path
    })

    try{

        const board = await newBoard.save()

        res.status(200).json({
            msg : "register board",
            boardInfo : {
                id : board._id,
                user : board.user,
                contents : board.contents,
                boardImage : board.boardImage
            }
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.boards_update = async (req, res) => {

    const id = req.params.boardId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    try{

        const board = await boardModel.findByIdAndUpdate(id, {$set : updateOps})

        if(!board){
            return res.status(401).json({
                msg : "no boardId"
            })
        }
        else{
            res.status(200).json({
                msg : "update board by id: ", id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.boards_delete_all = async (req, res) => {

    try{    
        await boardModel.remove()

        res.status(200).json({
            msg : "delete boards"
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.boards_delete_board = async (req, res) => {

    const id = req.params.boardId

    try{
        const board = await boardModel.findByIdAndRemove(id)

        if(!board){
            return res.status(401).json({
                msg : "no boardId"
            })
        }
        else{
            res.status(200).json({
                msg : "update board by id: ", id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};