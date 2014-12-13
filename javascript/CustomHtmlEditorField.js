/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var ss = ss || {};

(function($) {

	$.entwine('ss', function($) {
        /**
         * Class: textarea.htmleditor
         * 
         * Add tinymce to HtmlEditorFields within the CMS. Works in combination
         * with a TinyMCE.init() call which is prepopulated with the used HTMLEditorConfig settings,
         * and included in the page as an inline <script> tag.
         */
        $('textarea.customconfightmleditor').entwine({

                Editor: null,

                /**
                 * Constructor: onmatch
                 */
                onadd: function() {
                        var edClass = this.data('editor') || 'default', ed = ss.editorWrappers[edClass]();
                        this.setEditor(ed);

                        // Using a global config (generated through HTMLEditorConfig PHP logic).
                        // Depending on browser cache load behaviour, entwine's DOMMaybeChanged
                        // can be called before the bottom-most inline script tag is executed,
                        // which defines the global. If that's the case, wait for the window load.
                        if(typeof ssTinyMceConfig != 'undefined') this.redraw();

                        this._super();
                },
                onremove: function() {
                        var ed = tinyMCE.get(this.attr('id'));
                        if (ed) {
                                ed.remove();
                                ed.destroy();

                                // TinyMCE leaves behind events. We should really fix TinyMCE, but lets brute force it for now
                                $.each(jQuery.cache, function(){
                                        var source = this.handle && this.handle.elem;
                                        if (!source) return;

                                        var parent = source;
                                        while (parent && parent.nodeType == 1) parent = parent.parentNode;

                                        if (!parent) $(source).unbind().remove();
                                });
                        }

                        this._super();
                },

                getContainingForm: function(){
                        return this.closest('form');
                },

                fromWindow: {
                        onload: function(){
                                this.redraw();
                        }
                },

                redraw: function() {
                        // Using a global config (generated through HTMLEditorConfig PHP logic)
                        // PRAI 20141119 - START
                        var configName = 'ssTinyMceConfig';
                        if(typeof this.attr('data-configname') !== 'undefined') {
                            configName = this.attr('data-configname');
                        }

                        var config = eval(configName), self = this, ed = this.getEditor();
                        // PRAI 20141119 - END

                        ed.init(config);

                        // Create editor instance and render it.
                        // Similar logic to adapter/jquery/jquery.tinymce.js, but doesn't rely on monkey-patching
                        // jQuery methods, and avoids replicate the script lazyloading which is already in place with jQuery.ondemand.
                        ed.create(this.attr('id'), config);

                        this._super();
                },

                /**
                 * Make sure the editor has flushed all it's buffers before the form is submitted.
                 */
                'from .cms-edit-form': {
                        onbeforesubmitform: function(e) {
                                this.getEditor().save();
                                this._super();
                        }
                },

                oneditorinit: function() {
                        // Delayed show because TinyMCE calls hide() via setTimeout on removing an element,
                        // which is called in quick succession with adding a new editor after ajax loading new markup

                        //storing the container object before setting timeout
                        var redrawObj = $(this.getEditor().getInstance().getContainer());
                        setTimeout(function() {
                                redrawObj.show();
                        }, 10);
                },

                'from .cms-container': {
                        onbeforestatechange: function(){
                                this.css('visibility', 'hidden');

                                var ed = this.getEditor(), container = (ed && ed.getInstance()) ? ed.getContainer() : null;
                                if(container && container.length) container.remove();
                        }
                },

                isChanged: function() {
                        var ed = this.getEditor();
                        return (ed && ed.getInstance() && ed.isDirty());
                },
                resetChanged: function() {
                        var ed = this.getEditor();
                        if(typeof tinyMCE == 'undefined') return;

                        // TODO Abstraction layer
                        var inst = tinyMCE.getInstanceById(this.attr('id'));
                        if (inst) inst.startContent = tinymce.trim(inst.getContent({format : 'raw', no_events : 1}));
                },
                openLinkDialog: function() {
                        this.openDialog('link');
                },
                openMediaDialog: function() {
                        this.openDialog('media');
                },
                openDialog: function(type) {
                        var capitalize = function(text) {
                                return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
                        };

                        var self = this, url = $('#cms-editor-dialogs').data('url' + capitalize(type) + 'form'),
                                dialog = $('.htmleditorfield-' + type + 'dialog');

                        if(dialog.length) {
                                dialog.getForm().setElement(this);
                                dialog.open();
                        } else {
                                // Show a placeholder for instant feedback. Will be replaced with actual
                                // form dialog once its loaded.
                                dialog = $('<div class="htmleditorfield-dialog htmleditorfield-' + type + 'dialog loading">');
                                $('body').append(dialog);
                                $.ajax({
                                        url: url,
                                        complete: function() {
                                                dialog.removeClass('loading');
                                        },
                                        success: function(html) {
                                                dialog.html(html);
                                                dialog.getForm().setElement(self);
                                                dialog.trigger('ssdialogopen');
                                        }
                                });
                        }
                }
        });
    });
})(jQuery);
