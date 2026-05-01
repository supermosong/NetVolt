/* =============================================================
   interactions.js
   Purpose: Three interactive features used on topic pages —
   1. Flip cards  — click/keyboard to reveal definition
   2. Accordion   — click to expand/collapse sections
   3. Quiz engine — 5-question multiple choice with scoring
   ============================================================= */

document.addEventListener('DOMContentLoaded', function () {

  initFlipCards();
  initAccordion();
  initQuiz();

});

/* =============================================================
   1. FLIP CARDS
   Each .flip-card toggles .is-flipped on click or Enter/Space.
   CSS handles the 3D rotation; JS only manages the class and
   ARIA state.
   ============================================================= */
function initFlipCards() {
  var cards = document.querySelectorAll('.flip-card');

  cards.forEach(function (card) {

    /* Click to toggle */
    card.addEventListener('click', function () {
      toggleFlipCard(card);
    });

    /* Keyboard: Enter or Space also toggle (accessibility) */
    card.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); /* stop page from scrolling on Space */
        toggleFlipCard(card);
      }
    });
  });

  function toggleFlipCard(card) {
    var isFlipped = card.classList.contains('is-flipped');

    if (isFlipped) {
      card.classList.remove('is-flipped');
      card.setAttribute('aria-label',
        card.getAttribute('aria-label').replace('— showing definition', '— click to flip and learn more'));
    } else {
      card.classList.add('is-flipped');
      /* Update label so screen readers know the card is now showing the back */
      var baseLabel = card.getAttribute('aria-label').replace('— click to flip and learn more', '');
      card.setAttribute('aria-label', baseLabel + '— showing definition');
    }
  }
}

/* =============================================================
   2. ACCORDION
   Each .accordion-trigger button toggles its parent
   .accordion-item open/closed by adding/removing .is-open.
   max-height animation is done in CSS.
   ============================================================= */
function initAccordion() {
  var triggers = document.querySelectorAll('.accordion-trigger');

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = trigger.closest('.accordion-item');
      var isOpen = item.classList.contains('is-open');

      if (isOpen) {
        closeAccordionItem(item, trigger);
      } else {
        openAccordionItem(item, trigger);
      }
    });

    /* Keyboard: Enter or Space activate the button (native for <button>,
       but explicit here in case the element ever changes) */
    trigger.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        trigger.click();
      }
    });
  });

  function openAccordionItem(item, trigger) {
    item.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function closeAccordionItem(item, trigger) {
    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  }
}

/* =============================================================
   3. QUIZ ENGINE
   Reads the QUESTIONS array below and renders each question
   one at a time inside #quiz-question-area.
   After all questions are answered it shows the final score.
   ============================================================= */

/* --- Quiz data ----------------------------------------------- */
var QUESTIONS = [
  {
    question: 'What does CPU stand for?',
    options: [
      'Computer Power Unit',
      'Central Processing Unit',
      'Control Program Utility',
      'Central Program Uploader'
    ],
    correct: 1, /* index of the correct option (0-based) */
    explanation: 'CPU stands for Central Processing Unit — it is the main chip that carries out every instruction a program gives to the computer.'
  },
  {
    question: 'Which type of storage holds data temporarily and loses everything when the computer is turned off?',
    options: [
      'HDD (Hard Disk Drive)',
      'SSD (Solid State Drive)',
      'RAM (Random Access Memory)',
      'USB Flash Drive'
    ],
    correct: 2,
    explanation: 'RAM is temporary (volatile) memory — it holds programs currently in use but clears completely when power is cut. SSDs and HDDs keep data permanently.'
  },
  {
    question: 'Which of the following is an INPUT device?',
    options: [
      'Monitor',
      'Printer',
      'Speakers',
      'Keyboard'
    ],
    correct: 3,
    explanation: 'A keyboard sends data INTO the computer (input). Monitors, printers, and speakers all send information OUT to the user (output).'
  },
  {
    question: 'What is the main difference between hardware and software?',
    options: [
      'Hardware always costs more than software',
      'Software is physical; hardware is digital',
      'Hardware is the physical parts; software is the programs and instructions',
      'They are exactly the same thing'
    ],
    correct: 2,
    explanation: 'Hardware is anything you can physically touch (the CPU, screen, keyboard). Software is the set of instructions that tells hardware what to do (the OS, apps, games).'
  },
  {
    question: 'Which operating system is completely free and open-source?',
    options: [
      'Windows',
      'macOS',
      'Linux',
      'iOS'
    ],
    correct: 2,
    explanation: 'Linux is free and open-source — anyone can view, change, and share its code. Windows and macOS are proprietary (owned by Microsoft and Apple). iOS is also proprietary.'
  }
];

/* Letter labels for the four options */
var LETTERS = ['A', 'B', 'C', 'D'];

/* --- Quiz state --------------------------------------------- */
var currentQuestion = 0;
var score = 0;
var answered = false; /* prevents double-clicking after revealing answer */

function initQuiz() {
  var area = document.getElementById('quiz-question-area');
  if (!area) return; /* exit quietly if we're on a page with no quiz */

  renderQuestion(area);
}

/* Render the current question into the quiz area */
function renderQuestion(area) {
  var q = QUESTIONS[currentQuestion];

  /* Build the HTML string for this question */
  var html = '';

  /* Header row: counter label */
  html += '<div class="quiz-header">';
  html += '  <span class="quiz-counter">Question ' + (currentQuestion + 1) + ' of ' + QUESTIONS.length + '</span>';
  html += '</div>';

  /* Question text */
  html += '<p class="quiz-question">' + escapeHTML(q.question) + '</p>';

  /* Options */
  html += '<div class="quiz-options" role="group" aria-label="Answer options">';
  q.options.forEach(function (option, index) {
    html += '<button class="quiz-option" data-index="' + index + '" '
          + 'aria-label="Option ' + LETTERS[index] + ': ' + escapeHTML(option) + '">'
          + '  <span class="quiz-option__letter" aria-hidden="true">' + LETTERS[index] + '</span>'
          + '  ' + escapeHTML(option)
          + '</button>';
  });
  html += '</div>';

  /* Feedback box (hidden until an option is chosen) */
  html += '<div class="quiz-feedback" id="quiz-feedback" aria-live="polite">'
        + '  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="quiz-feedback-icon"></svg>'
        + '  <span id="quiz-feedback-text"></span>'
        + '</div>';

  /* Footer: Next button (hidden until answered) */
  html += '<div class="quiz-footer">';
  html += '  <span></span>'; /* spacer to push button right */
  html += '  <button class="btn btn-primary" id="quiz-next-btn" style="display:none;" aria-label="Next question">';
  var isLast = (currentQuestion === QUESTIONS.length - 1);
  html += isLast ? 'See My Score →' : 'Next Question →';
  html += '  </button>';
  html += '</div>';

  /* Inject into the DOM */
  area.innerHTML = html;

  /* Reset answered flag for fresh question */
  answered = false;

  /* Attach click handlers to every option button */
  area.querySelectorAll('.quiz-option').forEach(function (btn) {
    btn.addEventListener('click', function () {
      handleAnswer(parseInt(btn.dataset.index, 10), area);
    });
  });

  /* Attach handler to the Next button */
  var nextBtn = document.getElementById('quiz-next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      currentQuestion++;
      if (currentQuestion < QUESTIONS.length) {
        renderQuestion(area);
        updateProgressBar();
      } else {
        renderScore(area);
      }
    });
  }
}

/* Called when the user picks an answer */
function handleAnswer(chosenIndex, area) {
  if (answered) return; /* ignore clicks after the first */
  answered = true;

  var q = QUESTIONS[currentQuestion];
  var isCorrect = (chosenIndex === q.correct);

  if (isCorrect) score++;

  /* Mark all option buttons: correct green, chosen-wrong red, others dim */
  area.querySelectorAll('.quiz-option').forEach(function (btn, index) {
    btn.disabled = true; /* lock all buttons */
    if (index === q.correct) {
      btn.classList.add('is-correct');
    } else if (index === chosenIndex && !isCorrect) {
      btn.classList.add('is-wrong');
    }
  });

  /* Show feedback message */
  var feedbackEl = document.getElementById('quiz-feedback');
  var feedbackText = document.getElementById('quiz-feedback-text');
  var feedbackIcon = document.getElementById('quiz-feedback-icon');

  if (isCorrect) {
    feedbackEl.classList.add('is-visible', 'is-correct');
    /* Checkmark icon */
    feedbackIcon.innerHTML = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>';
    feedbackText.textContent = 'Correct! ' + q.explanation;
  } else {
    feedbackEl.classList.add('is-visible', 'is-wrong');
    /* X icon */
    feedbackIcon.innerHTML = '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>';
    feedbackText.textContent = 'Not quite. ' + q.explanation;
  }

  /* Reveal the Next / See Score button */
  var nextBtn = document.getElementById('quiz-next-btn');
  if (nextBtn) nextBtn.style.display = 'inline-flex';

  /* Update aria on progress bar */
  updateProgressBar();
}

/* Move the progress bar fill to reflect answered questions */
function updateProgressBar() {
  var fill = document.getElementById('quiz-progress-fill');
  var bar  = fill && fill.parentElement;
  if (!fill) return;

  /* currentQuestion is the index of the question just answered */
  var pct = Math.round(((currentQuestion + 1) / QUESTIONS.length) * 100);
  fill.style.width = pct + '%';

  if (bar) {
    bar.setAttribute('aria-valuenow', currentQuestion + 1);
  }
}

/* Render the final score screen */
function renderScore(area) {
  var pct = Math.round((score / QUESTIONS.length) * 100);

  /* Pick an encouraging message based on score */
  var message;
  if (pct === 100) {
    message = 'Perfect score! You have a solid foundation in IT basics.';
  } else if (pct >= 80) {
    message = 'Great work! You understand the core concepts well.';
  } else if (pct >= 60) {
    message = 'Good effort! Review the sections where you got stuck and try again.';
  } else {
    message = 'Keep going! Re-read the lesson and you\'ll nail it next time.';
  }

  var html = '<div class="quiz-score">'
    + '  <p class="quiz-counter">Quiz complete</p>'
    + '  <p class="quiz-score__number">' + score + ' / ' + QUESTIONS.length + '</p>'
    + '  <p class="quiz-score__label">' + message + '</p>'
    + '  <button class="btn btn-secondary" id="quiz-restart-btn">'
    + '    Try Again'
    + '  </button>'
    + '</div>';

  /* Update progress bar to 100% */
  var fill = document.getElementById('quiz-progress-fill');
  if (fill) fill.style.width = '100%';

  area.innerHTML = html;

  /* Restart button resets state and re-renders question 1 */
  document.getElementById('quiz-restart-btn').addEventListener('click', function () {
    currentQuestion = 0;
    score = 0;
    answered = false;
    var fill2 = document.getElementById('quiz-progress-fill');
    if (fill2) fill2.style.width = '0%';
    renderQuestion(area);
  });
}

/* Safety helper: prevent any user-supplied text from being treated as HTML.
   (Quiz data is hard-coded, but this is good defensive practice.) */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
