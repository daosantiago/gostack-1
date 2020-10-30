const express = require("express");
const cors = require("cors");
const { v4, validate } = require("uuid")

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repos = [];

function validateRepositoryId(request, response, next){
  const { id } = request.params;

  if (!validate(id)){
    return response.status(400).json({error: 'Invalid project id.'});
  }

  return next();
};

app.use('/repositories/:id', validateRepositoryId);

app.get("/repositories", (request, response) => {
  return response.json(repos);
});

app.post("/repositories", (request, response) => {
  //Desestrutura as variáveis enviadas no body em json
  const { title, url, techs } = request.body;
  const likes = 0;
  repo = { id: v4(), title, url, techs, likes};
  
  repos.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  console.log(id);

  const repoId = repos.findIndex(repo => repo.id === id);

  if (repoId < 0){
    return response.json({ message: "Repository not found" })
  }

  const likes = repos[repoId].likes;

  const repo = { id, title, url, techs, likes}

  repos[repoId] = repo;

  return response.json(repo);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoId = repos.findIndex(repo => repo.id === id);

  if (repoId < 0){
    return response.json({ message: "Repository not found" })
  }  

  repos.splice(repoId, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repos.findIndex(repo => repo.id === id);

  if (repoIndex < 0){
    return response.json({ message: "Repository not found" })
  }  

  repos[repoIndex].likes++;

  return response.json(repos[repoIndex]);

});

module.exports = app;
