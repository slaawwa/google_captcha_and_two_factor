'use strict';

module.exports = function(server) {

    var ctrls = [];

    require('glob').sync('**/!(_)*{Ctrl,Ctrl.js}', {cwd: './server/ctrls/'})
        .forEach( function( file ) {
            let module = require( `./ctrls/${file}` );
            module = typeof module === 'function'? module(server): module;
            console.log(` - route::`, `'/server/ctrls/${file}' :isArray:${Array.isArray(module)}`);
            if (Array.isArray(module)) {
                ctrls = ctrls.concat(module);
            } else {
                ctrls.push(module);
            }
        });

    server.route(ctrls);

    return ctrls;
};
