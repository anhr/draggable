/**
 * JavaScript source code
 * Draggable elements
 * Author: Andrej Hristoliubov
 * email: anhr@mail.ru
 * About me: http://anhr.ucoz.net/AboutMe/
 * Source: https://github.com/anhr/draggable
 * Example: http://anhr.ucoz.net/draggable/
 * Thanks to: https://www.html5rocks.com/ru/tutorials/dnd/basics/
 * Licences: GPL, The MIT License (MIT)
 * Copyright: (c) 2015 Andrej Hristoliubov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * Revision:
 *  2017-11-19, : 
 *       + init.
 *
 */

var draggable = {
    dragSrcEl: null,
    separator: 'separator',
    create: function (options) {
        if (options == undefined)
            options = {};
        var selectors = options.className ? '.' + options.className : '[draggable]';
        document.querySelectorAll(selectors).forEach(function (el) {
            el.draggable = true;
            el.title = options.line ? lang.draggableTitleLeftRight//To move element left or right
                : lang.draggableTitleUpDown;//To move element up or down
            el.style.cursor = options.line ? 'ew-resize' : 'ns-resize';
            el.innerHTML = '░';
            el.addEventListener('dragstart', function (e) {
                consoleLog('handleDragStart');
                this.nextElementSibling.style.opacity = '0.4';

                dragSrcEl = this;

                e.dataTransfer.effectAllowed = 'move';

                //for Firefox https://stackoverflow.com/questions/13920345/html-drag-event-does-not-fire-in-firefox
                e.dataTransfer.setData('Text', this.id);
            }, false);
            el.addEventListener('dragend', function (e) {
                consoleLog('handleDragEnd');
                this.nextElementSibling.style.opacity = '1';
                draggable.removeSeparator();
            }, false);
            el.addEventListener('dragenter', function (e) {
                consoleLog('handleDragEnter');
            }, false);
            el.addEventListener('dragover', function (e) {
                consoleLog('handleDragOver');
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

                draggable.removeSeparator();
                var tagName = options.line ? 'span' : 'hr',
                    elSeparator = document.createElement(tagName);
                elSeparator.className = draggable.separator;
                elSeparator.innerHTML = options.line ? '|' : '';
                this.parentElement.parentElement.insertBefore(elSeparator, this.parentElement.nextElementSibling);

                return false;
            }, false);
            el.addEventListener('dragleave', function (e) {
                consoleLog('handleDragLeave');
                draggable.removeSeparator();
            }, false);
            el.addEventListener('drop', function (e) {
                consoleLog('handleDrop');
                if (e.stopPropagation) {
                    e.stopPropagation(); // Stops some browsers from redirecting.
                }

                dragSrcEl.nextElementSibling.style.opacity = '1';
                // Don't do anything if dropping the same we're dragging.
                if (dragSrcEl != this) this.parentElement.parentElement.insertBefore(dragSrcEl.parentElement, this.parentElement.nextElementSibling);
                return false;
            }, false);
        });
    },
    removeSeparator: function () {
        document.querySelectorAll('.' + draggable.separator).forEach(function (elSeparator) {
            elSeparator.parentElement.removeChild(elSeparator);
        });
    }
}