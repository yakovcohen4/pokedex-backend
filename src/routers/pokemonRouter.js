const express = require('express');
const router = express.Router();

const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

// http//localhost:8080/pokemon/get/:id
// Object.keys(myObj)
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
