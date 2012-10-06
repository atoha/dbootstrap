/*
    :copyright: Copyright 2012 Martin Pengelly-Phillips
    :license: See LICENSE.txt.
*/

define([
    'require'
],

function (require) {
    var app = {};

    require(['./Gallery', 'dojo/query', 'dojo/dom-construct',
             'dojo/dom-attr', 'dojo/domReady!'],
        function (Gallery, query, domConstruct, domAttr) {
            app = new Gallery();
            app.placeAt(document.body);
            app.startup();

            // Fix up img tags to work with font icons. Have to do this
            // as img does not support pseudo classes required by icon font.
            query('img.dijitIcon, ' +
                  'img.dijitTabStripIcon, ' +
                  'img.dijitCalendarIncrementControl, ' +
                  'img.dijitMenuExpand, ' +
                  'input.dijitArrowButtonInner'
            ).forEach(function(node) {
                var span = domConstruct.create('span', {
                    'class': domAttr.get(node, 'class')
                }, node, 'before');
            });

            // Call resize so new nodes taken into account.
            app.resize();
        }
    );
});

