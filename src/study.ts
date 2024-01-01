import "./study.scss";

import { Deck } from "./model";

const decks = JSON.parse(localStorage.getItem("decks") ?? "[]") as Deck[];
const deck = loadDeck();

function loadDeck() {
  const deckId = window.location.hash.slice(1);
  const deck = decks.find((d) => d.id === deckId);

  if (!deck) {
    window.location.replace("/");
    throw new Error();
  }

  return deck;
}

function renderCard() {
  const cardElement = document.querySelector("#card") as HTMLDivElement | null;

  if (!cardElement) {
    throw new Error();
  }

  document.body.classList.remove("answer-seen");
  cardElement.style.setProperty("visibility", "hidden");
  cardElement.classList.remove("card--flipped");
  cardElement.querySelector(".card__front")!.textContent = deck.seenCards[0].front;
  cardElement.querySelector(".card__back")!.textContent = deck.seenCards[0].back;

  setTimeout(() => {
    cardElement.style.setProperty("visibility", "visible");
  }, 500);
}

document.querySelector("#btnFlip")?.addEventListener("click", () => {
  document.querySelector("#card")?.classList.toggle("card--flipped");
  document.body.classList.add("answer-seen");
});

function startSession() {
  const lastStudiedDate = new Date(deck.lastStudied);
  const now = new Date();

  lastStudiedDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  if (lastStudiedDate < now) {
    deck.seenCards.push(...deck.unseenCards.splice(0, 5));
  }

  studyCard();
}

function studyCard() {
  deck.seenCards.sort((a, b) => a.interval === b.interval ? a.lastSeen - b.lastSeen : a.interval - b.interval);

  const nextCard = deck.seenCards[0];
  const timeFromLastSeenInDays = Math.ceil((Date.now() - nextCard.lastSeen) / 1000 / 60 / 60 / 24);

  if (timeFromLastSeenInDays >= nextCard.interval) {
    renderCard();
  } else {
    alert("Done!");
    window.location.replace("/");
  }
}

document.forms.namedItem("feedback")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const grade = Number(event.submitter?.getAttribute("value"));

  if (Number.isNaN(grade)) {
    throw new Error();
  }

  const card = deck.seenCards[0];

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

  studyCard();
});

window.addEventListener("unload", () => {
  deck.lastStudied = Date.now();

  localStorage.setItem("decks", JSON.stringify(decks));
});

startSession();
