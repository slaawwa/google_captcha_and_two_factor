'use strict';

module.exports = {
    method: 'GET',
    path: '/api',
    handler: (req, reply) => {
        reply({success: 'data'});
    },
};
