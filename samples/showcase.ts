// Canindé · vitrine: cada linha acende um papel de cor
import { readFile } from "node:fs/promises";

enum Habitat {
  Forest = "forest",
  Palm = "palm",
}

interface Macaw<N = string> {
  readonly name: N;
  wingspanCm: number;
  habitat?: Habitat;
}

const MAX_FLOCK = 12;
const PATTERN = /ara(?:rauna)?\s\d+/i;

function sealed(value: Function, _ctx: ClassDecoratorContext): void {
  Object.seal(value);
}

@sealed
class Aviary<B extends Macaw = Macaw> {
  private flock: B[] = [];

  /**
   * Carrega as aves de um arquivo.
   * @param path caminho do JSON
   * @returns quantas aves entraram
   */
  async load(path: string, loud = false): Promise<number> {
    const raw = await readFile(path, "utf8"); // TODO: tratar erro
    const birds = JSON.parse(raw) as B[];
    for (const bird of birds) {
      if (this.flock.length >= MAX_FLOCK || !PATTERN.test(bird.name as string))
        continue;
      this.flock.push(bird);
    }
    console.log(`${this.flock.length} aves\n`, loud ? "SQUAWK" : null, true);
    return this.flock.length;
  }
}

/** @deprecated use Aviary.load */
const legacy = (n: number) => n * 2;
legacy(3);

const total: number = "doze"; // erro proposital: vermelho-urucum
