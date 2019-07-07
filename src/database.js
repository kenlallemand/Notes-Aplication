const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/node-learn', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(db => console.log('db is connected'))
    .catch(err => console.error(err));