/*
    :copyright: Copyright 2012 Martin Pengelly-Phillips
    :license: See LICENSE.txt.
*/

define([
    'require'
],

function (require) {
    var app = {};

    require(['./icon_support', './Gallery', 'dojo/domReady!'],
        function (icon_support, Gallery) {
            app = new Gallery();
            app.placeAt(document.body);
            app.startup();
        }
    );
});

