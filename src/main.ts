import { Card, Deck } from "./model";

const decks = JSON.parse(localStorage.getItem("decks") ?? "[]") as Deck[];

renderDecks();

document.forms.namedItem("importDeck")?.addEventListener("input", async (e) => {
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const deckFile = formData.get("deck") as File;
    const deckContents = await deckFile.text();

    (form.elements.namedItem("deckName") as HTMLOutputElement).textContent = deckFile.name.split(".")[0];
    (form.elements.namedItem("cardCount") as HTMLOutputElement).textContent = deckContents.split("\n").length.toString();
});

document.forms.namedItem("importDeck")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const deckFile = formData.get("deck") as File;
    const deckContents = await deckFile.text();
    const name = deckFile.name.split(".")[0];
    const unseenCards: Card[] = deckContents
        .split("\n")
        .map((line) => line.split(","))
        .map(([front, back]) => ({
            front: front.replaceAll("\\n", "\n"),
            back: back.replaceAll("\\n", "\n"),
            lastSeen: 0,
            interval: 1,
            easinessFactor: 2.5,
            successCount: 0
        }));
    
    decks.push({
        id: crypto.randomUUID(),
        name,
        unseenCards,
        seenCards: [],
        lastStudied: 0
    });

    localStorage.setItem("decks", JSON.stringify(decks));
    form.reset();
    (form.elements.namedItem("deckName") as HTMLOutputElement).textContent = null;
    (form.elements.namedItem("cardCount") as HTMLOutputElement).textContent = null;
    renderDecks()
});

function renderDecks() {
    const deckList = document.getElementById("decks");

    if (!deckList) {
        throw new Error();
    }

    deckList.innerHTML = decks.map((d) => `<li><a href="/study/#${d.id}">${d.name}</a></li>`).join("\n");
}