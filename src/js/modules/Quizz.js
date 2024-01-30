import {delegate} from '../helper/tools.js';

class Quizz {
    constructor() {
        this.title = document.querySelector('.main-header__title');
        this.main = document.querySelector('.main-content');
        this.state = {
            content: '',
            title: '',
        }

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

        document.addEventListener('submit', delegate('#answer', e => {
            e.preventDefault();
            console.log(e.submitter);
            if(e.submitter.matches('[data-quizz="next"]')) {
                this.state.step++;

                this.renderQuestion();

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
                of 10
            </h2>
            <p class="question">${step.question}</p>
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
    }

    _escapeHTML(str) {
        const text = document.createElement('div');
        text.textContent = str;

        return text.innerHTML;
    }
}

export default Quizz;
