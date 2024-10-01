import http from 'http';
import net from 'net';
import url from 'url';
import { PORT } from './server.js'; // Note the .js extension

class ProxyServer {
    constructor(port) {
        this.server = http.createServer(this.handleRequest.bind(this));
        this.server.on('connect', this.handleConnect.bind(this));
        this.server.listen(port, () => {
            console.log(`Proxy server is running on port ${port}`);
        });
    }

    handleRequest(req, res) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Proxy server is working.');
    }

    handleConnect(req, clientSocket, head) {
        const { port, hostname } = url.parse(`http://${req.url}`);
        const serverSocket = net.connect(port, hostname, () => {
            clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
            serverSocket.write(head);
            serverSocket.pipe(clientSocket);
            clientSocket.pipe(serverSocket);
        });

        serverSocket.on('error', (err) => {
            console.error(`Connection error: ${err.message}`);
            clientSocket.end();
        });
    }
}

const proxyServer = new ProxyServer(PORT);