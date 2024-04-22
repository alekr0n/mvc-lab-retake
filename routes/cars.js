const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const path = require('path');

let cars = [];
let nextId = 1;

const addCar = (make, model, year, color) => {
    const newCar = {
        id: nextId++,
        make: make,
        model: model,
        year: year,
        color: color
    };
    cars.push(newCar);
};

router.get('/', (req, res) => {
    const $ = cheerio.load('<div class="car"></div>');

    if (cars.length === 0) {
        $('.car').text('No cars has been found.');
    } else {
        const car = cars[cars.length - 1];
        $('.car').append('<h2>Last added car</h2>');
        $('.car').append(`<div><span class="bold">Make:</span> ${car.make}</div>`);
        $('.car').append(`<div><span class="bold">Model:</span> ${car.model}</div>`);
        $('.car').append(`<div><span class="bold">Year:</span> ${car.year}</div>`);
        $('.car').append(`<div><span class="bold">Color:</span> ${car.color}</div>`);
    }

    res.send($.html());
});

router.get('/add', (req, res) => { 
    res.sendFile(path.resolve('views', 'add-car.html'));
});

router.get('/list', (req, res) => {
    const $ = cheerio.load('<div class="cars"></div>');

    if (cars.length === 0) {
        $('.cars').text('No cars has been found.');
    } else {
        $('.cars').append('<h2>Cars</h2>');
        const carList = $('<ul></ul>');
        cars.forEach(car => {
            const listItem = $('<li></li>');
            listItem.append(`<p><span class="bold">Make:</span> ${car.make}</p>`);
            listItem.append(`<p><span class="bold">Model:</span> ${car.model}</p>`);
            listItem.append(`<p><span class="bold">Year:</span> ${car.year}</p>`);
            listItem.append(`<p><span class="bold">Color:</span> ${car.color}</p>`);
            carList.append(listItem);
        });
        $('.cars').append(carList);
    }

    res.send($.html());
});

router.post('/add', (req, res) => {
    const { make, model, year, color } = req.body;
    addCar(make, model, year, color);
    res.redirect('/car');
});

module.exports = router;