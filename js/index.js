'use strict';

/* eslint-env browser */
/* eslint-disable no-use-before-define, no-underscore-dangle */

(() => {
    const MAX_PARTICIPANTS = 8;
    const MIN_PARTICIPANTS = 2;
    const TICK_TIME = 200;
    const ZERO_CODE = 48;

    const BUTTONS_DIV = 'participant-buttons';
    const INPUT_DIV = 'participant-inputs';
    const PARTICIPANT_SECTION = 'participants';
    const RESET_BUTTON = 'resetButton';
    const RESTART_LINK = 'restartLink';
    const START_BUTTON = 'startButton';
    const TIMER_DIV = 'participant-timer';

    let _state = null;
    let _participantCount = 0;
    let _timers = [];
    let _interval = null;

    const states = {
        STATE_INPUT: setInputState,
        STATE_TIMER: setTimerState
    };

    document.addEventListener('DOMContentLoaded', initApp);
    document.addEventListener('keydown', onKeyDown);

    function initApp() {
        setState('STATE_INPUT');
        id(RESET_BUTTON).addEventListener('click', resetTimers);
        id(RESTART_LINK).addEventListener('click', () => setState('STATE_INPUT'));
        id(START_BUTTON).addEventListener('click', () => setState('STATE_TIMER'));
    }

    function setState(myState) {
        if (states.hasOwnProperty(myState)) { // eslint-disable-line no-prototype-builtins
            _state = myState;
            states[myState]();
        }
    }

    /* Input state functions */

    function setInputState() {
        clearInputs();
        hideId(TIMER_DIV);
        showId(INPUT_DIV);
        id(START_BUTTON).disabled = true;
        addParticipantInput();
    }

    function clearInputs() {
        _participantCount = 0;
        const formElement = id(PARTICIPANT_SECTION);
        while (formElement.firstChild) {
            formElement.removeChild(formElement.firstChild);
        }
    }

    function addParticipantInput() {
        if (_participantCount < MAX_PARTICIPANTS) {
            ++_participantCount;
            const formElement = id(PARTICIPANT_SECTION);
            const pname = `pname${_participantCount}`;
            const el = appendElement(formElement, 'label', {
                for: pname,
            });
            el.textContent = `Participant ${_participantCount}: `;
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
            if (_participantCount >= MIN_PARTICIPANTS) {
                id(START_BUTTON).disabled = false;
            }
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

    /* Timer state functions */

    function setTimerState() {
        clearTimers();
        const inputNames = [...document.querySelectorAll('input')]
            .map(e => e.value)
            .filter(e => e !== '');
        const pCount = inputNames.length;

        if (pCount >= MIN_PARTICIPANTS && pCount <= MAX_PARTICIPANTS) {
            hideId(INPUT_DIV);
            showId(TIMER_DIV);

            inputNames.forEach((e) => {
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
        _timers.push(timer);
    }

    function renderTimers() {
        _timers.forEach((timer) => {
            timer.button.setAttribute('class', timer.active ? 'active-timer' : 'inactive-timer');
            timer.button.innerHTML = `<span class="timer-name">${timer.buttonNum}: ${timer.name}</span>
                                      <br><span class="timer-time">${formatTime(timer.ms)}</span>`;
        });
    }

    function clearTimers() {
        _timers = [];
        const formElement = id(BUTTONS_DIV);
        while (formElement.firstChild) {
            formElement.removeChild(formElement.firstChild);
        }
    }

    function onKeyDown(event) {
        if (_state === 'STATE_TIMER') {
            const num = event.keyCode - ZERO_CODE;
            if (num > 0 && num <= MAX_PARTICIPANTS) {
                activateButton(num);
            }
        }
    }

    function activateButton(buttonNum) {
        let buttonTimer = null;
        buttonTimer = (typeof buttonNum === 'number' && buttonNum) ?
            _timers[buttonNum - 1] :
            buttonTimer = this.timer;

        const toggle = buttonTimer.active;
        clearInterval(_interval);
        _timers.forEach((timer) => {
            timer.active = false;
        });
        buttonTimer.active = !toggle;
        if (buttonTimer.active) {
            buttonTimer.lastTime = Date.now();
            _interval = setInterval(timerTick, TICK_TIME, buttonTimer);
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
        _timers.forEach((timer) => {
            timer.ms = 0;
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
