const express = require('express');
const router = express.Router();
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb){
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4'){
            return cb(res.status(400).end('only mp4 file is allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({storage: storage}).single('file')

router.post('/uploadfiles', (req, res) => {
    upload(req, res, err => {
        if(err) {
            return res.json({success: false, error: err})
        }
        return res.json({
            success: true, 
            filePath: res.req.file.path,
            fileName: res.req.file.filename
        })
    })
})

module.exports = router