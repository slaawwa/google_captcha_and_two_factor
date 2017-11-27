'use strict';

let request     = require('request'),
    speakeasy   = require('speakeasy'),
    // QRCode      = require('qrcode'),
    qr          = require('qr-image'),
    keys        = require('../../../_config/keys');

module.exports = server => {

    return [{
            method: 'GET',
            path: '/two-factor',
            handler: (req, reply) => {
                let secret = {}, svg_string;
                if (server.db.user.ascii) {
                    secret.base32 = server.db.user.ascii;
                } else {
                    secret = speakeasy.generateSecret();
                    let url = speakeasy.otpauthURL({
                        secret: secret.ascii,
                        label: 'User test Two-factor',
                        algorithm: 'sha512',
                    });
                    svg_string = qr.imageSync(/*secret.otpauth_*/url, {
                        type: 'svg',
                        // ec_level: 'L',
                    });
                }
                reply.view('two-factor', {
                    secret: secret,
                    qrcode: svg_string,
                });
            },
        }, {
            method: 'POST',
            path: '/two-factor',
            handler: (req, reply) => {
                var verified = speakeasy.totp.verify({
                    secret: req.payload.base32secret,
                    encoding: 'base32',
                    token: req.payload.userToken,
                });
                if (verified) {
                    server.db.user.ascii = req.payload.base32secret;
                    reply.view('two-factor', {
                        user: req.payload.user,
                    });
                } else {
                    reply({
                        verified,
                        send: req.payload,
                    });
                }
            },
        }
    ];
};
