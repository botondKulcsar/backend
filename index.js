require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

const morgan = require('morgan')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({
      error: error.message
    })
  }

  next(error)
}


app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    response.status(400)
    return response.json({
      error: 'Request body is missing required fields'
    })
  }

  const newPerson = new Person({ name, number })

  newPerson.save()
    .then(savedPerson => {
      response.status(201)
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {

  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  const personToUpdate = { name, number }

  Person.findByIdAndUpdate(request.params.id, personToUpdate, { new: true, runValidators: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.send(`Phonebook has info for ${persons.length} people ${new Date()}`)
    })
    .catch(error => next(error))

})

const PORT = process.env.PORT



app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`)
})