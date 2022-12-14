const express = require('express');
const path = require('path');
const multer = require('multer');
const sortFile = require('./sortfile.js');
const inspector = require('./fileinspector.js');
const fs = require('fs');
const s = require('@json-spec/core');
const file = require('./spec/request/file.js');
const files = require('./spec/request/files.js');
const config = JSON.parse(fs.readFileSync('./serverconfig.json'));
const upload = multer({ dest: path.dirname(__dirname).replace(/\\/g, '/') + '/files/' });
const app = express();

app.post('/api/upload', upload.array('files'), (req, res) => {
    let id = null;
    if (req.files == null || !(s.isValid(file, req.files) || s.isValid(files, req.files))) return res.sendStatus(400);
    if (inspector.containOtherThanAudio(req.files)) {
        inspector.deleteAll(req.files);
        return res.sendStatus(400);
    }
    if (inspector.containAnyFilesFailedToSave(req.files)) {
        inspector.deleteAll(req.files);
        return res.sendStatus(500);
    }
    req.files.forEach(f => (id = sortFile(f, id)));
    console.log(id);
    res.send(id);
});

app.use(express.static('./wwwroot'));
app.listen(process.env.HTTP_PLATFORM_PORT || config.port);
