'use strict';

/* eslint-env browser */
/* eslint-disable no-use-before-define */

(() => {
    document.ConvoCounter = {};

    document.addEventListener('DOMContentLoaded', initApp);
    document.getElementById('startButton').addEventListener('click', startTimer);

    function initApp() {
        document.ConvoCounter.participantCount = 1;
        const formElement = document.getElementById('participants');
        addPersonInputs(formElement);
        addPersonInputs(formElement);
        addPersonInputs(formElement);
        addPersonInputs(formElement);
    }

    function addPersonInputs(form) {
        const pname = `pname${document.ConvoCounter.participantCount++}`;
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

    function startTimer(event) { // eslint-disable-line no-unused-vars
        event.preventDefault();
        document.getElementById('participant-inputs').style.display = 'none';
        const inputs = [...document.querySelectorAll('input')].map(e => e.value);
        console.log(inputs);
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
