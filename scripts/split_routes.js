const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const workingDirectory = __dirname;
const destinationPath = path.resolve(workingDirectory, '../src/data');

if (!fs.existsSync(destinationPath)) {
  fs.mkdirSync(destinationPath)
}

fs.readFile(__dirname + '/tm_routes.json', 'utf8', (err, data) => {
  const json = JSON.parse(data.toString());
  const routes = json.features;
  
  _.each(routes, (route) => {
    const { properties } = route;
    const routeNumber = properties.route_number;
    const routeDirection = properties.direction;
    const fileName = `${destinationPath}/${routeNumber}/${routeNumber}_${routeDirection}.json`;
    
    if (!fs.existsSync(`${destinationPath}/${routeNumber}`)) {
      fs.mkdirSync(`${destinationPath}/${routeNumber}`)
    }
    
    fs.writeFileSync(fileName, JSON.stringify(route));
  });
});
