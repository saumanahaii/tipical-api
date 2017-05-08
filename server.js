const express = require('express');
const app = express();


app.use(express.static('public'));

app.get('/',(req,res)=>{
    return res.body;
});


app.listen(8080, () => console.log('app is listening'));

module.exports = app;