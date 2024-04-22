const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const carsRoutes = require('./routes/cars');
app.use('/car', carsRoutes);

const homeRoutes = require('./routes/home');
app.use('/', homeRoutes);

app.use((req, res, next) => {
    console.log(`Received request for: ${req.url}`);
    res.status(404).send("404 Not Found");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
