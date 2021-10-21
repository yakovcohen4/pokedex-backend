const express = require('express');
const router = express.Router();

//localhost:8080/info

//Return user name
router.post("/", (req, res)=> {
    // res.send("ododo")
    const userName = req.headers.username; //get user name
    res.json({"username": userName});
})

module.exports = router;
