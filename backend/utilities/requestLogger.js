const fs = require('fs');

const requestLogger = (req, res, next) => {
    const logEntry = `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - IP: ${req.ip}\n\n`;
    fs.appendFile('requests.log', logEntry, (err) => {
        if (err) {
            console.error('Failed to write request log:', err);
        }
    });
    next();
};

module.exports = requestLogger;