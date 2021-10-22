
// errorHandler throw error for 404,403,500,401
// 404 for not found pokemons
// 403 for releasing an uncaught pokemon, or catching an already caught pokemon
// 500 for server errors
// 401 for unauthenticated user request (pokemon requests missing the username header)

function errorHandler (err, req, res, next) {

    console.log(err.status + " "+ err.messege);
    if(!err.status) {
        res.status(500);
        return res.send({"error": "internal server error"})
    }
    res.status(err.status);
    return res.send({"error": err.messege}) 
};



module.exports = {errorHandler}