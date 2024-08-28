const express = require("express")
const app = express()
const port = 3000
const bodyParser = require("body-parser");
const fs = require("fs");
app.use(bodyParser.json());

//home page of todo app
app.get('/', (req,res) => {
  res.send("Home-Page-Todo-App");
})

//get all the todos
app.get('/todos', (req,res) => {
  fs.readFile("todo-app-data.json", "utf-8", function (err, data) {
    if(err){
      res.sendStatus(500);
    }
    else{
      const users = JSON.parse(data);
      res.send(users);
    }
  })
})

//add the todo sent in the body by the id number
app.post('/todos/:id', (req,res) => {
  fs.readFile("todo-app-data.json", "utf-8", function (err, data) {
    if(err){
      res.sendStatus(500);
    }
    else{
      const users = JSON.parse(data);
      const body = req.body;
      users.push({
        id: req.params.id,
        ...body
      })
      const jsonString = JSON.stringify(users, null, 2)
      fs.writeFile("todo-app-data.json" , jsonString, function (err) {
        if(err){
          res.sendStatus(500);
        }
        else{
          res.json({
            message: "todo added to the list"
          })
        }
      })
    }
  })  
})

// update the todo using the id 
app.put('/todos/:id', (req,res) => {
  let update = false;
  fs.readFile("todo-app-data.json", "utf-8", function (err, data) {
    if(err){
      res.sendStatus(500)
    }
    else{
      const users = JSON.parse(data);
      const updateTodoId = users.find(user => user.id === req.params.id)
      if(updateTodoId){
        update = true;
        if(req.body.description !== undefined){
          updateTodoId.description = req.body.description;
        }
        else if(req.body.status !== undefined){
          updateTodoId.status = req.body.status;
        } 
        else {
          res.json({
            message: "Data is not entered"
          })
        }
      }
      const jsonString = JSON.stringify(users, null, 2);
      fs.writeFile("todo-app-data.json", jsonString, function (err) {
        if(err){
          res.sendStatus(500);
        }
        else{
          res.json({
            message: "todo updated"
          })
        }
      })
    }
    if(update === false){
      res.json({
        message: "id is not correct"
      })
    }
  })  
})

// delete todo by giving particular id
app.delete("/todos/:id", (req,res) => {
  let update = false;
  fs.readFile("todo-app-data.json", "utf-8", function (err, data) {
    if(err) {
      res.sendStatus(500)
    }
    else{
      const users = JSON.parse(data);
      const todoDeleteIdIndex = users.findIndex(user => req.params.id === user.id)
      if(todoDeleteIdIndex !== -1){
        update = true;
        users.splice(todoDeleteIdIndex,1);
      }
      const jsonString = JSON.stringify(users, null, 2)
      fs.writeFile("todo-app-data.json", jsonString, function (err) {
        if(err){
          res.json(500)
        }
        else{
          res.json({
            message: "todo deleted of the given id"
          })
        }
      })
    }
    if(update === false){
      res.json({
        message: "id given is wrong"
      })
    }
  })  
})

app.listen(port, () => {
  console.log("App is listening on PORT:",port);
})


