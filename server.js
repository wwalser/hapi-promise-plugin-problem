"use strict";
const Hapi = require("hapi");
const Boom = require('boom');

var server = new Hapi.Server();
server.connection({ port: process.env.PORT || 3000 });
  
//Troublesome plugin
const troublesomePlugin = (server, options, next) => {
  server.ext('onPreHandler', (request, reply) => {
    try {
      //Do something that benefits from a try catch. JSON parsing for example.
      reply.continue();
    } catch (err) {
      //Again, manually handling problem doesn't help.
      reply(Boom.badImplementation("Explicit handling doesn't fix the issue.", err));
    }
  });
  next();
};

troublesomePlugin.attributes = {
  name: 'trouble'
};


server.register([
  troublesomePlugin,
], function() {
  server.route({
    method: 'GET',
    path: '/works',
    handler: (request, reply) => {
      reply("This route works fine.");
    }
  });

  server.route({
    method: 'GET',
    path: '/trouble',
    handler: (request, reply) => {
      //throw exception which should return internal server error.
      const thing = foo.bar.baz.qux;
      reply("This route works fine.");
    }
  });
  
  server.start(function (err) {
    if (err) {
      console.error('Server failed to start:', err);
    } else {
      console.log('Server running at:', server.info.uri);
    }
  });
});
