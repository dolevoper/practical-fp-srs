import "./study.scss";

import { Card } from "./cards";

const unseenCards: Card[] = [
  {
    front: "Hello",
    back: "Olá",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "Goodbye",
    back: "Chau",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "Thank you",
    back: "Obrigado\nObrigada",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "Please",
    back: "Por favor",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "Sorry",
    back: "Desculpe",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "Excuse me",
    back: "Com licença",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "How are you?",
    back: "Tudo bem?",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "I'm fine, thanks",
    back: "Tudo otimo, obrigado",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "What's your name?",
    back: "Como se chama?",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "My name is Dan",
    back: "Sou Dan",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "Where are you from?",
    back: "De onde é?",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "I'm from Tel-Aviv",
    back: "Sou de Tel-Aviv",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "How old are you?",
    back: "Quantos anos tem?",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "I'm twenty one years old",
    back: "Tenho vinte e um anos",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "Do you speak English?",
    back: "Se fala inglês?",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "I don't understand",
    back: "Não entendo",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "I don't know",
    back: "Não sei",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "I don't remember",
    back: "Não me lembro",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "I don't want",
    back: "Não quero",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  },
  {
    front: "I don't have",
    back: "Não tenho",
    successCount: 0,
    easinessFactor: 2.5,
    interval: 1,
    lastSeen: 0
  }
];

const seenCards: Card[] = [];

function renderCard() {
  const cardElement = document.querySelector("#card") as HTMLDivElement | null;

  if (!cardElement) {
    throw new Error();
  }

  document.body.classList.remove("answer-seen");
  cardElement.style.setProperty("visibility", "hidden");
  cardElement.classList.remove("card--flipped");
  cardElement.querySelector(".card__front")!.textContent = seenCards[0].front;
  cardElement.querySelector(".card__back")!.textContent = seenCards[0].back;

  setTimeout(() => {
    cardElement.style.setProperty("visibility", "visible");
  }, 500);
}

document.querySelector("#btnFlip")?.addEventListener("click", () => {
  document.querySelector("#card")?.classList.toggle("card--flipped");
  document.body.classList.add("answer-seen");
});

function startSession() {
  seenCards.push(...unseenCards.splice(0, 5));

  renderCard();
}

document.forms.namedItem("feedback")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const grade = Number(event.submitter?.getAttribute("value"));

  if (Number.isNaN(grade)) {
    throw new Error();
  }

  const card = seenCards[0];

  if (grade >= 3) {
    if (card.successCount === 0) {
      card.interval = 1;
    } else if (card.successCount === 1) {
      card.interval = 6;
    } else {
      card.interval = Math.round(card.interval * card.easinessFactor);
    }

    ++card.successCount;
  } else {
    card.successCount = 0;
    card.interval = 1;
  }

  card.easinessFactor += 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02);

  if (card.easinessFactor < 1.3) {
    card.easinessFactor = 1.3;
  }

  card.lastSeen = Date.now();

  seenCards.sort((a, b) => a.interval === b.interval ? a.lastSeen - b.lastSeen : a.interval - b.interval);

  const nextCard = seenCards[0];
  const timeFromLastSeenInDays = Math.ceil((Date.now() - nextCard.lastSeen) / 1000 / 60 / 60 / 24);

  if (timeFromLastSeenInDays >= nextCard.interval) {
    renderCard();
  } else {
    alert("Done!");
  }

});

startSession();
