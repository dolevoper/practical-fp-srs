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