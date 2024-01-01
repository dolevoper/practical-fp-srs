import { Card } from "./cards";

type Deck = {
    id: string,
    name: string,
    cards: Card[]
};

const decks = JSON.parse(localStorage.getItem("decks") ?? "[]") as Deck[];

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
    const deckName = deckFile.name.split(".")[0];
    const cards: Card[] = deckContents
        .split("\n")
        .map((line) => line.split(","))
        .map(([front, back]) => ({
            front,
            back,
            lastSeen: 0,
            interval: 1,
            easinessFactor: 2.5,
            successCount: 0
        }));


});