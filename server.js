const http = require('http');
const dns = require('dns');

// Updated list of server configurations with specific ports
const serverConfigurations = [
    { ip: '190.104.146.244', port: 999 }, // Paraguay
    { ip: '140.246.149.224', port: 8888 }, // China
    { ip: '101.255.94.161', port: 8080 }, // Indonesia
    { ip: '117.2.28.235', port: 55443 } // Additional IP
];

// Function to get a random server configuration
const getRandomServerConfiguration = () => {
    const randomIndex = Math.floor(Math.random() * serverConfigurations.length);
    return serverConfigurations[randomIndex];
};

// Create the HTTP server (without SSL/TLS)
const createServer = (ip, port) => {
    return http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Server is running on IPv4: ${ip}, Port: ${port}`);
    });
};

// Start the server with error handling
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

// Check if the IP address is available before starting the server
const isAddressAvailable = (ip) => {
    return new Promise((resolve) => {
        dns.lookup(ip, (err) => {
            resolve(!err); // Resolve true if no error, meaning the address is available
        });
    });
};

// Start the server if the IP address is available
const config = getRandomServerConfiguration();
const { ip, port } = config; // Destructuring assignment for clarity

isAddressAvailable(ip).then((available) => {
    if (available) {
        startServer(ip, port);
    } else {
        console.error(`Address ${ip} is not available.`);
    }
});

// Change the binding address to 0.0.0.0 for listening on all interfaces
const bindingIp = '0.0.0.0'; // Change to '127.0.0.1' for local access only
startServer(bindingIp, port);
