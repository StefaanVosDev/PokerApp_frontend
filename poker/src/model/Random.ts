export class Random {
    seed: number;

    constructor(seed: number = Date.now()) {
        this.seed = seed;
    }

    private nextSeed(): number {
        // Example of a simple pseudo-random number generator (Linear Congruential Generator)
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed;
    }

    random(): number {
        return this.nextSeed() / 233280;
    }

    randomInt(min: number, max: number): number {
        return Math.floor(this.random() * (max - min + 1)) + min;
    }
}