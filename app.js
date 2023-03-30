const fs = require("fs");
const express = require("express");
const app = express();
const Joi = require("joi");
const errorHandler = require("./errorHandler.js");
const logger = require("./logger.js");
const dotenv = require("dotenv");
const { Client } = require("pg");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

client.connect()
.then(()=> {const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("App listening on port " + listener.address().port);
  })})
.then(() => console.log("connected successfully"))
// .then(() => client.query("select * from courses"))
 // .then(results => console.table(results.rows))
.catch((e) => console.log(e.message));
// .finally(() => client.end())


app.use(express.json());
app.use(errorHandler);
app.use(logger);

//app.get()
app.get("/api/courses", (req, res) => {
  try {
    client
      .query("select * from courses")
      .then((results) => res.status(200).send(results.rows));
  } catch (error) {
    res.status(500).send(`Something went wrong: ${error.message}`);
  }
});

//app.get(id)
app.get("/api/courses/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    client
      .query("select * from courses WHERE id = $1", [id])
      .then((results) => {
        if (results.rows.length > 0) res.status(200).send(results.rows);    
        else res.status(404).send("course with given ID not found");

      });
  } catch (error) {
    res.status(500).send(`Something went wrong: ${error.message}`);
  }
});

// app.post()
app.post("/api/courses", (req, res) => {
  try {
    const { error } = validateCourse(req.body); // eq to result.error
    if (error) return res.status(400).send(result.error.details[0].message);

    client
    .query("INSERT INTO courses (name) VALUES ($1)", [req.body.name])
    .then((results) => res.status(201).json(course))
    
  } catch (error) {
    res.status(500).send(`Something went wrong: ${error.message}`);
  }
});

// app.put()
app.put("/api/courses/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    client
      .query("UPDATE courses SET name = $1 WHERE id = $2", [req.body.name, id])
      .then((results) => res.status(200).send(`User modified with ID: ${id}`));

    // const result = validateCourse(req.body);
    const { error } = validateCourse(req.body); // eq to result.error
    if (error) return res.status(400).send(result.error.details[0].message);
  } catch (error) {
    res.status(500).send(`Something went wrong: ${error.message}`);
  }
});

// app.delete()
app.delete("/api/courses/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) return res.status(404).send("course with given ID not found");

    client
    .query("DELETE FROM courses WHERE id = $1", [id])
    .then((results) => res.status(200).send(`User deleted with ID: ${id}`))
    
  } catch (error) {
    res.status(500).send(`Something went wrong: ${error.message}`);
  }
});

//Validation function (JOI)
function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(course, schema);
}
