
const fs = require('fs')
const path = require('path')

// Username will be sent as an HTTP header: "username": "<string>"
// Each request accessing pokemonRouter will go through that middleware
// The middleware will parse the username from the request header and will use its value to respond catch/release requests
// If username header is missing in these requests (pokemon requests) it will generate an error with 401 error code

function userHandler (req, res, next) {

    const userName = req.headers.username;
    if (!userName){                                           // if miss user name header
        throw { "status": 401,                                // throw error 401
                "messege": "miss user name header"};                         
    }
    if (userName !== undefined){
        const userFolderPath = path.resolve(`.\\users`, userName);
        if (!fs.existsSync(userFolderPath) ){                     // if miss folder to username
            fs.mkdirSync(userFolderPath)                          // create a folder to username 
        }
    }
    next();
};

module.exports = {userHandler}