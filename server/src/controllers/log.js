const fs = require('fs');

const logger =(userRequest,url,method,ip)=>{

    // userRequest[req.url] = userRequest[req.url] ? userRequest[req.url]+1 : 1;
    userRequest[ip] = {url: url, method: method, count: userRequest[ip] ? userRequest[ip].count+1 : 1}; 

    console.log("userRequest",userRequest);

    fs.appendFile('userLogs.json', JSON.stringify(userRequest[ip], null, 2) + ',\n', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        }
    });
}

module.exports = logger;