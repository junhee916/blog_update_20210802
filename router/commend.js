const express = require('express')
const router = express.Router()
const {
    commends_delete_all,
    commends_delete_commend,
    commends_get_commend,
    commends_register,
    commends_update
} = require('../controller/commend')

// detail get commend
router.get('/:commendId', commends_get_commend)

// register commend
router.post('/', commends_register)

// update commend
router.put('/:commendId', commends_update)

// total delete commend
router.delete('/', commends_delete_all)

// detail delete commend
router.delete('/:commendId', commends_delete_commend)

module.exports = router