const fs = require('fs');
const express = require('express');
const app = express();
const Joi = require('joi');
const errorHandler = require('./errorHandler.js');
const logger = require('./logger.js');
const dotenv = require('dotenv'); 
const {Client} = require('pg')
const client = new Client({
    host: "interns.postgres.database.azure.com",
    port: 5432,
    user: "postgres",
    password: "zatar123!",
    database: "julia"
})

const sql= fs.readFileSync('./schema.sql').toString();

client.connect()
.then(() => console.log("connected successfully"))
.then(() => client.query("select * from courses"))
.then(results => console.table(results.rows))
.catch(e => console.log(e.message))
.finally(() => client.end())

dotenv.config();

app.use(express.json());
app.use(errorHandler);
app.use(logger);

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
]

// PORT
const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('App listening on port ' + listener.address().port);
  });

//app.get()
app.get('/api/courses', (req,res)=>{
    try {
        res.status(200).json(courses);   
   } catch (error) {
        res.status(500).send('Something went wrong');   
} });


app.get('/api/courses/:id', (req,res) =>{
    try {
        const course = courses.find(c => c.id === parseInt(req.params.id));
        if (!course) return res.status(404).send('course with given ID not found');
        res.status(200).json(course);
    }
    catch (error) {
        res.status(500).send('Something went wrong');   
} 
});

// app.post()
app.post('/api/courses', (req,res)=>{
    try{
    const { error } = validateCourse(req.body); // eq to result.error
    if(error) return res.status(400).send(result.error.details[0].message);
  
    const course = {
        id: courses.length +1,
        name: req.body.name
    };
    courses.push(course);
    res.status(200).json(course);
} catch (error) {
    res.status(500).send('Something went wrong');   
} 
});

// app.put()
app.put('/api/courses/:id', (req,res) => {
    try{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('course with given ID not found');

    // const result = validateCourse(req.body);
    const { error } = validateCourse(req.body); // eq to result.error
    if(error) return res.status(400).send(result.error.details[0].message)
        
    //update course
    course.name = req.body.name;
    //return the updated course
    res.status(200).json(course);
    } catch (error) {
        res.status(500).send('Something went wrong');   
} 
});

// app.delete()
app.delete('/api/courses/:id', (req,res)=>{
    try{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('course with given ID not found');

    const index = courses.indexOf(course);

    courses.splice(index,1);

    res.status(200).json(course);
    } catch (error) {
        res.status(500).send('Something went wrong');   
} 

})

//Validate fun
function validateCourse(course){
    const schema ={
        name: Joi.string().min(3).required() 
    };

    return Joi.validate(course, schema);

}


