const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { isError } = require("lodash");

const { TodoModel, ErrorTypes } = require("./model");
const { randomDelayMiddleware, randomFailureMiddleware } = require("./helpers");

var jsonParser = bodyParser.json();

const app = express();

app.use(jsonParser);
app.use(cors());

app.use(randomDelayMiddleware);
app.use(randomFailureMiddleware);

app.get("/", () => {
  return res.send("Todo API");
});

app.get("/todos", (req, res) => {
  return res.send(TodoModel.getAll());
});

app.post("/todos", (req, res) => {
  const result = TodoModel.create(req.body);

  if (isError(result)) {
    return res.status(400).send(result);
  }

  return res.status(201).send(result);
});

app.put("/todos", (req, res) => {
  const data = req.body || {};

  const result = TodoModel.edit(data);

  if (isError(result)) {
    if (result.message === ErrorTypes.NotFound) {
      return res.status(404).send(result);
    }
    return res.status(400).send(result);
  }

  return res.status(201).send(result);
});

app.delete("/todos/:todoId", (req, res) => {
  const todoId = req.params.todoId;

  const result = TodoModel.delete(todoId);

  if (isError(result)) {
    return res.status(404).send(result);
  }

  return res.status(200).send({ message: "Deleted" });
});

app.listen(8080, () =>
  console.log(`TODO API listening on http://localhost:8080`)
);
