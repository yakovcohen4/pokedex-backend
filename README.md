# pokedex-backend

## What is Express?
* A Framework, set of rules and thumb rules, for building web severs in node.js environment

## Environment
* Assuming you've already installed Node.js & NPM:
  * create project root directory: `mkdir examples` & `cd examples`
  * in project root directory use terminal/shell to `npm init` 
  * in project root directory use terminal/shell to: `npm install express --save`
* Nodemon - nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
  * in project root directory use terminal/shell to: `npm install --save-dev nodemon`
  * in package.json add:
    ```
    "scripts": {
        ...,
        "dev": "nodemon index.js"
    },
    ```
* Webpack - when do I need it and why? [hint: build heavy production environment in real life]

## Routing
* Routing determines how an application responds to a client request based on path & method
  * method = GET/POST/PUT/DELETE
  * path = all the string coming after domain
  * basic usage: `app.METHOD(PATH, HANDLER)`
  * you can (and should) have multiple routers for each "model" usage


## Middleware
* Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle. 
* The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.
* Middleware functions can perform the following tasks:
  * Execute any code. 
  * Make changes to the request and the response objects. 
  * End the request-response cycle. 
  * Call the next middleware in the stack. 
  * If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.
```
const myMiddleware = function(request, response, next) {
    const {username} = request.headers.username;
    if (username && userNameExist(username)) {
        next();
    }
    
    createNewUserDir(username);
    next();
})
```
## Parsing Requests
To parse incoming request we use json middleware in our app initiation
`express.json()` middleware - parses incoming requests with JSON payloads and is based on body-parser.
  * GET - use `request.query`
  * POST - use `request.body`
  * PUT - use `request.body`
  * DELETE - use `request.body`
  * You can also parse data out of the url by using path (`request.params`).
  * You can also parse data out the headers by using headers (`request.headers`)

## Handling Errors
* error handling in Express is done using middleware. 
* this middleware has special properties
* the error handling middleware are defined in the same way as other middleware functions, except that error-handling functions MUST have four arguments instead of three – err, req, res, next.
    ```
    app.use(function(err, req, res, next) {
       res.status(500);
       res.send("Oops, something went wrong.")
    });
    ```

## Response Types
* a JSON response, usually used for API: `response.json(...)`
  * all it does is just putting `content-type: application/json` in the response header to inform the client how to treat the response
* an HTML response, usually used for WEB pages `response.send(...)`
  * all it does is just putting `content-type: text/html` in the response header to inform the client how to treat the response

## Static Files
* Which files should be statically served?
* `app.use(express.static('STATIC_FOLDER_NAME'))`


## Assignment
1. start a new express project 
   1. `mkdir pokemon-api`
   2. `npm init`
   3. `npm install express --save`
   4. `npm install nodemon --save-dev`
   5. add `"dev": "nodemon index.js,` to `package.json`
2. create file `index.js`: 
    ```
    var express = require('express');
    var app = express();
    var port = 8080;
    
    // start the server
    app.listen(port, function() {
      console.log('app started');
    });
    
    // route our app
    app.get('/', function(req, res) {
      res.send('hello world!');
    });
    ```
3. use [pokedex-promise-v2](https://github.com/PokeAPI/pokedex-promise-v2) package to make requests to [pokeapi](https://pokeapi.co/)
   1. follow the steps on github repo for installation and usage
   2. You should use `getPokemonByName` method in your assigment
4. make new router `pokemonRouter.js` in your `/src/routers/` path with the following endpoints:
   1. GET - `/pokemon/get/:id` - should serve requests asking for finding a pokemon by its id
   2. GET - `/pokemon/query` - should serve requests asking for querying a pokemon by its name `{ query: string}`
   3. response format should be:
    ```
    {
       name: <string>
       height: <numeric>
       weight: <numeric>
       types: [ <string> ]
       front_pic: <string>
       back_pic: <string>
       abilities: [ <string> ]
    }
    ```
   3. PUT - `/pokemon/catch/:id` - should serve requests asking to catch a pokemon `{ pokemon: <pokemon object> }`
      1. this request will check if this pokemon exists in `/users/<username>/` dir (example: `/users/max-langerman/134.json`)
      2. if pokemon already caught (file already exist on the server), it will generate an error with 403 error code
      3. if pokemon haven't caught yet (file does not exist on the server), it will create a new json file.
      4. file content = `{pokemon object}`. file name = `<pokemon_id>.json`
   4. DELETE - `/pokemon/release/:id` - should serve requests asking to delete already caught pokemon
       1. this request will check if this pokemon exists in `/users/<username>/` dir
       2. if pokemon have been caught (file already exist on the server), it will release the pokemon (delete the file)
       3. if pokemon haven't caught yet (file does not exist on the server), it will generate an error with 403 error.
   5. GET - `/pokemon/` - should serve requests asking to list all pokemons caught by the user (list and parse all files inside `/users/{username>`)

5. make new router `userRouter.js` in your `/src/routers/` path with the following endpoint:
   1. POST - `/info` - should respond with user's name:
    ```
    {
       username: <string>
    }
    ```
6. make `errorHandler.js` middleware in `/src/middleware/` dir to handle app errors
   1. 404 for not found pokemons
   2. 403 for releasing an uncaught pokemon, or catching an already caught pokemon
   3. 500 for server errors
   4. 401 for unauthenticated user request (pokemon requests missing the username header)
7. make `userHandler.js` middleware in `/src/middleware` dir to handle users
   1. username will be sent as a header: `{username: <string>}`
   2. each request accessing `pokemonRouter` will go through that middleware
   3. middleware will parse the username from the request header and will assign this value to a variable
   ```
   let username = request.headers.username
   ```
   4. if username header is missing in these requests (pokemon requests) it will generate an error with 401 error code
8. update your previous pokedex app functionality to support new `pokedex-api` logic
   1. your pokedex should have an input of `username` being sent as a username header for each pokemon request
   2. input of type integer should request from `localhost:3000/pokemon/get/:id` (id = integer input)
   3. input of type string should request from `localhost:3000/pokemon/query` with body params (query = string input)
   4. to catch a pokemon you should request `localhost:3000/pokemon/catch/:id`
   5. to release a pokemon you should request `localhost:3000/pokemon/release/:id`
   6. don't forget to validate all of the requests in `pokedex-api` (example: pokemonId <= 150 and pokemonId > 0)
   7. update your previous pokdex app functionality to support new respond format
   8. you should have the feature of displaying all of the coming data from the api:
      1. pokemon object (name, height, weight, types, front_pic, back_pic, abilities)
      2. caught pokemon list
      3. error response

---
BONUS: wrap your previous pokedex project with [webpack Boilerplate](https://github.com/taniarascia/webpack-boilerplate)



## Resources
(express.js)[https://expressjs.com/]
(pokeapi)[https://pokeapi.co/]
(HTTP response codes)[https://developer.mozilla.org/en-US/docs/Web/HTTP/Status]


---

### You should pair up for this assignment.
### Each of you will develop a backend & frontend.
### You should implement your frontend to support your partner's backend.
### When finish, turn in you frontapp github repo + your partner's github repo.
#Good Luck!