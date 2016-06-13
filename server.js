"use strict";
const Hapi = require("hapi");
const Q = require('q');
const Boom = require('boom');

var server = new Hapi.Server();
server.connection({ port: process.env.PORT || 3000 });
  
//Troublesome plugin
const troublesomePlugin = (server, options, next) => {
  server.ext('onPreHandler', (request, reply) => {
    Q.delay(100)
      .then(() => reply.continue())
      .catch(err => {
        console.log("Yeah, we've got Trouble!", err);
        //Because we've already called reply.continue, this doesn't work.
        // Hapi code base ./lib/reply.js L74
        reply(Boom.badImplementation("Explicit handling doesn't fix the issue.", err));
      });
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
