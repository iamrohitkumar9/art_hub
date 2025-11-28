const fs = require('fs');

const errorLogger = async (err, req, res, next) => {
    const logEntry = `[${new Date().toISOString()}] ${req.method} -- ${req.url} -- ${err.message}\n\n`;
    try {
        await fs.appendFile('error.log', logEntry);
    } catch (fsErr) {
        console.error('Failed to write to error log:', fsErr);
    }
    next(err);  
}
module.exports = errorLogger;