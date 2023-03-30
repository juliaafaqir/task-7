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

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("App listening on port " + listener.address().port);
})

app.use(express.json());
app.use(errorHandler);
app.use(logger);

//app.get()
app.get("/api/courses", (req, res) => {
  try {
      prisma.course.findMany()
      .then((results) => {
        console.log(results)
        res.status(200).send(results)})
  } catch (error) {
    res.status(500).send(`Something went wrong: ${error.message}`);
  }
});

//app.get(id)
app.get("/api/courses/:id", (req, res) => {
  try {
    prisma.course.findUnique({
      where: { id: parseInt(req.params.id)}
    })
    .then((results) => {
      if (results) res.status(200).send(results);    
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

    prisma.course.create({
    data :{ name : req.body.name}
    })
    .then(results => res.status(201).send(results))
    
  } catch (error) {
    res.status(500).send(`Something went wrong: ${error.message}`);
  }
});

// app.put()
app.put("/api/courses/:id", (req, res) => {
  try {    
    prisma.course.update({
      where: { id: parseInt(req.params.id)},
      data: {name:req.body.name}
    })
      .then((results) => res.status(201).send(`User modified with ID: ${req.params.id}`));

    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(result.error.details[0].message);
  } catch (error) {
    res.status(500).send(`Something went wrong: ${error.message}`);
  }
});

// app.delete()
app.delete("/api/courses/:id", (req, res) => {
  try {
    if (!parseInt(req.params.id)) return res.status(404).send("course with given ID not found");

    prisma.course.delete({
      where: { id: parseInt(req.params.id),},
    })
    .then((results) => res.status(200).send(`User deleted with ID: ${parseInt(req.params.id)}`))
    
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
