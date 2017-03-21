var http = require('http');
var fs = require('fs');

function startRequest(url, cb) {
    http.get(url, function (res) {
        var html = "";
        res.setEncoding('utf-8');
        res.on('data', function (chunk) {
            html += chunk
        })
        res.on('end', function () {
            cb(null, html)
        })
    })
}

function fsExistsSync(path) {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}

function fsWriteFileSync(file_path) {
    console.log(file_path);
    if (!fsExistsSync(file_path)) {
        fs.writeFileSync(file_path, "");
    }
}
module.exports = {
    startRequest: startRequest,
    fsExistsSync: fsExistsSync,
    fsWriteFileSync: fsWriteFileSync,
}