'use strict';

/* eslint-env browser */
/* eslint-disable no-use-before-define */

(() => {
    document.ConvoCounter = {};

    document.addEventListener('DOMContentLoaded', initApp);

    function initApp() {
        document.ConvoCounter.participantCount = 1;
        document.getElementById('startButton').addEventListener('click', startTimer);
        document.getElementById('startButton').style.display = 'none';
        document.getElementById('participant-buttons').style.display = 'none';
        addPersonInput();
    }

    function addPersonInput() {
        const formElement = document.getElementById('participants');
        const count = document.ConvoCounter.participantCount++;
        const pname = `pname${count}`;
        const el = appendElement(formElement, 'label', {
            for: pname,
        });
        el.textContent = `Participant ${count}: `;
        const input = appendElement(el, 'input', {
            class: 'participant-name',
            type: 'text',
            name: pname,
            placeholder: 'Participant Name',
        });
        // input.addEventListener('blur', inputBlur);
        input.addEventListener('keypress', inputKey);
        input.focus();
    }

    function inputBlur(event) {
        if (event.target.value !== '') {
            event.target.removeEventListener('blur', inputBlur);
            event.target.removeEventListener('keypress', inputKey);
            document.getElementById('startButton').style.display = '';
            addPersonInput();
        }
    }

    function inputKey(event) {
        if (event.keyCode === 13) { // eslint-disable-line no-magic-numbers
            event.preventDefault();
            inputBlur(event);
        }
        return false;
    }

    /* Participant inputs have been filled, Start button pressed */

    function startTimer(event) { // eslint-disable-line no-unused-vars
        event.preventDefault();
        if (document.ConvoCounter.participantCount >= 2) { // eslint-disable-line no-magic-numbers
            document.getElementById('participant-inputs').style.display = 'none';
            document.getElementById('participant-buttons').style.display = '';
            const inputs = [...document.querySelectorAll('input')].map(e => e.value);

            const list = appendElement(document.getElementById('participant-buttons'), 'ul');
            inputs.forEach((e) => {
                const li = appendElement(list, 'li');
                li.textContent = e;
            });
        }
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
