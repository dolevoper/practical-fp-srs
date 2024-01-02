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
