const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const bodyParser = require("body-parser")

// cấu hình nunjucks
nunjucks.configure('views', {
	autoescape: true,
	cache: false,
	express: app,
	watch: true
})

const urlencodedParser = bodyParser.urlencoded({extended: true})

app.engine('html', nunjucks.render)
app.set('view engine', 'html')


app.post('/', urlencodedParser, (req,res) => {
	let i = req.body.number1; // lấy number1 ở url
	let j = req.body.number2; // lấy number2 ở url
	let total = parseInt(i)+parseInt(j);// cộng hai số
	res.render('index.html', {total: total}) // trả kết quả về client
})

app.get('/', (req,res) => {
	res.render('index.html')
})


app.listen(5000, () => {
	console.log('Web app listens at port 5000')
})