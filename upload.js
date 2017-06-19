/**
 * sử dụng module multer để upload file
 * moduls gm chỉnh sửa hình ảnh
**/
const express = require('express');
const nunjucks = require('nunjucks');
const multer = require('multer');
const fs = require('fs') // require các module để sửa ảnh
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

// Khởi tạo các thuộc tính của multer
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		//nơi chứa file upload
		cb(null, './public/uploads')
	},
	filename: function (req, file, cb) {
		// cb(null, shortid.generate() + '-' + file.originalname)
		// Tạo tên file mới cho file vừa upload
		cb(null, file.originalname)
	}

})

function fileFilter(req, file, cb) { // hàm phân loại file upload
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') { // nếu là đuôi png,jpg,jpeg
		// nếu là file image thì upload file.
		cb(null, true)
	} else {
		// nếu không phải thì bỏ qua phần upload
		cb(new Error(file.mimetype + ' is not accepted'))
	}
}
// các thuộc tính của multer gán cho biến upload
app.upload = multer({storage: storage , fileFilter:fileFilter})
//hàm upload , chỉnh sửa hình ảnh , lưu hình upload và hình đã sửa ,
app.post('/upload',app.upload.single('photo'),function(req,res){
	// console.log(req.file.path)

	gm(req.file.path)// đường dẫn file

	.font("Helvetica.ttf", 70)// chỉnh font chữ
	.drawText(100, 350, req.file.originalname) // text
	.write('./public/update/'+req.file.originalname, function (err) { // viết ra file mới đã sửa cho vào folder update
	  if (!err) console.log('done');

	  res.render('upload.html',{image: req.file.originalname} )
	});

})


app.listen(8000, () => {
	console.log('Web app listens at port 8000')
})
