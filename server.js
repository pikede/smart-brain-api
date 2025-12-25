const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
require('dotenv').config();

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'prince',
        database: 'smart-brain',
        password: '',
    }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res)=> {
    db.select('*').from('users')
    .then(data => {res.json('success')})
    .catch(err => res.status(400).json('error starting server'));
});

app.post('/signin', signin.handleSignIn(db, bcrypt));
app.post('/register', (req, res) => { register.handleRegsiter(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

const PORT = process.env.PORT;
app.listen(PORT || 3000, () =>{
    console.log(`app is running on port ${PORT}`);
});