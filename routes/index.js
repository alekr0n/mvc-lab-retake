const homeView = require('../views/home');

function handleHome(response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    
    const html = homeView.renderPage();
    response.write(html);

    response.end();
}

const fs = require('fs');
const querystring = require('querystring');
const addCarView = require('../views/add-car');

function handleAddCar(method, request, response){
    if (method === 'GET') {
        response.writeHead(200, {'Content-Type': 'text/html'});
        
        const html = addCarView.renderPage();
        response.write(html);

        response.end();
    } 
    else if(method === 'POST'){
        let body = [];
        request.on('data', chunk => {
            body.push(chunk);
        });
        request.on('end', () => {
            body = Buffer.concat(body).toString();
            const formData = querystring.parse(body);
            const formDataJSON = JSON.stringify(formData);

            fs.writeFile('formData.json', formDataJSON, err => {
                if (err) {
                    console.error(err);
                    response.writeHead(500, {'Content-Type': 'text/plain'});
                    response.end('Internal Server Error');
                } else {
                    response.writeHead(302, {'Location': '/car'});
                    response.end();
                }
            });
        });
    }
    else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end('Method Not Allowed');
    }
}

const carView = require('../views/car');

function handleCar(response){
    fs.readFile('formData.json', (err, data) => {
            response.writeHead(200, {'Content-Type': 'text/html'});
            
            const html = carView.renderPage(data);
            response.write(html);

            response.end();
    });
}

function handlePageNotFound(response) {
    response.writeHead(404, {'Content-Type': 'text/html'});
    
    response.write('404 Page Not Found');

    response.end();
}

module.exports = {
    handleHome,
    handleAddCar,
    handleCar,
    handlePageNotFound
};