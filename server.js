import http from 'http';
import dns from 'dns';

// Updated list of server configurations with specific ports
const serverConfigurations = [
    { ip: '190.104.146.244', port: 999 },
    { ip: '140.246.149.224', port: 8888 },
    { ip: '101.255.94.161', port: 8080 },
    { ip: '117.2.28.235', port: 55443 }
];

const getRandomServerConfiguration = () => {
    const randomIndex = Math.floor(Math.random() * serverConfigurations.length);
    return serverConfigurations[randomIndex];
};

const createServer = (ip, port) => {
    return http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Server is running on IPv4: ${ip}, Port: ${port}`);
    });
};

const startServer = (ip, port) => {
    const server = createServer(ip, port);

    server.listen(port, ip, (err) => {
        if (err) {
            console.error(`Failed to start server: ${err.message}`);
            return; // Exit early if there's an error
        }
        console.log(`Server is running on IPv4: ${ip}, Port: ${port}`);
    });
};

const isAddressAvailable = (ip) => {
    return new Promise((resolve) => {
        dns.lookup(ip, (err) => {
            resolve(!err);
        });
    });
};

const config = getRandomServerConfiguration();
const { ip, port } = config;

isAddressAvailable(ip).then((available) => {
    if (available) {
        startServer(ip, port);
    } else {
        console.error(`Address ${ip} is not available.`);
    }
});

const bindingIp = '0.0.0.0';
startServer(bindingIp, port);