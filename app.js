const express = require("express");

const app = express();
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const dbPath = path.join(__dirname, "todoApplication.db");
app.use(express.json());

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(process.env.PORT || 3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/todos/", async (request, response) => {
  const getAllTodos = `select * from todo`;
  const data = await db.all(getAllTodos);
  response.send(data);
});

app.post("/todos/", async (request, response) => {
  const { id, todo, isChecked } = request.body;
  const postTodo = `insert into todo(id,todo,isChecked) values(${id},'${todo}','${isChecked}')`;
  await db.run(postTodo);
  const success = {
    status: 200,
    message: "Todo Successfully Added",
  };
  response.send(success);
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodo = `delete from todo where id = ${todoId}`;
  await db.run(deleteTodo);
  const success = {
    status: 200,
    message: "Todo Successfully Deleted",
  };
  response.send(success);
});
