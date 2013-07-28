/*
    :copyright: Copyright 2012 Martin Pengelly-Phillips
    :license: See LICENSE.txt.
*/

define(
[
    'dojo/_base/declare',
    'dgrid/OnDemandGrid',
    'dgrid/extensions/DijitRegistry',
    'dgrid/Selection',
    'dgrid/Keyboard'
],

function(declare, Grid, DijitRegistry, Selection, Keyboard) {

    return declare('dbootstrap.Grid', [Grid, DijitRegistry, Selection,
                                       Keyboard], {
    })
});
