// var http = require('http');
// var fs = require('fs');

// const PORT = 8080;

// fs.readFile('./views/125c9e1929b261ccb06585cb506130bd97e81f86b5791394752f12e5e4a0cf3a0d655a98e76c104fb61ce63f94d4de5d6105ad3c70e1b6fa552563a383ebb0ff', function (err, html) {

//     if (err) throw err;

//     http.createServer(function (request, response) {
//         response.writeHeader(200, { "Content-Type": "text/html" });
//         response.write(html);
//         response.end();
//     }).listen(PORT,()=>{
//         console.log("Server run 8080")
//     });
// });


const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;
const publicDirectory = path.join(__dirname, 'static');

const server = http.createServer((req, res) => {
    let filePath = path.join(publicDirectory, req.url === '/' ? 'index.html' : req.url);
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile('125c9e1929b261ccb06585cb506130bd97e81f86b5791394752f12e5e4a0cf3a0d655a98e76c104fb61ce63f94d4de5d6105ad3c70e1b6fa552563a383ebb0ff', (err, html) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile(path.join(publicDirectory, '404.html'), (error, content404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content404, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end(`Sorry, check with the site admin for error: ${err.code} ..\n`);
            }
        } else {
            res.writeHeader(200, { "Content-Type": "text/html" });
            res.write(html);
            res.end();
        }
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
