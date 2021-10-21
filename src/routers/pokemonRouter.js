const express = require('express');
const router = express.Router();
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const fs = require('fs')
const path = require('path')

// const bodyParser = require('body-parser');
// app.use(bodyParser.json())



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
    console.log("pokemon "+pokemon)

    const uesrHolderPath = path.resolve(`.\\users`, userName);
    if (fs.existsSync(uesrHolderPath)){                             // if uesr name exists uesrs
        const collection = fs.readdirSync(uesrHolderPath)
        console.log(collection)
        if (collection.includes(`${id}.json`)){                     // if in user name exists the pokemon
            res.status(403).json({ message: 'An error occured'})    // change status to 403
            throw new Error ('already caught');
        }
    }else{
        fs.mkdirSync(uesrHolderPath)                                // create a folder with the username 
    }
    fs.writeFileSync(`${uesrHolderPath}/${id}.json`, `${pokemon}`); // create pokemon to user name
    res.send(true)
})



// http://localhost:8080/pokemon/
router.get('/',(req, res) => {

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
