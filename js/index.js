'use strict';

/* eslint-env browser */
/* eslint-disable no-use-before-define */

(() => {
    const MAX_PARTICIPANTS = 4;
    const MIN_PARTICIPANTS = 2;
    const INPUT_DIV = 'participant-inputs';
    const TIMER_DIV = 'participant-timer';
    const BUTTONS_DIV = 'participant-buttons';
    let participantCount = 0;
    let timers = [];

    document.addEventListener('DOMContentLoaded', initApp);

    function initApp() {
        inputState();
        id('startButton').addEventListener('click', timerState);
        id('restartLink').addEventListener('click', inputState);
    }

    function inputState() {
        participantCount = 0;
        clearInputs();
        hideId(TIMER_DIV);
        showId(INPUT_DIV);
        hideId('startButton');
        addParticipantInput();
    }

    /* Handle inputting participant names */

    function clearInputs() {
        const formElement = id('participants');
        while (formElement.firstChild) {
            formElement.removeChild(formElement.firstChild);
        }
    }

    function addParticipantInput() {
        if (participantCount < MAX_PARTICIPANTS) {
            ++participantCount;
            const formElement = id('participants');
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
            addParticipantInput();
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

    function timerState(event) { // eslint-disable-line no-unused-vars
        event.preventDefault();
        timers = [];
        const inputs = [...document.querySelectorAll('input')]
            .map(e => e.value)
            .filter(e => e !== '');
        const pCount = inputs.length;

        if (pCount >= MIN_PARTICIPANTS && pCount <= MAX_PARTICIPANTS) {
            hideId(INPUT_DIV);
            showId(TIMER_DIV);

            inputs.forEach((e) => {
                addTimer(e);
            });
        }
    }

    function addTimer(element) {
        const container = appendElement(id(BUTTONS_DIV), 'section', {
            class: 'timerButtonContainer'
        });
        const button = appendElement(container, 'button');
        const buttonNum = id(BUTTONS_DIV).children.length;
        button.textContent = `${buttonNum}: ${element}`;
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
