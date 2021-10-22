const express = require('express');
const router = express.Router();
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

const fs = require('fs')
const path = require('path')


// http//localhost:8080/pokemon/get/:id
router.get('/get/:id',(req, res, next) => {
    const id = req.params.id;
    P.getPokemonByName(id)
    .then(function(response) {
            const pokedexObj2 = createPokeObj(response)
            return res.send(pokedexObj2);
        })
    .catch(function(error) {
        next({"status": 403, "messege": "no such Pokemon, try again"})
        });
})

// http//localhost:8080/pokemon/get/quary
router.get('/query',(req, res, next) => {
    const pokemonName = req.body.query;
    P.getPokemonByName(pokemonName)
    .then(function(response) {
            const pokedexObj2 = createPokeObj(response)
            return res.send(pokedexObj2);
        })
    .catch(function(error) {
        next ({"status": 403, "messege": "no such Pokemon, try again"})
        });
})

// http://localhost:8080/pokemon/catch/1
router.put("/catch/:id", (req, res)=> {
    const id = req.params.id;
    const userName = req.headers.username;
    const pokemon = JSON.stringify(req.body.pokemon);
    const userFolderPath = path.resolve(`.\\users`, userName);

    if (fs.existsSync(userFolderPath)){                             // if uesr name exists uesrs
        const collection = fs.readdirSync(userFolderPath)
        if (collection.includes(`${id}.json`)){                     // if in user name exists the pokemon
            throw { "status": 403,                                  // change status to 403
                    "messege": "Pokemon already caught"}; 
        }
    }
    fs.writeFileSync(`${userFolderPath}/${id}.json`, `${pokemon}`); // create pokemon to user name
    return res.send(true)
})


// http://localhost:8080/pokemon/release/:id
router.delete('/release/:id',(req, res) => {
    const id = req.params.id;
    const userName = req.headers.username;
    const userFolderPath = path.resolve(`.\\users`, userName);

    const collection = fs.readdirSync(userFolderPath);              // array with files pokemon
    if (!collection.includes(`${id}.json`)){                        // if not in collection
        throw { "status": 403,                                      // change status to 403
                "messege": "Pokemon is no in your collection"}; 
    }
    fs.unlinkSync(`${userFolderPath}/${id}.json`);                  // delete file
    return res.send(true);
    
})

// http://localhost:8080/pokemon/
router.get('/',(req, res) => {
    const userName = req.headers.username;
    const userFolderPath = path.resolve(`.\\users`, userName);
    const pokemonCollection = [];
    const collection = fs.readdirSync(userFolderPath);                   // array with files pokemon

    collection.forEach(pokemonFile => {
        const filePath = path.resolve(userFolderPath, pokemonFile);      // path of file 
        const pokemonObj = fs.readFileSync(filePath);                    // pokemon file object
        pokemonCollection.push(pokemonObj.toString())
    });
    return res.send(pokemonCollection);                                  // send array of pokemons object 
})

//create Poke Object from response
function createPokeObj (pokeObj) {
    const typesArray = [];
    for(type of pokeObj.types) {
        typesArray.push(type.type.name);
    }
    const abilitiesArray = [];
    for(ability of pokeObj.abilities) {
        abilitiesArray.push(ability.ability.name);
    }
    const pokedexObj = {
        "name": pokeObj.forms[0].name, 
        "height": pokeObj.height,
        "weight": pokeObj.weight,
        "types": typesArray,
        "front_pic": pokeObj.sprites.front_default,
        "back_pic": pokeObj.sprites.back_default,
        "abilities": abilitiesArray
    } 
    return pokedexObj;
}

module.exports = router;
