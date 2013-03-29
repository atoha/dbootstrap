/*
    :copyright: Copyright 2012 Martin Pengelly-Phillips
    :license: See LICENSE.txt.
*/

define(
[
    'dojo/_base/declare',
    'dojo/json',

    'dojo/text!./template/Gallery.html',
    'dojo/text!./data/state.json',
    'dojo/text!./data/countries.json',
    
    'dojo/query',
    'dojo/_base/window',
    'dojo/_base/array',
    'dojox/lang/functional',
    'dojo/dom-construct',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/layout/BorderContainer',

    'dojo/store/Observable',
    'dojo/store/Memory',
    'dojo/data/ItemFileReadStore',
    'dijit/tree/ForestStoreModel',
    
    // For template
    'dojo/dnd/Source',
    'dijit/MenuBar',
    'dijit/PopupMenuBarItem',
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/MenuSeparator',
    'dijit/PopupMenuItem',
    'dijit/CheckedMenuItem',
    'dijit/layout/AccordionContainer',
    'dijit/layout/ContentPane',
    'dijit/Tooltip',
    'dijit/form/DropDownButton',
    'dijit/TooltipDialog',
    'dijit/form/TextBox',
    'dijit/form/Button',
    'dijit/Tree',
    'dijit/Calendar',
    'dijit/ColorPalette',
    'dijit/layout/TabContainer',
    'dijit/form/ComboButton',
    'dijit/form/ToggleButton',
    'dijit/form/CheckBox',
    'dijit/form/RadioButton',
    'dijit/form/DateTextBox',
    'dijit/form/TimeTextBox',
    'dijit/form/CurrencyTextBox',
    'dijit/form/NumberSpinner',
    'dijit/form/Select',
    'dijit/form/FilteringSelect',
    'dijit/form/Textarea',
    'dijit/form/SimpleTextarea',
    'dijit/Editor',
    'dijit/form/VerticalSlider',
    'dijit/form/VerticalRuleLabels',
    'dijit/form/VerticalRule',
    'dijit/form/HorizontalSlider',
    'dijit/form/HorizontalRuleLabels',
    'dijit/form/HorizontalRule',
    'dijit/TitlePane',
    'dijit/ProgressBar',
    'dijit/InlineEditBox',
    'dijit/layout/LinkPane',
    'dijit/Dialog'
],

function(declare, json, template, stateData, countriesData,
         query, window, array, functional, domConstruct,
         TemplatedMixin, WidgetsInTemplateMixin,
         BorderContainer, Observable, Memory, ItemFileReadStore, ForestStoreModel) {

    return declare('dbootstrap.Gallery', [BorderContainer,
                                          TemplatedMixin,
                                          WidgetsInTemplateMixin], {

        templateString: template,
        'class': 'application',
        design: 'headline',
        liveSplitters: false,

        constructor: function(options) {
            declare.safeMixin(this, options);

            this.stateStore = Memory({
                data: json.parse(stateData)
            });

            // Create a new store for the child countries data
            this.countriesStore = ItemFileReadStore({
                data: json.parse(countriesData)
            });
            
            //this.countriesStore = new Observable(this.countriesStore);
            this.countriesModel = new ForestStoreModel({
                store: this.countriesStore,
                query:{type: 'continent'},
                rootId:'Geography', 
                rootLabel:'Geography'
            });
            
        },

        buildRendering: function() {
            this.inherited(arguments);
            this.buildIcons();
        },

        postCreate: function() {
            this.inherited(arguments);
        },

        startup: function() {
            this.inherited(arguments);
        },

        buildIcons: function() {
            // Build icons from available icon classes and add to
            // iconsContainer

            // Get icon classes
            var iconClasses = {};
            array.forEach(window.doc.styleSheets, function(sheet) {
                array.forEach(sheet.cssRules, function(rule) {
                    if (rule.type == rule.STYLE_RULE) {
                        var iconClass = rule.selectorText.match(/icon-[a-z\-]+/g);
                        if (iconClass &&
                            iconClass.lastIndexOf('icon-large', 0) !== 0 &&
                            iconClass.lastIndexOf('icon-spin', 0) !== 0 &&
                            iconClass.lastIndexOf('icon-border', 0) !== 0 &&
                            iconClass.lastIndexOf('icon-muted', 0) !== 0)
                        {
                            iconClasses[iconClass] = true;
                        }
                    }
                });
            });

            iconClasses = functional.keys(iconClasses).sort();

            // Add icons
            array.forEach(iconClasses, function(iconClass) {
                domConstruct.create(
                    'span',
                    {
                        'innerHTML': '<i class="' + iconClass + '"></i>'
                                     + iconClass
                    },
                    this.iconsContainer
                );
            }, this);

        },

        setTextPadding: function() {

        },

        logStrayGlobals: function() {

        },

        logWidgets: function() {

        },

        tearDown: function() {

        },

        showDialog: function() {
            var dlg = dijit.byId('dialog1');
            dlg.show();
            // avoid (trying to) restore focus to a closed menu, go to MenuBar instead
            dlg._savedFocus = dojo.byId("header");
        },

        showDialogAb: function() {
            var dlg = dijit.byId('dialogAB');
            dlg.show();
            // avoid (trying to) restore focus to a closed menu, go to MenuBar instead
            dlg._savedFocus = dojo.byId("header");
        },

        setBackground: function(color) {
            query('.dijitAccordionBody').style('background', color);
            query('.dijitTabPaneWrapper').style('background', color);
        }

    })
});
