import { delegate } from '../helper/tools.js';

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

            const formData = new FormData(e.target.closest('form'));

            this.renderQuestion(this.state.step, formData.get('answer'));
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

        this.renderQuestion()
    }

    renderQuestion(index = this.state.step, answer) {
        const step = this.quiz.questions[index];

        console.log(step);
        const answers = step.options.reduce((prev, current, i) => {
            return `${prev}
                <label>
                    <input type="radio" name="answer" value="${current}">
                    <span class="button ${answer ? (answer === step.answer ? 'button--valid' : 'button--error') : ''}">
                        <span class="button__icon">${String.fromCharCode(97 + i).toUpperCase()}</span>${current}
                    </span>
                </label>
            `;
        }, '');
        this.state.content = `
            <h2 class="meta-title">Question
                <data-slot value="questionNumber"></data-slot>
                of 10
            </h2>
            <p class="question">Which of these color contrast ratios defines the minimum WCAG 2.1 Level AA requirement for normal text?</p>
            <label><span class="invisible">Progress: </span>
                <progress value="${index + 1}" max="${this.quiz.questions.length}"></progress>
            </label>

            <form id="answer">${answers}
                <button class="button button--submit">Submit Answer</button>
            </form>
            `;
        this.render();
    }
}

export default Quizz;
