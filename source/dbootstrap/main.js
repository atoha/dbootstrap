/*
    :copyright: Copyright 2012 Martin Pengelly-Phillips
    :license: See LICENSE.txt.
*/

define([
    'require'
],

function (require) {
    var app = {};

    require(['./Gallery', 'dojo/domReady!'],
        function (Gallery) {
            app = new Gallery();
            app.placeAt(document.body);
            app.startup();
        }
    );
});

