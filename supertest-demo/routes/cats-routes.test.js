process.env.NODE_ENV = 'test'

const request = require('supertest')

const app = require('../app')
let cats = require('../fakeDb')

let pickles = { name: 'Pickles' }
let newCat = { name: 'Blue' }

beforeEach(() => {
  cats.push(pickles)
})

afterEach(() => {
  //make sure this MUTATES and not redefines, 'cats'
  cats.length = 0
})

describe('GET /cats', () => {
  test('Gets all cats', async () => {
    const res = await request(app).get('/cats')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ cats: [pickles] })
  })
})

describe('GET /cats/:name', () => {
  test('Gets cat by name', async () => {
    const res = await request(app).get(`/cats/${pickles.name}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ cat: pickles })
  })
  test('404 for invalid cat', async () => {
    const res = await request(app).get(`/cats/icebaby`)
    expect(res.statusCode).toBe(404)
  })
})

describe('POST /cats', () => {
  test('Creating one cat', async () => {
    const res = await request(app).post('/cats').send(newCat)
    expect(res.statusCode).toBe(201)
    expect(res.body).toEqual({ cat: newCat })
  })
  test('400 error with missing data/name', async () => {
    const res = await request(app).post('/cats').send({})
    expect(res.statusCode).toBe(400)
  })
})

describe('PATCH /cats/:name', () => {
  test('Updating a cats name', async () => {
    const res = await request(app)
      .patch(`/cats/${pickles.name}`)
      .send({ name: 'Monster' })
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ cat: { name: 'Monster' } })
  })
  test('Response status code 404 invalid name', async () => {
    const res = await request(app)
      .patch(`/cats/Piggles`)
      .send({ name: 'Monster' })
    expect(res.statusCode).toBe(404)
  })
})

describe('DELETE /cats/:name', () => {
  test('deleting a cats name', async () => {
    const res = await request(app).delete(`/cats/${pickles.name}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ message: 'Deleted' })
  })
  test('404 for deleting a cat that doesnt exist', async () => {
    const res = await request(app).delete('/cats/hamsandy')
    expect(res.statusCode).toBe(404)
  })
})
