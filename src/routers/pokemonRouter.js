const express = require('express');
const router = express.Router();
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const fs = require('fs')
const path = require('path')


// http//localhost:8080/pokemon/get/:id
router.get('/get/:id',(req, res) => {
    const id = req.params.id;
    console.log("you in /get/:id")
    P.getPokemonByName(id)
    .then(function(response) {
            const pokedexObj2 = createPokeObj(response)
            console.log(pokedexObj2);
            res.send(pokedexObj2);
        })
    .catch(function(error) {
            console.log('There was an ERROR: ', error);
            res.send('no');
        });
})

// http://localhost:8080/pokemon/catch/1
router.put("/catch/:id", (req, res)=> {
    const id = req.params.id;
    const userName = req.headers.username;
    const pokemon = JSON.stringify(req.body.pokemon);
    const uesrFolderPath = path.resolve(`.\\users`, userName);

    if (fs.existsSync(uesrFolderPath)){                             // if uesr name exists uesrs
        const collection = fs.readdirSync(uesrFolderPath)
        if (collection.includes(`${id}.json`)){                     // if in user name exists the pokemon
            res.status(403).json({ message: 'An error occured'})    // change status to 403
        }
    }else{
        fs.mkdirSync(uesrFolderPath)                                // create a folder with the username 
    }
    fs.writeFileSync(`${uesrFolderPath}/${id}.json`, `${pokemon}`); // create pokemon to user name
    res.send(true)
})


// http://localhost:8080/pokemon/release/:id
router.delete('/release/:id',(req, res) => {
    const id = req.params.id;
    const userName = req.headers.username;
    const uesrFolderPath = path.resolve(`.\\users`, userName);

    if (fs.existsSync(uesrFolderPath)){                                 // if uesr name exists uesrs
        const collection = fs.readdirSync(uesrFolderPath);              // array with files pokemon
        if (!collection.includes(`${id}.json`)){                        // if not in collection
            res.status(403).json(
                {message: 'the pokemon is not on your collection'})     // change status to 403
        }
        fs.unlinkSync(`${uesrFolderPath}/${id}.json`);                  // delete file
        res.send(true);
    }
    res.status(403).json({ message: 'no such user'});                   // change status to 403
})

// http://localhost:8080/pokemon/
router.get('/',(req, res) => {
    const userName = req.headers.username;
    const uesrFolderPath = path.resolve(`.\\users`, userName);
    const pokemonCollection = [];

    if (!fs.existsSync(uesrFolderPath)){                                 // if not uesr name exists uesrs
        res.status(403).json({ message: 'no such user'});                // change status to 403
    }
    const collection = fs.readdirSync(uesrFolderPath);                   // array with files pokemon
    collection.forEach(pokemonFile => {
        const filePath = path.resolve(uesrFolderPath, pokemonFile);      // path of file 
        const pokemonObj = fs.readFileSync(filePath);                    // pokemon file object
        pokemonCollection.push(pokemonObj.toString())
    });
    res.send(pokemonCollection);                                         // send array of object pokemon
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
