const express = require ('express');

const server = express();

server.use(express.json());


// array para armazenar os dados dos projetos
const projects = [];

// Middleware que verifica se o projeto existe 

function checkProjectExists(req, res, next) {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);
  
    if (!project) {
      return res.status(400).json({ error: 'Project not found' });
    }
  
    return next();
  }

// recebe um novo projeto ainda sem nenhuma tarefa
server.post('/projects', (req, res) => {
    const {id, title} = req.body;
 
    const project = {
      id,
      title,
      tasks: []
    };

    projects.push(project);
  
    return res.json(project);
  });

// Lista todos os projetos existentes
server.get ('/projects',(req,res)=>{
    return res.json(projects);
})

// altera o titulo de um projeto atraves do id -- com middleware 
server.put('/projects/:id',checkProjectExists, (req,res)=>{
    const {id} = req.params;
    const {title}= req.body;

    const project = projects.find(p => p.id == id);

    project.title = title;

    return res.json(project);

})

//deleta um projeto atraves do id -- com middleware 
server.delete('/projects/:id',checkProjectExists, (req,res)=>{
    const {id} = req.params;
    
    const projectIndex =  projects.findIndex(p => p.id == id);

    projects.splice(projectIndex,1);

    return res.send();
})

// adiciona uma tarefa atraves do id do projeto -- com middleware 
server.put('/projects/:id/tasks',checkProjectExists, (req,res)=>{
    const {id} = req.params;
    const {title} = req.body;
    
    const project = projects.find(p => p.id == id);

    project.tasks.push(title);

    return res.json(project);
})

server.listen(3000);