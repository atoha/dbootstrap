/*
    :copyright: Copyright 2012 Martin Pengelly-Phillips
    :license: See LICENSE.txt.
*/

define(
[
    'dojo/_base/declare',
    'dgrid/OnDemandGrid',
    'dgrid/extensions/DijitRegistry'
],

function(declare, Grid, DijitRegistry) {

    return declare('dbootstrap.Grid', [Grid, DijitRegistry], {
    })
});
