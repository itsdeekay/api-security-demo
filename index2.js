const path = require('path');
const express = require('express');
const log4js = require('log4js');
const helper = require('./utility/helper');

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

log4js.configure({
    appenders: {
        multi: {
            type: "multiFile",
            base: "logs/",
            property: "categoryName",
            extension: ".log",
        },
        out: {
            type: "console"
        },
    },
    categories: {
        default: { appenders: ["multi", "out"], level: LOG_LEVEL },
    },
});

const app = express();
const logger = log4js.getLogger('Server');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { records: helper.readData() });
});

app.use('/api', require('./controllers/routes'));

app.use(function (err, req, res, next) {
    res.status(500);
    res.json(err);
})

app.listen(9000, function () {
    logger.info('Listening to Port 8000');
});