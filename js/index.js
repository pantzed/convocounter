'use strict';

/* eslint-env browser */
/* eslint-disable no-use-before-define */

(() => {
    document.addEventListener('DOMContentLoaded', initApp);

    function initApp() {
        const formElement = document.getElementById('participants');
        addPersonInputs(formElement);
    }

    function addPersonInputs(form) {
        const pname = 'pname';
        const el = appendElement(form, 'label', {
            for: pname
        });
        appendElement(el, 'input', {
            class: 'participant-name',
            type: 'text',
            name: pname,
            placeholder: 'Participant Name'
        });
    }

    /* Create a new element of type, set given attributes,
       append it to the parent element, and return the new element */

    function appendElement(parent, type, attributes) {
        const el = document.createElement(type);
        for (const att in attributes) { // eslint-disable-line no-restricted-syntax, guard-for-in
            el.setAttribute(att, attributes[att]);
        }
        parent.appendChild(el);
        return el;
    }
})();
