const { response } = require("express");
const { v4: uuidv4 } = require("uuid");

const express = require("express");
const app = express();

app.use(express.json());

const customer = [];

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;
  const id = uuidv4();

  customer.push({
    name,
    cpf,
    id,
    statement: [],
  });

  console.log("Dado cadastrado", customer);

  return response.status(201).send();
});

app.listen(3333);
