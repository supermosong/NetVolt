/* =============================================================
   interactions.js
   Handles four interactive features:
   1. Flip cards  — click/keyboard to reveal definition
   2. Accordion   — expand/collapse sections
   3. Quiz engine — multiple-choice with scoring
   4. Node diagram — animated SVG network diagram (new)
   5. Step list   — staggered scroll-in animation (new)
   ============================================================= */

document.addEventListener('DOMContentLoaded', function () {

  initFlipCards();
  initAccordion();
  initQuiz();
  initStepLists();   /* stagger-animate .step-item on scroll    */
  initScrollVideo(); /* scrub video forward/backward with scroll */

  /* Node diagrams: each page that needs one calls initNodeDiagram()
     with its own data after this script loads (see index.html).    */

});

/* =============================================================
   1. FLIP CARDS
   ============================================================= */
function initFlipCards() {
  var cards = document.querySelectorAll('.flip-card');

  cards.forEach(function (card) {
    card.addEventListener('click', function () { toggleFlipCard(card); });

    card.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
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
      var baseLabel = card.getAttribute('aria-label').replace('— click to flip and learn more', '');
      card.setAttribute('aria-label', baseLabel + '— showing definition');
    }
  }
}

/* =============================================================
   2. ACCORDION
   ============================================================= */
function initAccordion() {
  var triggers = document.querySelectorAll('.accordion-trigger');

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = trigger.closest('.accordion-item');
      if (item.classList.contains('is-open')) {
        closeItem(item, trigger);
      } else {
        openItem(item, trigger);
      }
    });

    trigger.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        trigger.click();
      }
    });
  });

  function openItem(item, trigger) {
    item.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function closeItem(item, trigger) {
    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  }
}

/* =============================================================
   3. QUIZ ENGINE
   Questions come from window.QUIZ_QUESTIONS set per-page.
   ============================================================= */
var LETTERS = ['A', 'B', 'C', 'D'];
var currentQuestion = 0;
var score = 0;
var answered = false;

function initQuiz() {
  var area = document.getElementById('quiz-question-area');
  if (!area) return;
  if (!window.QUIZ_QUESTIONS || window.QUIZ_QUESTIONS.length === 0) return;
  renderQuestion(area);
}

function renderQuestion(area) {
  var q = window.QUIZ_QUESTIONS[currentQuestion];
  var html = '';

  html += '<div class="quiz-header">';
  html += '  <span class="quiz-counter">Question ' + (currentQuestion + 1) + ' of ' + window.QUIZ_QUESTIONS.length + '</span>';
  html += '</div>';

  html += '<p class="quiz-question">' + escapeHTML(q.question) + '</p>';

  html += '<div class="quiz-options" role="group" aria-label="Answer options">';
  q.options.forEach(function (option, index) {
    html += '<button class="quiz-option" data-index="' + index + '" '
          + 'aria-label="Option ' + LETTERS[index] + ': ' + escapeHTML(option) + '">'
          + '  <span class="quiz-option__letter" aria-hidden="true">' + LETTERS[index] + '</span>'
          + '  ' + escapeHTML(option)
          + '</button>';
  });
  html += '</div>';

  html += '<div class="quiz-feedback" id="quiz-feedback" aria-live="polite">'
        + '  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="quiz-feedback-icon"></svg>'
        + '  <span id="quiz-feedback-text"></span>'
        + '</div>';

  html += '<div class="quiz-footer">';
  html += '  <span></span>';
  html += '  <button class="btn btn-primary" id="quiz-next-btn" style="display:none;" aria-label="Next question">';
  var isLast = (currentQuestion === window.QUIZ_QUESTIONS.length - 1);
  html += isLast ? 'See My Score →' : 'Next Question →';
  html += '  </button>';
  html += '</div>';

  area.innerHTML = html;
  answered = false;

  area.querySelectorAll('.quiz-option').forEach(function (btn) {
    btn.addEventListener('click', function () {
      handleAnswer(parseInt(btn.dataset.index, 10), area);
    });
  });

  var nextBtn = document.getElementById('quiz-next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      currentQuestion++;
      if (currentQuestion < window.QUIZ_QUESTIONS.length) {
        renderQuestion(area);
        updateProgressBar();
      } else {
        renderScore(area);
      }
    });
  }
}

function handleAnswer(chosenIndex, area) {
  if (answered) return;
  answered = true;

  var q = window.QUIZ_QUESTIONS[currentQuestion];
  var isCorrect = (chosenIndex === q.correct);
  if (isCorrect) score++;

  area.querySelectorAll('.quiz-option').forEach(function (btn, index) {
    btn.disabled = true;
    if (index === q.correct) {
      btn.classList.add('is-correct');
    } else if (index === chosenIndex && !isCorrect) {
      btn.classList.add('is-wrong');
    }
  });

  var feedbackEl   = document.getElementById('quiz-feedback');
  var feedbackText = document.getElementById('quiz-feedback-text');
  var feedbackIcon = document.getElementById('quiz-feedback-icon');

  if (isCorrect) {
    feedbackEl.classList.add('is-visible', 'is-correct');
    feedbackIcon.innerHTML = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>';
    feedbackText.textContent = 'Correct! ' + q.explanation;
  } else {
    feedbackEl.classList.add('is-visible', 'is-wrong');
    feedbackIcon.innerHTML = '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>';
    feedbackText.textContent = 'Not quite. ' + q.explanation;
  }

  var nextBtn = document.getElementById('quiz-next-btn');
  if (nextBtn) nextBtn.style.display = 'inline-flex';

  updateProgressBar();
}

function updateProgressBar() {
  var fill = document.getElementById('quiz-progress-fill');
  var bar  = fill && fill.parentElement;
  if (!fill) return;
  var pct = Math.round(((currentQuestion + 1) / window.QUIZ_QUESTIONS.length) * 100);
  fill.style.width = pct + '%';
  if (bar) bar.setAttribute('aria-valuenow', currentQuestion + 1);
}

function renderScore(area) {
  var pct = Math.round((score / window.QUIZ_QUESTIONS.length) * 100);
  var message;
  if (pct === 100) {
    message = 'Perfect score! You have a solid foundation in IT basics.';
  } else if (pct >= 80) {
    message = 'Great work! You understand the core concepts well.';
  } else if (pct >= 60) {
    message = 'Good effort! Review the sections where you got stuck and try again.';
  } else {
    message = "Keep going! Re-read the lesson and you'll nail it next time.";
  }

  var html = '<div class="quiz-score">'
    + '  <p class="quiz-counter">Quiz complete</p>'
    + '  <p class="quiz-score__number">' + score + ' / ' + window.QUIZ_QUESTIONS.length + '</p>'
    + '  <p class="quiz-score__label">' + message + '</p>'
    + '  <button class="btn btn-secondary" id="quiz-restart-btn">Try Again</button>'
    + '</div>';

  var fill = document.getElementById('quiz-progress-fill');
  if (fill) fill.style.width = '100%';

  area.innerHTML = html;

  document.getElementById('quiz-restart-btn').addEventListener('click', function () {
    currentQuestion = 0;
    score = 0;
    answered = false;
    var fill2 = document.getElementById('quiz-progress-fill');
    if (fill2) fill2.style.width = '0%';
    renderQuestion(area);
  });
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* =============================================================
   4. GLOWING NODE DIAGRAM
   Creates an animated SVG network diagram inside a container.

   containerId  — id of the <div> that will receive the SVG
   nodesData    — array of node objects:
     { id, label, x, y, color }
     x/y are percentages of the SVG viewBox (0–100)
   edgesData    — array of edge pairs: [sourceId, targetId]

   Usage example (in index.html <script>):
     initNodeDiagram('network-diagram', NODES, EDGES);
   ============================================================= */
function initNodeDiagram(containerId, nodesData, edgesData) {
  var container = document.getElementById(containerId);
  if (!container) return;

  /* SVG viewBox: 400×260 — scales via CSS width:100% */
  var VW = 400, VH = 260;
  var NODE_R = 14; /* circle radius in SVG units */

  /* Convert percentage positions to absolute SVG coords */
  function px(node) { return { x: (node.x / 100) * VW, y: (node.y / 100) * VH }; }

  /* Build the SVG markup as a string */
  var svg = '<svg viewBox="0 0 ' + VW + ' ' + VH + '" xmlns="http://www.w3.org/2000/svg" '
          + 'role="img" aria-label="Network diagram" style="overflow:visible">';

  /* Defs: glow filters, one per accent color */
  svg += '<defs>';
  nodesData.forEach(function (node) {
    /* Each node gets a named filter so its glow matches its color */
    svg += '<filter id="glow-' + node.id + '" x="-50%" y="-50%" width="200%" height="200%">';
    svg += '  <feGaussianBlur stdDeviation="4" result="blur"/>';
    svg += '  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>';
    svg += '</filter>';
  });
  svg += '</defs>';

  /* Draw edges first (behind nodes) */
  if (edgesData) {
    edgesData.forEach(function (edge) {
      var src = nodesData.find(function (n) { return n.id === edge[0]; });
      var tgt = nodesData.find(function (n) { return n.id === edge[1]; });
      if (!src || !tgt) return;
      var s = px(src), t = px(tgt);
      /* stroke-dasharray + CSS animation (dashFlow in components.css) */
      svg += '<line class="diagram-edge"'
           + '  x1="' + s.x + '" y1="' + s.y + '"'
           + '  x2="' + t.x + '" y2="' + t.y + '"'
           + '  stroke="rgba(255,255,255,0.18)"'
           + '  stroke-width="1.5"'
           + '  stroke-dasharray="6 4"'
           + '  stroke-dashoffset="0"'
           + '/>';
    });
  }

  /* Draw nodes */
  nodesData.forEach(function (node, i) {
    var pos = px(node);
    /* Stagger the pulse animation so nodes don't all pulse together */
    var delay = (i * 0.4) + 's';

    svg += '<g class="diagram-node" style="transform-origin:' + pos.x + 'px ' + pos.y + 'px;'
         + 'animation-delay:' + delay + '">';

    /* Glow halo (larger translucent circle behind the filled one) */
    svg += '<circle cx="' + pos.x + '" cy="' + pos.y + '" r="' + (NODE_R + 6) + '"'
         + '  fill="' + node.color + '" opacity="0.18" filter="url(#glow-' + node.id + ')"/>';

    /* Filled node circle */
    svg += '<circle cx="' + pos.x + '" cy="' + pos.y + '" r="' + NODE_R + '"'
         + '  fill="' + node.color + '" opacity="0.9"'
         + '  filter="url(#glow-' + node.id + ')"/>';

    /* Label below the node */
    svg += '<text x="' + pos.x + '" y="' + (pos.y + NODE_R + 14) + '"'
         + '  text-anchor="middle"'
         + '  font-family="Inter,system-ui,sans-serif"'
         + '  font-size="10"'
         + '  font-weight="500"'
         + '  fill="rgba(224,224,255,0.85)">'
         + escapeHTML(node.label)
         + '</text>';

    svg += '</g>';
  });

  svg += '</svg>';

  /* Wrap in the responsive container div */
  container.innerHTML = '<div class="node-diagram-wrap">' + svg + '</div>';
}

/* =============================================================
   5. STEP LIST — staggered scroll-in via IntersectionObserver
   Finds all .step-item elements and reveals them one by one
   (100ms apart) when their parent .step-list enters the viewport.
   ============================================================= */
function initStepLists() {
  var stepLists = document.querySelectorAll('.step-list');
  if (!stepLists.length) return;

  /* IntersectionObserver fires when the list itself crosses into view */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var list = entry.target;
      var steps = list.querySelectorAll('.step-item');

      steps.forEach(function (step, index) {
        /* Stagger: each step waits 100ms more than the previous */
        setTimeout(function () {
          step.classList.add('step-visible');
        }, index * 100);
      });

      /* Stop observing once revealed — no need to re-trigger */
      observer.unobserve(list);
    });
  }, {
    threshold: 0.15  /* trigger when 15% of the list is visible */
  });

  stepLists.forEach(function (list) {
    observer.observe(list);
  });
}

/* =============================================================
   6. SCROLL VIDEO — scrub video currentTime with scroll position
   The .scroll-video-section is 300vh tall so the browser gives
   us 200vh of scroll room while the video stays stuck in view.
   Scroll progress 0→1 maps directly to currentTime 0→duration,
   so scrolling down advances the video and scrolling up rewinds.
   ============================================================= */
function initScrollVideo() {
  var section = document.querySelector('.scroll-video-section');
  var video   = document.querySelector('.scroll-video-el');
  var hint    = document.querySelector('.scroll-video-hint');
  if (!section || !video) return;

  function scrub() {
    var sectionTop    = section.getBoundingClientRect().top + window.scrollY;
    var sectionHeight = section.offsetHeight;
    var windowHeight  = window.innerHeight;

    /* How far the user has scrolled into the section */
    var scrolled     = window.scrollY - sectionTop;
    /* Total scrollable distance inside the section */
    var totalScroll  = sectionHeight - windowHeight;

    var progress = scrolled / totalScroll;
    /* Clamp to [0, 1] so we never overshoot */
    progress = Math.max(0, Math.min(1, progress));

    if (video.duration) {
      video.currentTime = progress * video.duration;
    }

    /* Hide the hint label once the user has started scrolling */
    if (hint) {
      if (progress > 0.02) {
        hint.classList.add('is-hidden');
      } else {
        hint.classList.remove('is-hidden');
      }
    }
  }

  function attach() {
    window.addEventListener('scroll', scrub, { passive: true });
    scrub(); /* run once immediately so the first frame is correct */
  }

  /* Attach as soon as video metadata (duration) is available */
  if (video.readyState >= 1) {
    attach();
  } else {
    video.addEventListener('loadedmetadata', attach, { once: true });
  }
}
