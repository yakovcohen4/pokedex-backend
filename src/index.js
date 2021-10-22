const express = require('express');
const app = express();

const port = 8080;
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

app.use(express.json())     // parses requests as json

const pokemonRouter = require('./routers/pokemonRouter');
const userRouter = require('./routers/userRouter');

const {errorHandler} = require('./middleware/errorHandler')
const {userHandler} = require('./middleware/userHandler')

// middleware userHandler
app.use(userHandler)

// http//localhost:8080/pokemon
app.use('/pokemon', pokemonRouter);

// http//localhost:8080/info
app.use('/info', userRouter);

// middleware errorHandler
app.use(errorHandler);

// app.get("/" , (req, res) => {
//   res.send("hello world")
//   P.getPokemonByName('1') 
//   .then(function(response) {
//     console.log(response.name);
//     console.log(response.height);
//     console.log(response.weight);
//     console.log(response.types[0].type.name);
//   })
//   .catch(function(error) {
//     console.log('There was an ERROR: ', error);
//   });
// })

// start the server
app.listen(port, function() {
  console.log('app started');
});

// route our app
app.get('/', function(req, res) {
  res.send('hello world!');
});