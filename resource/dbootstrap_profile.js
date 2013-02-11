/*
    :copyright: Copyright 2012 Martin Pengelly-Phillips
    :license: See LICENSE.txt.
*/

var profile = {
    basePath: '../source/',
    action: 'release',
    cssOptimize: 'comments',
    mini: true,
    optimize: 'closure',
    layerOptimize: 'closure',
    stripConsole: 'all',
    selectorEngine: 'acme',

    packages: [
        'dojo',
        'dijit',
        'xstyle',
        'dbootstrap',
    ],

    layers: {
        'dbootstrap/main': {
            include: [
                'dbootstrap/main',
                'xstyle/load-css'
            ],
        },
    },

    staticHasFeatures: {
        'dojo-trace-api': 0,
        'dojo-log-api': 0,
        'dojo-publish-privates': 0,
        'dojo-sync-loader': 0,
        'dojo-xhr-factory': 0,
        'dojo-test-sniff': 0
    }
};
