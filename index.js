const express = require('express');
const app = express();
const cors = require('cors');

const morgan = require('morgan');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => Math.floor(Math.random() * 100) + persons.length

app.post('/api/persons', (request, response) => {
    const { name, number } = request.body;

    if (!name || !number) {
        response.status(400);
        return response.json({
            error: `Request body is missing required fields`
        })
    }

    const existingPerson = persons.find(p => p.name === name);
    if (existingPerson) {
        response.status(400);
        return response.json({
            error: `name must be unique`
        })
    }

    const newPerson = { id: generateId(), name, number };
    persons = persons.concat(newPerson)
    response.status(201);
    response.json(newPerson);
})

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get(`/api/persons/:id`, (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);
    if (!person) {
        return response.status(404).send(`No person with id=${id} has been found`)
    }
    response.json(person);
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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
})