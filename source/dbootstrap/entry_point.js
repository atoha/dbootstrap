/*
    :copyright: Copyright 2012 Martin Pengelly-Phillips
    :license: See LICENSE.txt.
*/

require({
    baseUrl: '',

    packages: [
        'dojo',
        'dijit',
        'dojox',
        'dgrid',
        'put-selector',
        'xstyle',
        'dbootstrap'
    ],

    paths: {
        'dijit/_TemplatedMixin': 'dbootstrap/TemplatedMixin',
        'dijit/_OriginalTemplatedMixin': 'dijit/_TemplatedMixin'
    },

    cache: {}

}, ['dbootstrap']);
