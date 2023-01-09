const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', require('./controllers/routes'));

app.use(function (err, req, res, next) {
    res.status(500);
    res.json(err);
})

app.listen(8000, function () {
    console.log('Listening to Port 8000');
});