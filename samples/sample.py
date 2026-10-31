"""Canindé: Python sample."""
import re
from dataclasses import dataclass

MAX_FLOCK = 12

@dataclass
class Macaw:
    name: str
    wingspan_cm: float = 110.5

    def describe(self, *, loud: bool = False) -> str:
        # ternary and f-string
        tone = "SQUAWK" if loud else "chirp"
        return f"{self.name} says {tone!r} ({self.wingspan_cm:.1f} cm)"


def parse(line: str) -> Macaw | None:
    m = re.match(r"^(?P<name>\w+),\s*(\d+(?:\.\d+)?)$", line)
    if not m:
        return None
    return Macaw(m["name"], float(m.group(2)))


if __name__ == "__main__":
    for raw in ["Canindé, 112.5", "oops"]:
        bird = parse(raw)
        print(bird.describe(loud=True) if bird else "invalid\n")
