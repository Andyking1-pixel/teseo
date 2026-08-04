const welcomeScreen = document.getElementById('welcomeScreen');
const invitation = document.getElementById('invitation');
const startButton = document.getElementById('startButton');
const music = document.getElementById('backgroundMusic');
const soundButton = document.getElementById('soundButton');
const config = window.invitationConfig;

if (!config) throw new Error('No se encontró config.js.');

const coinSound = new Audio(config.assets.coinAudio);

coinSound.preload = 'auto';
coinSound.volume = .8;

const timeUnits = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds')
};

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function setTextWithBreaks(element, text, preservedElement) {
  const lines = text.split('|');
  element.replaceChildren();
  if (preservedElement) element.appendChild(preservedElement);
  lines.forEach((line, index) => {
    element.appendChild(document.createTextNode(`${preservedElement || index ? ' ' : ''}${line}`));
    if (index < lines.length - 1) element.appendChild(document.createElement('br'));
  });
}

function applyConfig() {
  const { childName, age, assets, event, pageTitle, texts, countdown } = config;
  const nameParts = childName.trim().split(/\s+/);
  const firstName = nameParts.shift() || childName;
  const remainingName = nameParts.join(' ');
  const welcomeName = document.getElementById('welcomeTitle');
  const heroTitle = document.querySelector('.hero h2'); // ya no se usa
  const coverImage = document.querySelector('.hero-top-image');
  const audioSource = music.querySelector('source');

  document.title = pageTitle;
  document.querySelector('meta[name="description"]').content = `Invitación al cumpleaños de ${childName}.`;
  document.querySelector('link[rel="preload"][as="image"]').href = assets.coverImage;

  welcomeName.querySelector('span').textContent = firstName.toUpperCase();
  [...welcomeName.childNodes].find((node) => node.nodeType === Node.TEXT_NODE).nodeValue = ` ${remainingName.toUpperCase()}`;
  if (heroTitle) {
    heroTitle.childNodes[0].nodeValue = firstName.toUpperCase();
    heroTitle.querySelector('span').textContent = `${texts.heroBirthday} ${age}`;
}

  setText('.level-label', texts.welcomeLevel);
  setText('.welcome-copy', texts.welcomeCopy);
  setText('.eyebrow', texts.heroEyebrow);
  
  setTextWithBreaks(document.querySelector('.intro-section p'), texts.intro);
  setText('.event-section h3', texts.missionTitle);
  setText('.detail-date strong', String(event.day).padStart(2, '0'));
  setText('.detail-date p span', event.dateLabel);
  setText('.detail:not(.detail-date) strong', event.timeLabel);
  setText('.detail:not(.detail-date) p span', event.meridiem);
  setText('#countdownTitle', texts.countdownTitle);
  setText('.location-section h3', event.location.toUpperCase());
  setText('.location-section p', texts.locationSubtitle);
  setText('.rsvp-kicker', texts.rsvpKicker);
  setText('.rsvp-section h3', texts.rsvpTitle);
  setText('footer p', texts.footer);
  setText('.countdown div:nth-child(1) span', countdown.labels.days);
  setText('.countdown div:nth-child(2) span', countdown.labels.hours);
  setText('.countdown div:nth-child(3) span', countdown.labels.minutes);
  setText('.countdown div:nth-child(4) span', countdown.labels.seconds);

  const startIcon = startButton.querySelector('.pixel-mario');
  setTextWithBreaks(startButton, `${texts.startButtonLineOne}|${texts.startButtonLineTwo}`, startIcon);

  const mapsButton = document.querySelector('.maps-button');
  const whatsappButton = document.querySelector('.whatsapp-button');
  mapsButton.href = event.mapsUrl;
  whatsappButton.href = `https://wa.me/${event.whatsappNumber}?text=${encodeURIComponent(event.whatsappMessage)}`;
  mapsButton.textContent = texts.mapsButton;
  whatsappButton.textContent = texts.whatsappButton;


  if (coverImage) {
  coverImage.src = assets.coverImage;
  coverImage.alt = `${childName}, el festejado`;
}
  audioSource.src = assets.mainAudio;
  music.load();
}

function getEventDate() {
  if (config.countdown.targetDate) return new Date(config.countdown.targetDate);

  const now = new Date();
  const [hours, minutes] = config.event.time.split(':').map(Number);
  const initialYear = config.event.year || now.getFullYear();
  const eventDate = new Date(initialYear, config.event.month - 1, config.event.day, hours, minutes, 0);

  if (!config.event.year && eventDate <= now) eventDate.setFullYear(now.getFullYear() + 1);
  return eventDate;
}

const eventDate = getEventDate();

function updateCountdown() {
  console.log(eventDate, new Date(), eventDate - new Date());
  const remaining = Math.max(0, eventDate - new Date());
  const totalSeconds = Math.floor(remaining / 1000);
  const values = {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };

  Object.entries(values).forEach(([unit, value]) => {
    timeUnits[unit].textContent = String(value).padStart(2, '0');
  });
}

function updateSoundButton() {
  const playing = !music.paused;
  soundButton.setAttribute('aria-pressed', String(playing));
  soundButton.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
  soundButton.firstElementChild.textContent = playing ? '🔊' : '🔇';
}

function startMusicSilently() {
  music.volume = 0;
  music.currentTime = 0;

  // Se ejecuta dentro del clic: así el navegador permite la reproducción.
  music.play()
    .then(() => console.info(`Música iniciada: ${config.assets.mainAudio}`))
    .catch((error) => console.error(`No se pudo iniciar ${config.assets.mainAudio}.`, error));
}

function revealMusic() {
  const targetVolume = .55;
  const fadeStep = targetVolume / 12;
  const fadeTimer = window.setInterval(() => {
    music.volume = Math.min(targetVolume, music.volume + fadeStep);
    if (music.volume >= targetVolume) window.clearInterval(fadeTimer);
  }, 45);
}

function playStartSounds() {
  let musicRevealed = false;
  const revealOnce = () => {
    if (musicRevealed) return;
    musicRevealed = true;
    revealMusic();
  };

  startMusicSilently();
  coinSound.currentTime = 0;
  coinSound.play()
    .then(() => console.info(`Sonido de moneda iniciado: ${config.assets.coinAudio}`))
    .catch((error) => {
      console.error(`No se pudo iniciar ${config.assets.coinAudio}.`, error);
      revealOnce();
    });

  coinSound.addEventListener('ended', revealOnce, { once: true });
  window.setTimeout(revealOnce, 1600);
}

function launchConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const colors = ['#e52521', '#ffd84d', '#1769c2', '#34a853', '#ffffff'];
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 28; index += 1) {
    const piece = document.createElement('i');
    piece.className = 'confetti-piece';
    piece.style.setProperty('--confetti-color', colors[index % colors.length]);
    piece.style.setProperty('--confetti-x', `${Math.round((Math.random() - .5) * 430)}px`);
    piece.style.setProperty('--confetti-y', `${Math.round(100 + Math.random() * 260)}px`);
    piece.style.setProperty('--confetti-rotate', `${Math.round((Math.random() - .5) * 720)}deg`);
    piece.style.setProperty('--confetti-width', `${5 + Math.round(Math.random() * 4)}px`);
    piece.style.setProperty('--confetti-height', `${9 + Math.round(Math.random() * 8)}px`);
    piece.style.animationDelay = `${Math.random() * .12}s`;
    fragment.appendChild(piece);
  }

  document.body.appendChild(fragment);
  window.setTimeout(() => document.querySelectorAll('.confetti-piece').forEach((piece) => piece.remove()), 1100);
}

function launchStartFlash() {
  document.body.classList.add('is-starting');
  window.setTimeout(() => document.body.classList.remove('is-starting'), 420);
}

startButton.addEventListener('click', () => {
  playStartSounds();
  updateSoundButton();
  soundButton.hidden = false;
  invitation.classList.add('is-visible');
  invitation.setAttribute('aria-hidden', 'false');
  welcomeScreen.classList.add('is-leaving');
  launchConfetti();
  launchStartFlash();
});

soundButton.addEventListener('click', () => {
  if (music.paused) {
    music.play().catch(() => {});
  } else {
    music.pause();
  }
  updateSoundButton();
});

music.addEventListener('play', updateSoundButton);
music.addEventListener('pause', updateSoundButton);
music.addEventListener('error', () => {
  console.error(`Error al cargar ${config.assets.mainAudio}.`, music.error);
  updateSoundButton();
});

applyConfig();
updateCountdown();
window.setInterval(updateCountdown, 1000);
