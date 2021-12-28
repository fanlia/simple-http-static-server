
const http = require('http')
const fs = require('fs')
const path = require('path')

const mime = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.ico': 'image/vnd.microsoft.icon',
}

const DIR = process.env.DIR || 'dist'

const not_found = (res, url) => {
    res.writeHead(404, { 'Content-Type': mime['.html'] })
    res.end(`${url} Not Found`)
}

const handler = (req, res) => {

    const url = req.url === '/' ? 'index.html' : req.url
    const extname = path.extname(url)
    const content_type = mime[extname]
    if (!content_type) return not_found(res, url)
    const filepath = path.join(__dirname, DIR, url)
    const filestream = fs.createReadStream(filepath)
    filestream.on('error', () => not_found(res, url))
    res.writeHead(200, { 'Content-Type': content_type })
    filestream.pipe(res)
}

const port = process.env.PORT || 3000

http.createServer(handler).listen(port, () => {
    console.log(`server started at http://localhost:${port} from ${DIR}`)
})
