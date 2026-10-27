const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../../uploads');
console.log(uploadDir);
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split('.').slice(0, -1).join(" ").trim().split(" ").join("-");
        const ext = path.extname(file.originalname);
        cb(null, name + '-' + Date.now() + ext);
    }
});

const upload = multer({ storage: storage });

module.exports = { upload }