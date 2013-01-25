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

    layers: {
        'dojo/dojo': {
            include: [
                'dojo/dojo',
                'dojo/i18n',
                'dojo/domReady'
            ],
            boot: true,
            customBase: true
        },
        'dbootstrap/main': {
            include: [
                'dbootstrap/main',
                'xstyle/load-css'
            ],
        },
        'gallery/main': {
            include: [
                'gallery/main',
                'gallery/entry_point',
                'gallery/Gallery'
            ]
        }
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
