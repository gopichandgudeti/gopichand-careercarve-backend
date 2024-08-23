const express = require('express')
const cors = require('cors');
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const databasePath = path.join(__dirname, 'careercarve.db')

const app = express()

app.use(cors());
app.use(express.json())

let database = null

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })

    app.listen(3003, () =>
      console.log('Server Running at http://localhost:3003/'),
    )
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

app.get('/mentors/', async (request, response) => {
  const getMentorsQuery = `
    SELECT
      *
    FROM
      mentors
    ORDER BY 
      id;`
  const mentors = await database.all(getMentorsQuery) // Use `all` instead of `get` to fetch all rows
  response.json(mentors)
})

app.get('/bookings/', async (request, response) => {
  const getMentorsQuery = `
    SELECT
      *
    FROM
      bookings
    ORDER BY 
      id DESC;`
  const mentors = await database.all(getMentorsQuery)
  response.json(mentors)
})

app.post('/bookings/', async (request, response) => {
  const {studentname, mentorname, duration, id} = request.body

  const postBookingQuery = `
    INSERT INTO 
      bookings (studentname, mentorname, duration, id)
    VALUES 
      ('${studentname}', '${mentorname}', ${duration}, ${id});`

  await database.run(postBookingQuery)
  response.json({message: 'Booking Successfull'})
})

module.exports = app
