export type Card = {
    front: string,
    back: string,
    successCount: number,
    easinessFactor: number,
    interval: number,
    lastSeen: number
};

export type Deck = {
    id: string,
    name: string,
    unseenCards: Card[],
    seenCards: Card[],
    lastStudied: number
};

export type Grade = 0 | 1 | 2 | 3 | 4 | 5;

export function parseGrade(grade: unknown): Grade {
    const numericGrade = Number(grade);

    if (numericGrade < 0 || numericGrade > 5 || !Number.isInteger(numericGrade)) {
        throw new Error();
    }

    return numericGrade as Grade;
}

export function gradeCard(card: Card, grade: Grade, now: number): Card {
    return {
        ...card,
        successCount: updateSuccessCount(card, grade),
        interval: updateInterval(card, grade),
        easinessFactor: updateEasinessFactor(card, grade),
        lastSeen: now
    };
}

function isFailure(grade: Grade) {
    return grade < 3;
}

function updateSuccessCount(card: Card, grade: Grade) {
    return isFailure(grade) ? 0 : card.successCount + 1;
}

function updateInterval(card: Card, grade: Grade) {
    if (isFailure(grade)) {
        return 1;
    } else if (card.successCount === 0) {
        return 1;
    } else if (card.successCount === 1) {
        return 6;
    } else {
        return Math.round(card.interval * card.easinessFactor);
    }
}

function updateEasinessFactor(card: Card, grade: Grade) {
    return Math.max(1.3, card.easinessFactor + 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
}

export function drawCard(deck: Deck, now: number): [Card | null, Deck] {
    const [nextCard, ...seenCards] = deck.seenCards;
    const timeFromLastSeenInDays = Math.ceil((now - nextCard.lastSeen) / 1000 / 60 / 60 / 24);

    if (timeFromLastSeenInDays >= nextCard.interval) {
        return [nextCard, { ...deck, seenCards }];
    } else {
        return [null, deck];
    }
}

export function pushCards(deck: Deck, ...cards: Card[]): Deck {
    return {
        ...deck,
        seenCards: [...deck.seenCards, ...cards].toSorted((a, b) => a.interval === b.interval ? a.lastSeen - b.lastSeen : a.interval - b.interval)
    };
}

export function revealCards(deck: Deck) {
    return pushCards({ ...deck, unseenCards: deck.unseenCards.slice(5) }, ...deck.unseenCards.slice(0, 5));
}
