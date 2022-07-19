const { response, request, Router } = require("express");
const { v4: uuidv4 } = require("uuid");

const express = require("express");
const app = express();

app.use(express.json());

const customers = [];

//middleware
function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ error: "Nenhum statement encontrado" });
  }

  request.customer = customer;
  return next();
}

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return response
      .status(400)
      .json({ error: "Conta com esse CPF já existente" });
  }

  customers.push({
    name,
    cpf,
    id: uuidv4(),
    statement: [],
  });

  console.log("Dado cadastrado", customers);

  return response.status(201).send();
});

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  return response.json(customer.statement);
});

app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
  const { description, amount } = request.body;
  const { customer } = request;

  const statementOperation = {
    description,
    amount,
    date: new Date(),
    type: "credit",
  };

  customer.statement.push(statementOperation);

  return response.status(201).send();
});

app.listen(3333);
