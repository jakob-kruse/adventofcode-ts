import fs from "fs/promises";

type ScratchCard = {
  winningNumbers: number[];
  numbers: number[];
  matchingNumbers: number[];
  score: number;
};

function tap<T>(d: T, ...other: any[]) {
  console.log(d, ...other);
  return d;
}

function isNum(char: string) {
  return !isNaN(Number(char));
}

function splitTrim(str: string, sep: string) {
  return str.split(sep).map((s) => s.trim());
}

function filterMatching(arr: number[], numbers: number[]) {
  return arr.filter((num) => numbers.includes(num));
}

function parseScratchCard(input: string): ScratchCard {
  const [title, other] = splitTrim(input, ":");
  const [winningNumbers, numbers] = splitTrim(other, "|").map((s) =>
    splitTrim(s, " ").filter(Boolean).map(Number)
  );
  const matchingNumbers = filterMatching(numbers, winningNumbers);

  const score = matchingNumbers.reduce((acc) => Math.max(0.5, acc) * 2, 0);

  return {
    winningNumbers,
    numbers,
    matchingNumbers,
    score,
  };
}

async function run() {
  const inputLines = (await fs.readFile("input.txt", "utf-8"))
    .split("\n")
    .filter(Boolean);

  const scratchCards = inputLines.map(parseScratchCard);

  const scoreSum = scratchCards.reduce((acc, card) => acc + card.score, 0);
  tap("Part 1:", scoreSum);
}

run();
