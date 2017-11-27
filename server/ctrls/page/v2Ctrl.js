'use strict';

let request     = require('request'),
    speakeasy   = require('speakeasy'),
    // QRCode      = require('qrcode'),
    qr          = require('qr-image'),
    keys        = require('../../../_config/keys');

module.exports = server => {

    return [
        {
            method: 'GET',
            path: '/v2',
            handler: (req, reply) => {
                reply.view('v2', {
                    pubKey: keys.v2.public,
                });
            },
        }, {
            method: 'POST',
            path: '/v2',
            handler: (req, reply) => {
                // return reply({ip: req.info.remoteAddress});
                if (req.payload.user) {
                    console.log('req.payload:', req.payload);
                    let user = req.payload.user;

                    let recaptcha = req.payload['g-recaptcha-response'];
                    request.post('https://www.google.com/recaptcha/api/siteverify', {
                        form: {
                            response: recaptcha,
                            secret  : keys.v2.secret,
                            // remoteip: req.info.remoteAddress,
                            // remoteip: null,
                        }
                    }, (err, httpResponse, body) => {
                        if (err) throw err;
                        if (httpResponse.statusCode == 200) {
                            body = JSON.parse(body);
                        }
                        if (body.success) {
                            reply.view('v2', {
                                user,
                            });
                        } else {
                            reply(body);
                        }
                    });
                } else {
                    reply('USER IS EMPTY').code(400);
                    throw 'USER IS EMPTY';
                }
            },
        }
    ];
};
