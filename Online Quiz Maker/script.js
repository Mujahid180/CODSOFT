document.addEventListener('DOMContentLoaded', () => {
    showHome();
    document.getElementById('create-quiz-form').addEventListener('submit', createQuiz);
    document.getElementById('take-quiz-form').addEventListener('submit', submitQuiz);
    loadQuizzes();
});

function showHome() {
    document.getElementById('home').classList.remove('hidden');
    document.getElementById('quiz-creation').classList.add('hidden');
    document.getElementById('quiz-listing').classList.add('hidden');
    document.getElementById('quiz-taking').classList.add('hidden');
}

function showQuizCreation() {
    document.getElementById('home').classList.add('hidden');
    document.getElementById('quiz-creation').classList.remove('hidden');
}

function showQuizListing() {
    document.getElementById('home').classList.add('hidden');
    document.getElementById('quiz-creation').classList.add('hidden');
    document.getElementById('quiz-listing').classList.remove('hidden');
    document.getElementById('quiz-taking').classList.add('hidden');
    loadQuizzes();
}

function showQuizTaking(quizId) {
    document.getElementById('quiz-listing').classList.add('hidden');
    document.getElementById('quiz-taking').classList.remove('hidden');
    loadQuiz(quizId);
}

function addQuestion() {
    const questionsDiv = document.getElementById('questions');
    const newQuestion = document.createElement('div');
    newQuestion.classList.add('question');
    newQuestion.innerHTML = `
        <label>Question:</label>
        <input type="text" class="question-text" required>
        <label>Options:</label>
        <input type="text" class="option" required>
        <input type="text" class="option" required>
        <input type="text" class="option" required>
        <input type="text" class="option" required>
        <label>Correct Answer:</label>
        <input type="text" class="correct-answer" required>
    `;
    questionsDiv.appendChild(newQuestion);
}

function createQuiz(event) {
    event.preventDefault();
    const title = document.getElementById('quiz-title').value;
    const questions = [...document.querySelectorAll('.question')].map(questionDiv => ({
        question: questionDiv.querySelector('.question-text').value,
        options: [...questionDiv.querySelectorAll('.option')].map(option => option.value),
        correctAnswer: questionDiv.querySelector('.correct-answer').value,
    }));

    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    quizzes.push({ id: quizzes.length + 1, title, questions });
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    alert('Quiz created successfully!');
    showHome();
}

function loadQuizzes() {
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const quizList = document.getElementById('quiz-list');
    quizList.innerHTML = '';
    quizzes.forEach(quiz => {
        const li = document.createElement('li');
        li.innerHTML = `<button onclick="showQuizTaking(${quiz.id})">${quiz.title}</button>`;
        quizList.appendChild(li);
    });
}

function loadQuiz(quizId) {
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const quiz = quizzes.find(q => q.id === parseInt(quizId, 10));
    if (!quiz || isNaN(quizId)) {
        alert('Quiz not found!');
        showQuizListing();
        return;
    }

    document.getElementById('quiz-title-display').textContent = quiz.title;
    document.getElementById('quiz-title-display').setAttribute('data-quiz-id', quizId);
    const quizQuestionsDiv = document.getElementById('quiz-questions');
    quizQuestionsDiv.innerHTML = '';
    quiz.questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.innerHTML = `
            <p>${q.question}</p>
            ${q.options.map((option, i) => `
                <label>
                    <input type="radio" name="question-${index}" value="${option}" required>
                    ${option}
                </label>
            `).join('')}
        `;
        quizQuestionsDiv.appendChild(questionDiv);
    });
}

function submitQuiz(event) {
    event.preventDefault();
    const quizId = parseInt(document.getElementById('quiz-title-display').getAttribute('data-quiz-id'), 10);
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const quiz = quizzes.find(q => q.id === quizId);
    const answers = [...document.querySelectorAll('#quiz-questions .question')].map((questionDiv, index) => ({
        question: quiz.questions[index].question,
        selectedAnswer: questionDiv.querySelector('input[type="radio"]:checked')?.value,
        correctAnswer: quiz.questions[index].correctAnswer,
    }));

    let score = 0;
    answers.forEach(answer => {
        if (answer.selectedAnswer && answer.selectedAnswer === answer.correctAnswer) {
            score += 1;
        }
    });

    alert(`Quiz completed! Your score: ${score}/${answers.length}`);
    showQuizListing();
}
