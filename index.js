var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer = require('multer');
const path = require('path');

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // File name with timestamp prefix
  }
});

// Multer upload configuration
const upload = multer({
  storage: storage
}).single('upfile'); // Name attribute of the file input field

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', (req, res) => {
  upload(req, res, err => {
    if(err) {
      console.log(err);
      return res.json({ error: "file upload failed"});
    }
    const {originalname, mimetype, size} = req.file;
    res.json({
      name: originalname,
      type: mimetype,
      size
    })
  })
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
