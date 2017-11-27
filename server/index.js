'use strict';

var Hapi    = require('hapi'),
    Inert   = require('inert'),
    pug     = require('pug'),
    vision  = require('vision');

const server = new Hapi.Server();

server.connection({
    port: 8000,
    host: '0.0.0.0',
    // host: '192.168.0.102',
    // host: 'localhost',
});

server.register([Inert, vision], err => {

    server.db = {
        user: {
            auth: false,
        },
    }

    server.views({
        engines: {
            pug,
            // html: app.rmod.handlebars,
        },
        context: {
            year: new Date().getFullYear(),
            menu: require('./_menu'),
        },
        defaultExtension: 'pug',
        relativeTo: __dirname + '/../frontend/views/',
        path: 'pages',
        compileOptions: {
            pretty: false
        },
        isCached: false,
        // compileMode: 'async',
    });

    require('./routes')(server);

    server.ext('onPreResponse', (req, h) => {

        console.info(` - ${req.path}`);

        if (req.path && req.path.indexOf('/api') == 0 && req.response.header) {
            req.response.header('Access-Control-Allow-Origin', '*');
            h();
        }
        if (req.response.isBoom) {
            throw req.response;
        }

        return h.continue();
    });

    server.start((err) => {
        if (err) {
            throw err;
        }

        console.log(`Server running at: ${server.info.uri}`);
    });
});
