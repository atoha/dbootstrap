/*
    :copyright: Copyright 2012 Martin Pengelly-Phillips
    :license: See LICENSE.txt.
*/

var profile = {
    resourceTags: {
        test: function (filename, mid) {
            return false;
        },

        copyOnly: function (filename, mid) {
            return false;
        },

        amd: function (filename, mid) {
            return !this.copyOnly(filename, mid) && /\.js$/.test(filename);
        },

        miniExclude: function (filename, mid) {
            return mid in {
                'dbootstrap/package': 1
            };
        }
    }
};
