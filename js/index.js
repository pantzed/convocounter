'use strict';

/* eslint-env browser */
/* eslint-disable no-use-before-define */

(() => {
    const MAX_PARTICIPANTS = 4;
    const MIN_PARTICIPANTS = 2;
    const TICK_TIME = 200;
    const ZERO_CODE = 48;
    const INPUT_DIV = 'participant-inputs';
    const TIMER_DIV = 'participant-timer';
    const BUTTONS_DIV = 'participant-buttons';

    let state = null;
    let participantCount = 0;
    let timers = [];
    let interval = null;

    document.addEventListener('DOMContentLoaded', initApp);
    document.addEventListener('keydown', onKeyDown);

    function initApp() {
        state = 'STATE_INPUT';
        inputState();
        id('startButton').addEventListener('click', timerState);
        id('restartLink').addEventListener('click', inputState);
        id('resetButton').addEventListener('click', resetTimers);
    }

    function inputState() {
        clearInputs();
        hideId(TIMER_DIV);
        showId(INPUT_DIV);
        hideId('startButton');
        addParticipantInput();
    }

    /* Handle inputting participant names */

    function clearInputs() {
        participantCount = 0;
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
        state = 'STATE_TIMER';
        clearTimers();
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

            renderTimers();
        }
    }

    function addTimer(name) {
        const container = appendElement(id(BUTTONS_DIV), 'section', {
            class: 'timer-button-container'
        });
        const button = appendElement(container, 'button', {
            class: 'inactive-timer'
        });
        button.addEventListener('click', activateButton);
        const buttonNum = id(BUTTONS_DIV).children.length;

        const timer = {
            button,
            buttonNum,
            name,
            ms: 0,
            active: false
        };
        button.timer = timer;
        timers.push(timer);
    }

    function renderTimers() {
        timers.forEach((timer) => {
            timer.button.setAttribute('class', timer.active ? 'active-timer' : 'inactive-timer');
            timer.button.innerHTML = `<span class="timer-name">${timer.buttonNum}: ${timer.name}</span>
                                      <br><span class="timer-time">${formatTime(timer.ms)}</span>`;
        });
    }

    function clearTimers() {
        timers = [];
        const formElement = id(BUTTONS_DIV);
        while (formElement.firstChild) {
            formElement.removeChild(formElement.firstChild);
        }
    }

    function onKeyDown(event) {
        if (state === 'STATE_TIMER') {
            const num = event.keyCode - ZERO_CODE;
            if (num > 0 && num <= MAX_PARTICIPANTS) {
                activateButton(num);
            }
        }
    }

    function activateButton(buttonNum) {
        let buttonTimer = null;
        if (typeof buttonNum === 'number' && buttonNum) {
            buttonTimer = timers[buttonNum - 1];
        }
        else {
            buttonTimer = this.timer;
        }

        const toggle = buttonTimer.active;
        clearInterval(interval);
        timers.forEach((timer) => {
            timer.active = false;
        });
        buttonTimer.active = !toggle;
        if (buttonTimer.active) {
            buttonTimer.lastTime = Date.now();
            interval = setInterval(timerTick, TICK_TIME, buttonTimer);
        }
        renderTimers();
    }

    function timerTick(timer) {
        timer.ms += (Date.now() - timer.lastTime);
        timer.lastTime = Date.now();
        renderTimers();
    }

    function formatTime(ms) {
        /* eslint-disable no-magic-numbers */
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms / 1000) % 60);
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
        /* eslint-enable no-magic-numbers */
    }

    function resetTimers() {
        timers.forEach((timer) => {
            timer.ms = 0;
            timer.active = false;
        });
        renderTimers();
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