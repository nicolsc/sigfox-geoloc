'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const Good = require('good');
const NodeGeocoder = require('node-geocoder');
const geocoder = NodeGeocoder({
  provider:'openstreetmap'
});


const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });
const postGeoloc = (request, reply) => {
  reply('❤️');
  console.log("Device %s\tlocated at\t%s°\t%s°", request.payload.device, request.payload.lat, request.payload.lng)
  geocoder.reverse({lat:request.payload.lat, lon:request.payload.lng})
  .then(function(response) {
    if (response && response.length){
      console.log(response[0]);
    }
    else{
      console.warn("No geocoding response");
    }

  })
  .catch(function(err) {

    console.log(err);
  });

}
const geolocConfig = {
  handler: postGeoloc,
  validate: {
      payload: {
        device: Joi.string().hex().required(),
        time: Joi.number().required(),
        lat: Joi.number().required(),
        lng: Joi.number().required()
      }
  }
};

server.route({
    method: 'POST',
    path: '/',
    config: geolocConfig
});

server.register({
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}, (err) => {

    if (err) {
        throw err; // something bad happened loading the plugin
    }



    server.start((err) => {

        if (err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
