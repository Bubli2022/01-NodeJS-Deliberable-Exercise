const express = require("express")
const path = require("path")
const fs = require("fs/promises")

const app = express()

const jsonPath = path.resolve("./file/todos.json")

app.use(express.json())

app.get("/tasks", async (req, res) => {
   const jsonFile = await fs.readFile(jsonPath, "utf8")
   res.send(jsonFile)
})

app.post("/tasks", async (req, res) => {
   const todo = req.body
   const todosArray = JSON.parse(await fs.readFile(jsonPath, "utf8"))
   const lastIndex = todosArray.length - 1
   const newId = todosArray[lastIndex].id + 1
   todosArray.push({ ...todo, id: newId })
   await fs.writeFile(jsonPath, JSON.stringify(todosArray))
   console.log(todosArray)
   res.end()
})

app.put("/tasks", async (req, res) => {
   const todosArray = JSON.parse(await fs.readFile(jsonPath, "utf8"))
   const { title, description, status, id } = req.body
   const todoIndex = todosArray.findIndex((todo) => todo.id === id)
   if (todoIndex >= 0) {
      todosArray[todoIndex].title = title
      todosArray[todoIndex].description = description
      todosArray[todoIndex].status = status
   }
   await fs.writeFile(jsonPath, JSON.stringify(todosArray))
   console.log(todosArray)
   res.send("to do actualizada")
})

app.delete("/tasks", async (req, res) => {
   const todosArray = JSON.parse(await fs.readFile(jsonPath, "utf8"))
   const { id } = req.body
   const todoIndex = todosArray.findIndex((todo) => todo.id === id)
   todosArray.splice(todoIndex, 1)
   await fs.writeFile(jsonPath, JSON.stringify(todosArray))
   res.end()
   console.log(todosArray)
})

const PORT = 8000

app.listen(PORT, () => {
   console.log(`Servidor escuchando en el puerto ${PORT}`)
})
