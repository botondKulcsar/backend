require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Person = require('./models/person');

const morgan = require('morgan');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`));



app.post('/api/persons', (request, response) => {
    const { name, number } = request.body;

    if (!name || !number) {
        response.status(400);
        return response.json({
            error: `Request body is missing required fields`
        })
    }

    const newPerson = new Person({ name, number })
   
    newPerson.save().then(savedPerson => {
        response.status(201);
        response.json(savedPerson);
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    })
})

app.get(`/api/persons/:id`, (request, response) => {
    // const id = Number(request.params.id);
    // const person = persons.find(p => p.id === id);
    // if (!person) {
    //     return response.status(404).send(`No person with id=${id} has been found`)
    // }
    Person.findById(request.params.id).then(person => {
        response.json(person);
    })
    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);
    if (!person) {
        return response.status(404).send(`No person with id=${id} has been found`)
    }

    persons = persons.filter(p => p.id !== id);
    response.status(204).end();
})

app.get(`/info`, (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people
    ${new Date()}`);
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
})