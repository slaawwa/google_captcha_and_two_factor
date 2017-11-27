'use strict';

let request     = require('request'),
    speakeasy   = require('speakeasy'),
    // QRCode      = require('qrcode'),
    qr          = require('qr-image'),
    keys        = require('../../../_config/keys');

module.exports = server => {

    return {
        method: 'GET',
        path: '/',
        handler: (req, reply) => {
            reply.view('index', {
                user: server.db.user,
            });
        },
    };
};
