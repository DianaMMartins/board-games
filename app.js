const express = require('express');
const app = express();
app.use(express.json());

app.get('/api', (req, res) => {
    res.status(200).send({msg: 'Connected'})
})


//get to connect to api/categories
//responds with an array of category objects 
//with properties of slug and description

module.exports = app