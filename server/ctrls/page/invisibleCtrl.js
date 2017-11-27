'use strict';

let request     = require('request'),
    speakeasy   = require('speakeasy'),
    // QRCode      = require('qrcode'),
    qr          = require('qr-image'),
    keys        = require('../../../_config/keys');

module.exports = server => {

    return [{
            method: 'GET',
            path: '/invisible',
            handler: (req, reply) => {
                reply.view('invisible', {
                    pubKey: keys.invisible.public,
                });
            },
        }, {
            method: 'POST',
            path: '/invisible',
            handler: (req, reply) => {
                let user = req.payload.user;

                let recaptcha = req.payload['g-recaptcha-response'];
                console.log(' - recaptcha:::', recaptcha);
                request.post('https://www.google.com/recaptcha/api/siteverify', {
                    form: {
                        response: recaptcha,
                        secret  : keys.invisible.secret,
                        // remoteip: req.info.remoteAddress,
                        // remoteip: null,
                    }
                }, (err, httpResponse, body) => {
                    if (err) throw err;
                    if (httpResponse.statusCode == 200) {
                        body = JSON.parse(body);
                    }
                    console.log(' - BODY:', body)
                    if (body.success) {
                        reply.view('invisible', {
                            user,
                        });
                    } else {
                        reply(body);
                    }
                });

            },
        },
    ];
};
