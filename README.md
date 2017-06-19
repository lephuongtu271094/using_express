# Example Express
## cách dùng : 
git clone https://github.com/lephuongtu271094/using_express.git

npm install

node index.js

node index2.js

node upload.js

##### lưu ý : 
file index.js và index2.js là tính tổng 2 số nhập từ input của form và in ra kết quả thông qua nunjucks.

file upload.js là upload file ảnh lên server và server trả về cho client file đã được chỉnh sửa sử dung module gm

## File index.js

File index.js sử dụng phương thức post 

Trang html :
```html
    <form action="/" method="post">
        <input type="text" name="number1">
        <input type="text" name="number2">
        <input type="submit" value="add" name="add"> 
    </form><br>
        <label>Total :</label>
        <h3 id='ketqua'>{{total}}</h3>
```
Sử dụng middleware body-parser:

```javascript
const urlencodedParser = bodyParser.urlencoded({extended: true}); //Express route-specific
```
Hàm lấy hai số và trả về kết quả cho client :
```javascript
    app.post('/', urlencodedParser, (req,res) => {
        let i = req.body.number1; // lấy number1 ở url
        let j = req.body.number2; // lấy number2 ở url
        let total = parseInt(i)+parseInt(j);// cộng hai số
	    res.render('index.html', {total: total}) // trả kết quả về client
    })

```
#### req.body
Contains key-value pairs of data submitted in the request body. By default, it is undefined, and is populated when you use body-parsing middleware such as body-parser and multer.

The following example shows how to use body-parsing middleware to populate req.body.

## file index2.js
file index2.js sử dụng phương thức get

Trang html :
```html
    <form action="/form" method="GET">
        <!--sử dụng nunjucks truyền vào value của input-->
        <div><input type="number" name="num1" value="{{a}}"> </div>
        <!--sử dụng nunjucks truyền vào value của input-->
        <div><input type="number" name="num2" value="{{b}}"></div>
        <!--sử dụng nunjucks truyền vào value sum-->
        <div> <h3>{{sum}}</h3></div>
        <!--truyền thuộc tính submit cho button để đẩy value lên url-->
        <div><button type="submit">Sum</button></div>
    </form>
```
Sử dụng middleware body-parser:

```javascript
    app.use(bodyParser.urlencoded({extended: true}))
```
Hàm lấy hai số và trả về kết quả cho client :
```javascript
    app.get('/form', (req, res) => {
        // sau dấu '?' thì dùng req.query đối với thẻ form
        let a = parseInt(req.query.num1) // lấy ra num1=a ở url
        let b = parseInt(req.query.num2) // lấy ra num2=b ở url
        let sum = a + b // tính tổng
        // render lại với nunjucks
        res.render('QueryStringExample.html', {
            a: a, // truyền value của a sang views
            b: b, // tương tự
            sum: sum //
        })
    })
```
#### req.query
This property is an object containing a property for each query string parameter in the route. If there is no query string, it is the empty object, {}.


## file upload.js

Cho phép upload file ảnh từ form.

Sau khi upload thì sửa ảnh (thêm text) và load ảnh đó

Sử dụng express.static và nunjucks để có thể load ảnh từ folder public vào trang html.

Sử dụng module multer để upload ảnh.

Sử dụng module gm để chỉnh sửa ảnh.

Form html upload ảnh : 
```html
    <form action="/upload" method="post" enctype="multipart/form-data">
        Select image to upload:<br>
        <input type="file" name="photo"><br>
        <input type="submit" value="Upload Image" name="submit">
    </form>
```
Sử dụng nunjucks : 
```html
    {% if image %}
        <p> ảnh viết chữ </p>
        <img src="/public/update/{{image}}" >
        <p> ảnh update </p>
        <img src="/public/uploads/{{image}}" >
    {% endif %}
```
nếu có image thì true,nếu không thì false

##### Hàm upload ảnh
```javascript
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
        // req.file.path là đường dẫn của file upload
        // req.file.originalname là tên của file upload
        gm(req.file.path)// đường dẫn file
    
        .font("Helvetica.ttf", 70)// chỉnh font chữ
        .drawText(100, 350, req.file.originalname) // text
        .write('./public/update/'+req.file.originalname, function (err) { // viết ra file mới đã sửa cho vào folder update
          if (!err) console.log('done');
    
          res.render('upload.html',{image: req.file.originalname} )
        });

    })

```
