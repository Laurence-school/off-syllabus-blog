const stories = [
  {
    id: 'routine', category: 'study', label: 'Study & focus', date: 'Oct 04, 2026', order: '2026-10-04', minutes: 6, art: 'cover-desk',
    title: 'A study routine that still lets you be a person',
    excerpt: 'Small habits, honest breaks, and a plan that can bend when your week does.',
    body: 'A routine should give your week a little shape, not turn every hour into a test. Try choosing one place to begin, writing down the two things that matter most today, and deciding when you will take a proper break.\n\nLeave some space for the parts of the day you cannot predict. If you miss a study session, the routine is still there tomorrow. Progress can be as simple as beginning again.'
  },
  {
    id: 'campus-corners', category: 'campus', label: 'Campus life', date: 'Oct 02, 2026', order: '2026-10-02', minutes: 4, art: 'cover-campus',
    title: 'A corner of campus to call your own',
    excerpt: 'A familiar path, a quiet seat, and small ways to feel more at home in a new place.',
    body: 'Feeling at home somewhere often starts with small things. Maybe it is a shady bench between classes, a table near the library window, or the route that helps you clear your head before heading back inside.\n\nNotice one place that helps you feel settled. Return to it this week. Familiarity builds slowly, and that is perfectly fine.'
  },
  {
    id: 'real-break', category: 'wellbeing', label: 'Wellbeing', date: 'Sep 29, 2026', order: '2026-09-29', minutes: 3, art: 'cover-rest',
    title: 'A real break is part of the plan',
    excerpt: 'A few unhurried minutes are useful even when the to-do list is still waiting.',
    body: 'A break does not have to be a big event. Walk around the block, eat lunch away from your notes, or give your eyes a few minutes without a screen. A pause can help you return to the day with more attention.\n\nTry putting one small break into your plan before the week fills up. Rest is part of how you keep going.'
  },
  {
    id: 'lunch-kit', category: 'money', label: 'Food & budget', date: 'Sep 26, 2026', order: '2026-09-26', minutes: 4, art: 'cover-lunch',
    title: 'The flexible lunch you can build from leftovers',
    excerpt: 'One simple formula for turning what is already in the fridge into lunch.',
    body: 'Start with a base you like, add something filling, then use whatever vegetables or leftovers are around. A quick sauce, seasoning, or crunchy topping can make familiar ingredients feel new.\n\nIf you have time, prepare one extra portion while you are already cooking. Keep the plan flexible so it works with the groceries you actually have.'
  },
  {
    id: 'say-yes', category: 'wellbeing', label: 'Wellbeing', date: 'Sep 23, 2026', order: '2026-09-23', minutes: 5, art: 'cover-friends',
    title: 'Making friends when everyone already seems to know everyone',
    excerpt: 'Low-pressure ways to start a conversation and let connection grow at its own pace.',
    body: 'It can look like everyone else has already found their group. Often, they are still figuring things out too. Start with a small opening: ask someone about class, invite a classmate to study, or show up to the same campus activity twice.\n\nYou do not need to click with everyone. A few comfortable connections are plenty, and they can take time to form.'
  },
  {
    id: 'reading-reset', category: 'study', label: 'Study & focus', date: 'Sep 20, 2026', order: '2026-09-20', minutes: 5, art: 'cover-desk',
    title: 'When the reading list feels like too much',
    excerpt: 'Shrink the first step, ask one good question, and let the page count wait.',
    body: 'When a reading list feels too big, focus on one section rather than the whole stack. Write down one question you hope the reading will answer, set a short timer, and start there. You do not need to understand every sentence on the first pass.\n\nWhen the timer ends, stretch or get some water, then choose your next step. A focused twenty minutes still counts.'
  },
  {
    id: 'pantry-plan', category: 'money', label: 'Food & budget', date: 'Sep 17, 2026', order: '2026-09-17', minutes: 4, art: 'cover-lunch',
    title: 'A low-pressure way to plan the week’s food',
    excerpt: 'A short list and a few repeat ingredients can make busy days easier.',
    body: 'Before shopping, check what you already have and choose two or three meals you can mix and match. Pick ingredients that can appear in more than one meal, and leave room for leftovers or a change of plan.\n\nA useful food plan is one that fits your time, budget, and appetite. It does not need to look perfect on paper.'
  },
  {
    id: 'campus-friends', category: 'campus', label: 'Campus life', date: 'Sep 14, 2026', order: '2026-09-14', minutes: 4, art: 'cover-friends',
    title: 'Finding your people one small hello at a time',
    excerpt: 'A few simple openings can turn shared classes into familiar faces.',
    body: 'A connection can begin with the smallest thing: asking what someone thought of the lecture, sharing a table, or saying hello to a familiar face. Those little moments make the next conversation easier.\n\nTry showing up to a club, study group, or campus event more than once. People get familiar through repetition, and friendship can grow from there.'
  }
];

const storyGrid = document.getElementById('story-grid');
const searchField = document.getElementById('search-field');
const sortSelect = document.getElementById('sort-select');
const noResults = document.getElementById('no-results');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const modal = document.getElementById('story-modal');
let activeFilter = 'all';
let activeStory = null;
let previousFocus = null;

const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

function readStore(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function getSavedIds() { return readStore('off-syllabus-saved', []); }
function getComments(id) { return readStore(`off-syllabus-comments-${id}`, []); }

function syncSavedCount() {
  const total = getSavedIds().length;
  document.getElementById('saved-total').textContent = total;
}

function storyCard(story, index, savedIds) {
  const isSaved = savedIds.includes(story.id);
  const count = getComments(story.id).length;
  return `<article class="story-card" style="animation-delay:${Math.min(index * 35, 175)}ms">
    <div class="story-art"><svg role="img" aria-label="Illustration for ${escapeHTML(story.title)}"><use href="#${story.art}"></use></svg>
      <button class="save-button" type="button" data-save="${story.id}" aria-pressed="${isSaved}" aria-label="${isSaved ? 'Remove saved story' : 'Save story'}: ${escapeHTML(story.title)}"><span aria-hidden="true">${isSaved ? '♥' : '♡'}</span> ${isSaved ? 'Saved' : 'Save'}</button>
    </div>
    <div class="story-meta"><span>${story.label}</span><i>·</i><time>${story.date}</time></div>
    <h3><button class="story-title-button" type="button" data-read="${story.id}">${escapeHTML(story.title)}</button></h3>
    <p>${escapeHTML(story.excerpt)}</p>
    <div class="story-card-bottom"><button class="arrow-link" type="button" data-read="${story.id}">Read note <span aria-hidden="true">↗</span></button><span class="comment-count">${count} ${count === 1 ? 'reader note' : 'reader notes'}</span></div>
  </article>`;
}

function renderStories() {
  const search = searchField.value.trim().toLowerCase();
  const savedIds = getSavedIds();
  let visible = stories.filter(story => {
    const matchesCategory = activeFilter === 'all' || activeFilter === 'saved' || story.category === activeFilter;
    const matchesSaved = activeFilter !== 'saved' || savedIds.includes(story.id);
    const text = `${story.title} ${story.excerpt} ${story.label}`.toLowerCase();
    return matchesCategory && matchesSaved && (!search || text.includes(search));
  });
  if (sortSelect.value === 'oldest') visible.sort((a, b) => a.order.localeCompare(b.order));
  if (sortSelect.value === 'newest') visible.sort((a, b) => b.order.localeCompare(a.order));
  if (sortSelect.value === 'shortest') visible.sort((a, b) => a.minutes - b.minutes || b.order.localeCompare(a.order));
  storyGrid.innerHTML = visible.map((story, index) => storyCard(story, index, savedIds)).join('');
  noResults.hidden = visible.length > 0;
  syncSavedCount();
}

function setFilter(filter) {
  activeFilter = filter;
  filterButtons.forEach(button => button.classList.toggle('selected', button.dataset.filter === filter));
  renderStories();
}

function setSaved(storyId, shouldSave) {
  const ids = getSavedIds().filter(id => id !== storyId);
  if (shouldSave) ids.push(storyId);
  localStorage.setItem('off-syllabus-saved', JSON.stringify(ids));
  renderStories();
  if (activeStory?.id === storyId) updateModalSaveButton();
}

function updateModalSaveButton() {
  const isSaved = getSavedIds().includes(activeStory.id);
  const button = document.getElementById('modal-save');
  button.setAttribute('aria-pressed', String(isSaved));
  button.innerHTML = `<span aria-hidden="true">${isSaved ? '♥' : '♡'}</span> ${isSaved ? 'Saved for later' : 'Save for later'}`;
}

function renderComments() {
  if (!activeStory) return;
  const comments = getComments(activeStory.id);
  document.getElementById('comment-total').textContent = `${comments.length} ${comments.length === 1 ? 'note' : 'notes'}`;
  const list = document.getElementById('comment-list');
  list.innerHTML = comments.map(comment => `<article class="comment"><strong>${escapeHTML(comment.name)}</strong><time>${escapeHTML(comment.date)}</time><p>${escapeHTML(comment.text)}</p></article>`).join('');
  if (!comments.length) list.innerHTML = '<p class="comment-count">No reader notes yet. Leave the first kind thought.</p>';
}

function openStory(storyId) {
  const story = stories.find(item => item.id === storyId);
  if (!story) return;
  activeStory = story;
  previousFocus = document.activeElement;
  document.getElementById('modal-meta').innerHTML = `<span>${story.label}</span><span>· ${story.date}</span><span>· ${story.minutes} min read</span>`;
  document.getElementById('modal-title').textContent = story.title;
  document.getElementById('modal-image').innerHTML = `<svg role="img" aria-label="Illustration for ${escapeHTML(story.title)}"><use href="#${story.art}"></use></svg>`;
  document.getElementById('modal-body').innerHTML = story.body.split('\n\n').map(paragraph => `<p>${escapeHTML(paragraph)}</p>`).join('');
  renderComments();
  updateModalSaveButton();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close').focus();
}

function closeStory() {
  if (!modal.classList.contains('open')) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  activeStory = null;
  previousFocus?.focus?.();
}

document.addEventListener('click', event => {
  const readButton = event.target.closest('[data-read]');
  if (readButton) openStory(readButton.dataset.read);

  const saveButton = event.target.closest('[data-save]');
  if (saveButton) {
    const storyId = saveButton.dataset.save;
    setSaved(storyId, !getSavedIds().includes(storyId));
  }

  const filterButton = event.target.closest('[data-filter]');
  if (filterButton) setFilter(filterButton.dataset.filter);

  const topicButton = event.target.closest('[data-topic]');
  if (topicButton) {
    setFilter(topicButton.dataset.topic);
    document.getElementById('all-stories').scrollIntoView({ behavior: 'smooth' });
  }

  if (event.target.closest('[data-close-modal]')) closeStory();
});

document.querySelector('.modal-close').addEventListener('click', closeStory);
document.getElementById('modal-save').addEventListener('click', () => {
  if (!activeStory) return;
  setSaved(activeStory.id, !getSavedIds().includes(activeStory.id));
});
searchField.addEventListener('input', renderStories);
sortSelect.addEventListener('change', renderStories);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeStory();
});

document.getElementById('comment-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!activeStory) return;
  const form = event.currentTarget;
  const entry = {
    name: form.elements.name.value.trim(),
    text: form.elements.comment.value.trim(),
    date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  };
  const comments = getComments(activeStory.id);
  comments.push(entry);
  localStorage.setItem(`off-syllabus-comments-${activeStory.id}`, JSON.stringify(comments));
  form.reset();
  renderComments();
  renderStories();
});

document.getElementById('contact-form').addEventListener('submit', event => {
  event.preventDefault();
  document.getElementById('form-status').hidden = false;
  event.currentTarget.reset();
});

const themeToggle = document.getElementById('theme-toggle');
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === 'dark';
  themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  themeToggle.querySelector('.theme-label').textContent = dark ? 'Day mode' : 'Night mode';
  themeToggle.querySelector('.theme-icon').textContent = dark ? '☼' : '◐';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#252b28' : '#f2eee5';
}
applyTheme(localStorage.getItem('off-syllabus-theme') || 'light');
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('off-syllabus-theme', next);
  applyTheme(next);
});

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menuToggle.textContent = open ? '×' : '☰';
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  menuToggle.textContent = '☰';
}));

renderStories();
