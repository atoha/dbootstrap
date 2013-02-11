/*
    :copyright: Copyright 2012 Martin Pengelly-Phillips
    :license: See LICENSE.txt.
*/

define([
    'require'
],

function (require) {
    var app = {};

    require(['dbootstrap', './Gallery', 'dojo/domReady!'],
        function (dbootstrap, Gallery) {
            app = new Gallery();
            app.placeAt(document.body);
            app.startup();
        }
    );
});

