// Canindé: TypeScript sample
import { readFile } from "node:fs/promises";

interface Macaw {
  name: string;
  wingspanCm: number;
  colors: readonly string[];
}

enum Habitat {
  Forest = "forest",
  Palm = "palm",
}

const MAX_FLOCK = 12;
const pattern = /ara(?:rauna)?\s\d+/gi;

function sealed(constructor: Function) {
  Object.seal(constructor);
}

@sealed
class Aviary<T extends Macaw = Macaw> {
  private flock: T[] = [];

  constructor(public readonly label: string) {}

  add(bird: T): this {
    if (this.flock.length >= MAX_FLOCK) {
      throw new Error(`Aviary "${this.label}" is full (${MAX_FLOCK})`);
    }
    this.flock.push(bird);
    return this;
  }

  async load(path: string): Promise<number> {
    const raw = await readFile(path, "utf8"); // read the flock from disk
    const data = JSON.parse(raw) as T[];
    data.forEach((b, i) => console.log(i + 1, b.name, null, true, Habitat.Palm));
    return data.length;
  }
}
