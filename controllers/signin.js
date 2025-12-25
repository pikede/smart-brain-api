const handleSignIn = (db, bcrypt) => (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) { // validates against empty and null
        return res.status(400).json('incorrect form submission');
    }
    db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash); // todo use async await, this is currently using schronous methods
        if(isValid) {
            return db.select('*').from('users')            
            .where('email', '=', email)
            .then(user => {
                console.log(user);
                res.json(user[0]);
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else{
            res.status(400).json('wrong credentials');
        }
    })
    .catch(err => res.status(400).json('wrong credentials'));
};

module.exports = {
    handleSignIn
};