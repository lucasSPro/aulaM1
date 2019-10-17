const express = require('express');

const server = express();
server.use(express.json());
//Query params = ?teste=1
//Route params = /users/1
//Request params = {"name"}

// CRUD 

const users =['Lucas','Isabele','pai'];

server.use((req,res, next) =>{
    console.time('Request');
    console.log(`Metodo : ${req.method}; Url: ${req.url}; `);

    next();

    console.log('Finalizou');
    console.timeEnd("Request");
})

function checkUserExists(req,res,next){
    if (!req.body.name){
        return res.status(400).json({error:'User name is required'});
    }

    return next();
}
function checkUserInArray (req,res,next){
    const user = users[req.params.index];
    if(!user){
        return res.status(400).json({error:'User does not exists'});
    }

    req.user = user;

    return next();
}

// rota para todos usuarios
server.get('/users',(req,res) => {
    return res.json(users);
})

//
server.get('/users/:index',checkUserInArray, (req,res)=>{
    //const nome = req.query.nome;
    //const id = req.params.id;
    //desistruração
    //const {index} = req.params;

    return res.json(req.user);
})
server.post('/users',checkUserExists,(req,res)=>{
    const {name}= req.body;

    users.push(name);

    return res.json(users);
})

server.put('/users/:index',checkUserExists,checkUserInArray, (req,res)=>{
    const {index} =  req.params;
    const {name} = req.body;

    users[index] = name

    return res.json(users);
})

server.delete('/users/:index',checkUserInArray,(req,res)=>{
    const {index} = req.params;
    users.splice(index,1);

    return res.send();
})

server.listen(3000);