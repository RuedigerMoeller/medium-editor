/*global fireEvent */

describe('Textarea TestCase', function () {
    'use strict';

    describe('MediumEditor constructor', function () {
        beforeEach(function () {
            setupTestHelpers.call(this);
            this.el = this.createElement('textarea', 'editor');
            this.el.value = 'test content';
            this.el.setAttribute('data-disable-toolbar', false);
            this.el.setAttribute('data-placeholder', 'Something');
            this.el.setAttribute('data-disable-return', false);
            this.el.setAttribute('data-disable-double-return', false);
            this.el.setAttribute('data-disable-preview', false);
            this.el.setAttribute('spellcheck', true);
            this.el.setAttribute('data-imhere', 'ohyeah');
        });

        afterEach(function () {
            this.cleanupTest();
        });

        it('should accept a textarea element and "convert" it to a div, preserving all attributes', function () {
            var editor = this.newMediumEditor('.editor'),
                textarea = this.el;
            expect(editor.elements[0].nodeName.toLowerCase()).toBe('div');

            var attributes = [
                'data-disable-editing',
                'data-disable-toolbar',
                'data-placeholder',
                'data-disable-return',
                'data-disable-double-return',
                'data-disable-preview',
                'spellcheck',
                'data-imhere'
            ];
            attributes.forEach(function (attr) {
                expect(editor.elements[0].getAttribute(attr)).toBe(textarea.getAttribute(attr));
            });
        });

        it('should sync editor changes with the original textarea element', function () {
            var editor = this.newMediumEditor('.editor');
            expect(this.el.value).toEqual('test content');
            editor.elements[0].innerHTML = 'new content';
            fireEvent(editor.elements[0], 'input');
            fireEvent(editor.elements[0], 'keypress');
            jasmine.clock().tick(1);
            expect(this.el.value).toEqual('new content');
        });

        it('should preserve textarea className', function () {
            this.el.className += ' test-class test-class-2';
            var editor = this.newMediumEditor('.editor');
            expect(editor.elements[0].className).toBe('editor test-class test-class-2');
        });

        it('should create unique div ids for multiple textareas', function () {
            for (var i = 0; i < 12; i++) {
                var ta = this.createElement('textarea', 'editor');
                ta.value = 'test content';
            }
            var editor = this.newMediumEditor('.editor');
            editor.elements.forEach(function (el) {
                expect(document.querySelectorAll('div#' + el.id).length).toEqual(1);
            });
        });

        it('should create unique medium-editor-textarea-ids across all editor instances', function () {
            var tas = [];
            for (var i = 0; i < 12; i++) {
                var ta = this.createElement('textarea', 'editor');
                ta.value = 'test content';
                tas.push(ta);
            }
            tas.forEach(function (el) {
                this.newMediumEditor(el);
            }, this);
            this.editors.forEach(function (editor) {
                expect(document.querySelectorAll('textarea[medium-editor-textarea-id="' +
                    editor.elements[0].getAttribute('medium-editor-textarea-id') + '"]').length).toEqual(1);
            });
        });

        it('should cleanup after destroy', function () {
            var editor = this.newMediumEditor('.editor');
            expect(this.el.classList.contains('medium-editor-hidden')).toBe(true);
            editor.destroy();
            expect(this.el.classList.contains('medium-editor-hidden')).toBe(false);
        });
    });

    describe('Dynamically adding textarea elements to the editor', function () {
        beforeEach(function () {
            setupTestHelpers.call(this);
            this.div = this.createElement('div', 'editable-div', 'sample div');
            this.el = this.createElement('textarea', 'editor');
            this.el.value = 'test content';
            this.el.setAttribute('data-disable-toolbar', false);
            this.el.setAttribute('data-placeholder', 'Something');
            this.el.setAttribute('data-disable-return', false);
            this.el.setAttribute('data-disable-double-return', false);
            this.el.setAttribute('data-disable-preview', false);
            this.el.setAttribute('spellcheck', true);
            this.el.setAttribute('data-imhere', 'ohyeah');
        });

        afterEach(function () {
            this.cleanupTest();
        });

        it('should "convert" it to a div, preserving all attributes', function () {
            var editor = this.newMediumEditor('.editable-div'),
                textarea = this.el;
            expect(editor.elements[0]).toBe(this.div);
            expect(editor.elements.length).toBe(1);

            editor.addElements(this.el);
            expect(editor.elements.length).toBe(2);

            var attributes = [
                    'data-disable-editing',
                    'data-disable-toolbar',
                    'data-placeholder',
                    'data-disable-return',
                    'data-disable-double-return',
                    'data-disable-preview',
                    'spellcheck',
                    'data-imhere'
                ],
                tempDiv = editor.elements[1];

            attributes.forEach(function (attr) {
                expect(tempDiv.getAttribute(attr)).toBe(textarea.getAttribute(attr));
            });
        });

        it('should sync editor changes with the original textarea element', function () {
            var editor = this.newMediumEditor('.editable-div');
            editor.addElements(this.el);

            expect(this.el.value).toEqual('test content');
            expect(editor.elements[1].innerHTML).toEqual('test content');

            editor.elements[1].innerHTML = 'new content';
            fireEvent(editor.elements[1], 'input');
            fireEvent(editor.elements[1], 'keypress');
            jasmine.clock().tick(1);
            expect(this.el.value).toEqual('new content');
        });

        it('should preserve textarea className', function () {
            this.el.className += ' test-class test-class-2';
            var editor = this.newMediumEditor('.editable-div');
            editor.addElements(this.el);
            expect(editor.elements[1].className).toBe('editor test-class test-class-2');
        });

        it('should create unique div ids for multiple textareas', function () {
            this.div.setAttribute('id', 'medium-editor-12345');
            for (var i = 0; i < 12; i++) {
                var ta = this.createElement('textarea', 'editor');
                ta.value = 'test content';
            }
            var editor = this.newMediumEditor('.editable-div');
            expect(editor.elements.length).toBe(1);

            editor.addElements(document.querySelectorAll('.editor'));
            expect(editor.elements.length).toBe(14);

            editor.elements.forEach(function (el) {
                expect(document.querySelectorAll('div#' + el.id).length).toEqual(1);
            });
        });

        it('should create unique medium-editor-textarea-ids across all editor instances', function () {
            var tas = [];
            for (var i = 0; i < 12; i++) {
                var ta = this.createElement('textarea', 'editor');
                ta.value = 'test content';
                tas.push(ta);

                var div = this.createElement('div', 'editable-div');
                div.innerHTML = 'test div';
                this.newMediumEditor(div);
            }

            tas.forEach(function (el, idx) {
                this.editors[idx].addElements(el);
            }, this);
            this.editors.forEach(function (editor) {
                expect(document.querySelectorAll('textarea[medium-editor-textarea-id="' +
                    editor.elements[1].getAttribute('medium-editor-textarea-id') + '"]').length).toEqual(1);
            });
        });

        it('should cleanup after destroy', function () {
            var editor = this.newMediumEditor('.editable-div');
            expect(this.el.classList.contains('medium-editor-hidden')).toBe(false);
            editor.addElements(this.el);
            expect(this.el.classList.contains('medium-editor-hidden')).toBe(true);
            editor.destroy();
            expect(this.el.classList.contains('medium-editor-hidden')).toBe(false);
        });
    });
});
