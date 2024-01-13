import "./study.scss";

import { Card, Deck, drawCard, gradeCard, grades, parseGrade, pushCards, revealCards, updateInterval } from "./model";

const decks = JSON.parse(localStorage.getItem("decks") ?? "[]") as Deck[];

let deck = loadDeck();
let currentCard: Card | null = null;

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
  if (!currentCard) {
    alert("Done!");
    window.location.replace("/");
    return;
  }

  const cardElement = document.querySelector("#card") as HTMLDivElement | null;

  if (!cardElement) {
    throw new Error();
  }

  document.body.classList.remove("answer-seen");
  cardElement.style.setProperty("visibility", "hidden");
  cardElement.classList.remove("card--flipped");
  cardElement.querySelector(".card__front")!.textContent = currentCard.front;
  cardElement.querySelector(".card__back")!.textContent = currentCard.back;

  for (const grade of grades) {
    document.querySelector(`button[value="${grade}"]`)?.setAttribute("title", `+${updateInterval(currentCard, grade)} days`);
  }

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
    deck = revealCards(deck);
  }

  studyCard();
}

function studyCard() {
  [currentCard, deck] = drawCard(deck, Date.now());

  renderCard();
}

document.forms.namedItem("feedback")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const grade = parseGrade(event.submitter?.getAttribute("value"));

  if (Number.isNaN(grade) || !currentCard) {
    throw new Error();
  }

  currentCard = gradeCard(currentCard, grade, Date.now());
  deck = pushCards(deck, currentCard);

  studyCard();
});

window.addEventListener("unload", () => {
  deck.lastStudied = Date.now();

  localStorage.setItem(
    "decks",
    JSON.stringify(decks.map(
      (d) => d.id !== deck.id ? d : deck
    ))
  );
});

startSession();
