const express = require('express')
var db = require('../controllers/helpers/dbconnect');
var registrationController = require('../controllers/registration/registration');

const cors = require('cors');

const app = express()
app.use(cors());

const port = 5000

app.use(express.json())

app.post('/add',registrationController.addUser)
app.get('/view/:id?',registrationController.getUser)
app.post('/update',registrationController.updateUser)
app.delete('/delete/:id?', registrationController.deleteUser);
app.listen(port, () => {
  console.log(`Server is up on port` + port)
})
