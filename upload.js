/**
 * sử dụng module multer để upload file
**/
const express = require('express');
const nunjucks = require('nunjucks');
const multer = require('multer');


const app = express();
//cấu hình nunjucks
nunjucks.configure('views', {
	autoescape: true,
	cache: false,
	express: app,
	watch: true
})

app.engine('html', nunjucks.render)
app.set('view engine', 'html')

app.get('/', (req,res) => {
	res.render('upload.html')
})


const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads')
	},
	filename: function (req, file, cb) {
		// cb(null, shortid.generate() + '-' + file.originalname)
		cb(null, file.originalname)
	}
})

function fileFilter(req, file, cb) { // hàm kiểm tra đuôi file
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') { // nếu là đuôi png,jpg,jpeg
		cb(null, true)
	} else {
		cb(new Error(file.mimetype + ' is not accepted'))
	}
}

app.upload = multer({storage: storage , fileFilter:fileFilter})
app.post('/upload',app.upload.single('photo'),function(req,res){
    res.send('upload thanh cong')
})


app.listen(8000, () => {
	console.log('Web app listens at port 8000')
})