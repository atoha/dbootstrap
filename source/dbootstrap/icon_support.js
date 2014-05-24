/*
    :copyright: Copyright 2012 Martin Pengelly-Phillips
    :license: See LICENSE.txt.
*/

define(
[
    'dojo/_base/kernel',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/dom-construct',
    'dojo/dom-class'
],

function(kernel, lang, array, domConstruct, domClass) {
    // Patch templated widgets to replace icon nodes that do no support pseudo
    // states with nodes that do. This enables Font-Awesome to be used
    // everywhere for the icons.
    //
    // To use, require this module *before* Dijit.
    //
    function replaceNodesForIconSupport(rootNode) {
        // Replace nodes that don't support :before with nodes that do.
        //
        var reference_tag_names = ['IMG', 'INPUT'];
        var reference_classes = [
            'dijitIcon', 'dijitTabStripIcon', 'dijitMenuExpand',
            'dijitCalendarIncrementControl', 'dijitArrowButtonInner',
            'dijitTreeExpando', 'dijitArrowNode'
        ];
        var reference_attributes = ['class', 'data-dojo-attach-point'];

        var nodes = rootNode;
        if (!lang.isArray(nodes)) {
            nodes = (rootNode.all || rootNode.getElementsByTagName("*"));
        }

        var x = lang.isArray(rootNode) ? 0 : -1;
        for (; x < 0 || nodes[x]; x++) {
            // Don't access nodes.length on IE, see #14346
            var node = (x == -1) ? rootNode : nodes[x];

            // Only deal with known problem node types.
            if (array.indexOf(reference_tag_names, node.tagName) === -1) {
                continue;
            }

            // If node contains one of the reference classes then replace
            // it with a suitable pseudo state friendly node, copying
            // relevant attributes to the new node.
            for (var i=0, l=reference_classes.length; i<l; i++) {
                if (domClass.contains(node, reference_classes[i])) {
                    var attributes = {};
                    array.forEach(reference_attributes, function(name) {
                        var attribute = node.getAttribute(name);
                        if (attribute) {
                            attributes[name] = attribute;
                        }
                    });

                    var newNode = domConstruct.create(
                        'span', attributes, node, 'replace'
                    );
                    break;
                }
            }
        }
    }

    function patchModule(module){
        var original = module.prototype._attachTemplateNodes;

        module.prototype._attachTemplateNodes = function(rootNode) {
            // Replace nodes.
            replaceNodesForIconSupport(rootNode);

            // Continue with normal parent method.
            return original.apply(this, arguments);
        };
    }

    return {
        load: function (resourceId, req, load) {

            var v = kernel.version;
            var deps = [ 'dijit/_TemplatedMixin' ];
            // Dijit 1.9 splits the required functionality out to another
            // mixin, but then does not always use the new mixin everywhere and
            // there is no way to detect whether or not the new mixin exists
            // without making a potentially-bad HTTP request, so we are stuck
            // checking the version
            if (v.minor >= 9) {
                deps.push('dijit/_AttachMixin');
            }

            req(deps, function(TemplatedMixin, AttachMixin) {
                patchModule(AttachMixin || TemplatedMixin);
                load(TemplatedMixin);
            });
        }
    }
});

