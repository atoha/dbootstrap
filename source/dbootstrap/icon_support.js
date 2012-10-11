/*
    :copyright: Copyright 2012 Martin Pengelly-Phillips
    :license: See LICENSE.txt.
*/

define(
[
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dijit/_TemplatedMixin'
],

function(declare, lang, array, domConstruct, domClass, TemplatedMixin) {
    // Patch templated widgets to replace icon nodes that do no support pseudo
    // states with nodes that do. This enables Font-Awesome to be used
    // everywhere for the icons.
    //
    // To use, require this module *before* Dijit.
    //
    var _attachTemplateNodes = TemplatedMixin.prototype._attachTemplateNodes;

    TemplatedMixin.prototype._attachTemplateNodes = function(rootNode,
                                                             getAttrFunc) {
        // Replace nodes with appropriate ones, before calling original
        // method.
        //
        var reference_tag_names = ['IMG', 'INPUT'];
        var reference_classes = [
            'dijitIcon', 'dijitTabStripIcon', 'dijitMenuExpand',
            'dijitCalendarIncrementControl', 'dijitArrowButtonInner',
            'dijitTreeExpando'
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
                        var attribute = getAttrFunc(node, name);
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

        // Continue with normal parent method.
        return _attachTemplateNodes.call(this, rootNode, getAttrFunc);
    }

    return TemplatedMixin;
});
