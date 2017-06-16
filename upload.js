/**
 * sử dụng module multer để upload file
 * moduls gm chỉnh sửa hình ảnh
**/
const express = require('express');
const nunjucks = require('nunjucks');
const multer = require('multer');
const fs = require('fs')
  , gm = require('gm').subClass({imageMagick: true});

const app = express();
//cấu hình nunjucks
nunjucks.configure('views', {
	autoescape: true,
	cache: false,
	express: app,
	watch: true
})

app.use('/public' ,express.static('public'));

app.engine('html', nunjucks.render)
app.set('view engine', 'html')

app.get('/', (req,res) => {
	res.render('upload.html')
})


const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/uploads')
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
	// console.log(req.file.path)

	gm(req.file.path)// đường dẫn file

	.font("Helvetica.ttf", 70)// chỉnh font chữ
	.drawText(100, 350, req.file.originalname) // text
	.write('./public/update/'+req.file.originalname, function (err) { // viết ra file mới
	  if (!err) console.log('done');

	  res.render('upload.html',{image: req.file.originalname} )
	});

})


app.listen(8000, () => {
	console.log('Web app listens at port 8000')
})
