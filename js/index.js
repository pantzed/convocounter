'use strict';

/* eslint-env browser */
/* eslint-disable no-use-before-define */

(() => {
    const MAX_PARTICIPANTS = 4;
    const MIN_PARTICIPANTS = 2;
    let participantCount = 0;

    document.addEventListener('DOMContentLoaded', initApp);

    function initApp() {
        participantCount = 0;
        id('startButton').addEventListener('click', startTimer);
        hideId('startButton');
        hideId('participant-buttons');
        addPersonInput();
    }

    /* Handle inputting participant names */

    function addPersonInput() {
        if (participantCount < MAX_PARTICIPANTS) {
            ++participantCount;
            const formElement = document.getElementById('participants');
            const pname = `pname${participantCount}`;
            const el = appendElement(formElement, 'label', {
                for: pname,
            });
            el.textContent = `Participant ${participantCount}: `;
            const input = appendElement(el, 'input', {
                class: 'participant-name',
                type: 'text',
                name: pname,
                placeholder: 'Participant Name',
            });
            input.addEventListener('blur', participantInputted);
            input.addEventListener('keypress', inputKey);
            input.focus();
        }
    }

    function participantInputted(event) {
        if (event.target.value !== '') {
            event.target.removeEventListener('blur', participantInputted);
            event.target.removeEventListener('keypress', inputKey);
            showId('startButton');
            addPersonInput();
        }
    }

    function inputKey(event) {
        if (event.keyCode === 13) { // eslint-disable-line no-magic-numbers
            event.preventDefault();
            participantInputted(event);
        }
        return false;
    }

    /* Participant inputs have been filled, Start button pressed */

    function startTimer(event) { // eslint-disable-line no-unused-vars
        event.preventDefault();
        const pCount = participantCount;
        if (pCount >= MIN_PARTICIPANTS && pCount <= MAX_PARTICIPANTS) {
            hideId('participant-inputs');
            showId('participant-buttons');
            const inputs = [...document.querySelectorAll('input')]
                .map(e => e.value)
                .filter(e => e !== '');

            const list = appendElement(id('participant-buttons'), 'ul');
            inputs.forEach((e) => {
                const li = appendElement(list, 'li');
                li.textContent = e;
            });
        }
    }

    /* DOM helper functions */

    function id(elementId) {
        return document.getElementById(elementId);
    }

    function hideId(elementId) {
        id(elementId).style.display = 'none';
    }

    function showId(elementId) {
        id(elementId).style.display = '';
    }

    /* Create a new element of type, set given attributes,
       append it to the parent element, and return the new element */

    function appendElement(parent, type, attributes) {
        const el = document.createElement(type);
        for (const att in attributes) { // eslint-disable-line
            el.setAttribute(att, attributes[att]);
        }
        parent.appendChild(el);
        return el;
    }
})();
