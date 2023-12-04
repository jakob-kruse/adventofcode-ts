import fs from "fs/promises";

type ScratchCard = {
  idx: number;
  winningNumbers: number[];
  numbers: number[];
  matchingNumbers: number[];
  score: number;
  repeats: number;
};

function tap<T>(d: T, ...other: any[]) {
  console.log(d, ...other);
  return d;
}

function isNum(char: string) {
  return !isNaN(Number(char));
}

function splitTrim(str: string, sep: string) {
  return str
    .split(sep)
    .map((s) => s.trim())
    .filter(Boolean);
}

function filterMatching(arr: number[], numbers: number[]) {
  return arr.filter((num) => numbers.includes(num));
}

function parseScratchCard(input: string): ScratchCard {
  const [title, other] = splitTrim(input, ":");
  const idx = Number(splitTrim(title, " ")[1]) - 1;
  const [winningNumbers, numbers] = splitTrim(other, "|").map((s) =>
    splitTrim(s, " ").filter(Boolean).map(Number)
  );
  const matchingNumbers = filterMatching(numbers, winningNumbers);

  const score = matchingNumbers.reduce((acc) => Math.max(0.5, acc) * 2, 0);

  return {
    idx: idx,
    winningNumbers,
    numbers,
    matchingNumbers,
    score,
    repeats: 1,
  };
}

async function run() {
  const inputLines = (await fs.readFile("input.txt", "utf-8"))
    .split("\n")
    .filter(Boolean);

  const scratchCards = inputLines.map(parseScratchCard);

  const withRepeats = scratchCards.reduce((acc, card) => {
    for (let r = 0; r < card.repeats; r++) {
      for (let i = 1; i <= card.matchingNumbers.length; i++) {
        const nextCard = scratchCards[card.idx + i];
        if (nextCard) {
          nextCard.repeats += 1;
        }
      }
    }

    return [...acc, card];
  }, [] as ScratchCard[]);

  const count = withRepeats.reduce((acc, card) => acc + card.repeats, 0);
  tap("Part 2", count);
}

run();
