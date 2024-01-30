import {delegate} from '../helper/tools.js';

class Answer {
    #timeStamp;
    #answer;
    #right;
    constructor(obj) {
        this.#timeStamp = new Date();
        this.#answer = obj.answer;
        this.#right = obj.right;

        Object.freeze(this);
    }

    getAnswer() {
        return this.#answer;
    }

    getResult() {
        return this.#right;
    }

    getTimeStamp() {
        return this.#right;
    }
}
class Quizz {
    #answers;
    constructor() {
        this.title = document.querySelector('.main-header__title');
        this.main = document.querySelector('.main-content');
        this.state = {
            content: '',
            title: '',
        }

        this.#answers = [];

        fetch('api/data.json')
            .then(data => data.json())
            .then(json => {
                this.data = json;

                this.init();
            });

        document.addEventListener('click', delegate('.subject-selection button', e => {
            const button = e.target.closest('.subject-selection button');

            this.startQuiz(button.value);
        }));

        document.addEventListener('click', delegate('[data-quizz="replay"]', e => {
            this.init();
        }));

        document.addEventListener('submit', delegate('#answer', e => {
            e.preventDefault();

            if(e.submitter.matches('[data-quizz="next"]')) {
                this.state.step++;

                if(this.state.step < this.quiz.questions.length) {
                this.renderQuestion();
                } else {
                    this.renderResult();
                }

                return;
            }

            this.validateForm(e.target.closest('form'));
        }));
    }

    init() {
        const subjects = this.data.quizzes.reduce((prev, current) => {
            return `${prev}
                <li>
                    <button class="button" value="${current.title}">
                        <figure class="button__icon"><img src="${current.icon}"></figure>
                        ${current.title}
                    </button>
                </li>
            `
        }, '');

        this.state.content = `
            <h2 class="welcome-title">Welcome to the <strong>Frontend Quiz!</strong></h2>
            <h3 class="meta-title">Pick a subject to get started.</h3>
            <ul class="subject-selection">${subjects}</ul>`;

        this.render();
    }

    render() {
        this.title.innerHTML = this.state.title;
        this.main.innerHTML = this.state.content;
    }

    startQuiz(quiz) {
        this.quiz = this.data.quizzes.find(item => item.title === quiz);
        this.state.title = this.quiz.title;
        this.state.step = 0;

        this.renderQuestion();
    }

    renderQuestion(index = this.state.step) {
        const step = this.quiz.questions[index];

        const answers = step.options.reduce((prev, current, i) => {
            const answer = this._escapeHTML(current);
            return `${prev}
                <label>
                    <input type="radio" name="answer" value="${answer}">
                    <span class="button">
                        <span class="button__icon">${String.fromCharCode(97 + i).toUpperCase()}</span>${answer}
                    </span>
                </label>
            `;
        }, '');

        this.state.content = `
            <h2 class="meta-title">Question
                ${index + 1}
                of ${this.quiz.questions.length}
            </h2>
            <p class="question">${this._escapeHTML(step.question)}</p>
            <label><span class="invisible">Progress: </span>
                <progress value="${index + 1}" max="${this.quiz.questions.length}"></progress>
            </label>

            <form id="answer">
                <fieldset>${answers}
                    <button class="button button--submit" data-quizz="submit">Submit Answer</button>
                    <p class="error"></p>
                </fieldset>
                <button class="button button--submit" data-quizz="next">Next</button>
            </form>
            `;
        this.render();
    }

    renderResult() {
        const amount = this.#answers.reduce((p, c) => p + (c.getResult() === true ? 1 : 0), 0);
        const total = this.quiz.questions.length;

        this.state.content =
            `
            <h1 class="welcome-title">Quiz completed <strong>You scored...</strong></h1>

            <div class="score-tile">
                <h2 class="icon-title">
                    <figure class="score-tile__title-icon">
                        <img src="../assets/images/icon-accessibility.svg" alt="">
                    </figure>
                    Accessibility
                </h2>
                <div class="score-tile__score">${amount}</div>
                <span class="score-tile__meta"> out of ${total}</span>
            </div>
            <button class="button button--submit" data-quizz="replay">Play Again</button>
        `;

        this.render();
    }

    validateForm(form) {
        const givenAnswer = (new FormData(form)).get('answer');

        if (!givenAnswer) {
            form.querySelector('.error').innerHTML = 'Please select an answer';

            return;
        } else {
            form.querySelector('.error').innerHTML = '';
        }

        const step = this.quiz.questions[this.state.step];

        form.querySelector('fieldset').setAttribute('disabled', '');
        const button = form.querySelector('[name="answer"]:checked').nextElementSibling;

        if (givenAnswer === step.answer) {
            button.classList.add('button--valid');
        } else {
            button.classList.add('button--error');
            form.querySelector(`[type="radio"][value="${step.answer}"]`).nextElementSibling.classList.add('button--valid');
        }

        this.#answers[this.state.step] = new Answer({
            answer: givenAnswer,
            right: givenAnswer === step.answer,
        });
    }

    _escapeHTML(str) {
        const text = document.createElement('div');
        text.textContent = str;

        return text.innerHTML;
    }
}

export default Quizz;
