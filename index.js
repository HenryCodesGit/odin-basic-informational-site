const fsPromises = require('node:fs/promises')
const http = require('node:http');
const path = require('node:path');

const PORT = process.env.PORT || 5173;

const server = http.createServer(async (req, res) => {
    console.log(req.url);

    //Build the path for the file to serve
    let filePath = path.join(__dirname,'public', req.url === '/' ? 'index.html' : req.url)
    let resNum;

    //Try to read the file
    let fileData = await fsPromises.readFile(filePath)
        .then((data)=>{
            resNum = '200';
            return data;
        })
        .catch((err) => {
            resNum = (err.code === 'ENOENT') ? '404' : '500';
            filePath = path.join(__dirname,'public',`${resNum}.html`);
        
            return fsPromises.readFile(filePath); 
        })

    //Depending on the extension, will apply different content types
    let ext = path.extname(filePath);
    let contentType;
    switch(ext){
        case '.html':
            contentType = 'text/html'
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    //Afterwards, write to the response
    res.writeHead(resNum,{'Content-Type': contentType})
    res.end(fileData);
})

server.listen(PORT,()=>{
    console.log('Server listening..');
})