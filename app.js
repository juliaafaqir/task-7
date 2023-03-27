const express = require('express');
const app = express();
const Joi = require('joi');
const ErrorHandler = require('./errorHandler.js');
const logger = require('./logger.js')

app.use(express.json());
app.use(ErrorHandler);
app.use(logger);

// Testing error handler:
// app.use("/", (req, res, next) => {
//     try{
//         // code block to be executed
//     }catch(err){
//       next(err);
//     }
//   })

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
    res.send(courses);
});


app.get('/api/courses/:id', (req,res) =>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('course with given ID not found');
    res.send(course);
});

// app.post()
app.post('/api/courses', (req,res)=>{
    const { error } = validateCourse(req.body); // eq to result.error
    if(error) return res.status(400).send(result.error.details[0].message);
  
    const course = {
        id: courses.length +1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

// app.put()
app.put('/api/courses/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('course with given ID not found');

    // const result = validateCourse(req.body);
    const { error } = validateCourse(req.body); // eq to result.error
    if(error) return res.status(400).send(result.error.details[0].message)
        
    //update course
    course.name = req.body.name;
    //return the updated course
    res.send(course);
})

// app.delete()
app.delete('/api/courses/:id', (req,res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('course with given ID not found');

    const index = courses.indexOf(course);

    courses.splice(index,1);

    res.send(course);

})

//Validate fun
function validateCourse(course){
    const schema ={
        name: Joi.string().min(3).required() 
    };

    return Joi.validate(course, schema);

}


