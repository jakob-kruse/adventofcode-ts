import fs from "fs/promises";

type Position = {
  x: number;
  y: number;
  char: string;
  isSymbol: boolean;
  surrounding: Position[];
};

function tap<T>(d: T, ...other: any[]) {
  console.log(d, ...other);
  return d;
}

function isSymbol(char: string) {
  return !isNum(char) && char !== ".";
}

function isNum(char: string) {
  return !isNaN(Number(char));
}

function locate(positions: { x: number; y: number }[], x: number, y: number) {
  return positions.find((pos) => pos.x === x && pos.y === y) as
    | Position
    | undefined;
}

function expandNumbersXY(positions: Position[], origin: Position) {
  const matching: Position[] = [];
  for (let x = origin.x; x >= 0; x--) {
    const pos = locate(positions, x, origin.y);
    if (pos && isNum(pos.char)) {
      matching.unshift(pos);
    } else {
      break;
    }
  }
  for (let x = origin.x + 1; x <= positions.length; x++) {
    const pos = locate(positions, x, origin.y);
    if (pos && isNum(pos.char)) {
      matching.push(pos);
    } else {
      break;
    }
  }
  return parseInt(matching.map((pos) => pos.char).join(""));
}

async function run() {
  const inputLines = (await fs.readFile("input.txt", "utf-8"))
    .split("\n")
    .filter(Boolean);

  const charLines = inputLines.map((line) => line.split(""));

  const positions = charLines
    .map((line, y) =>
      line.map(
        (char, x) => ({ x, y, char, isSymbol: isSymbol(char) } as Position)
      )
    )
    .flat()
    .map((symbol, i, positions) => {
      const { x, y } = symbol;

      const surroundingCoords = [
        { x: x - 1, y: y - 1 },
        { x: x, y: y - 1 },
        { x: x + 1, y: y - 1 },
        { x: x + 1, y: y },
        { x: x + 1, y: y + 1 },
        { x: x, y: y + 1 },
        { x: x - 1, y: y + 1 },
        { x: x - 1, y: y },
      ];

      return {
        ...symbol,
        surrounding: surroundingCoords.map((c) => locate(positions, c.x, c.y)!),
      } as Position;
    });

  const symbols = positions.filter(({ isSymbol }) => isSymbol);

  const surroundingNumbers = symbols.map((symb) => {
    const starts = symb.surrounding.filter(({ char }) => isNum(char));
    return {
      ...symb,
      numbers: [
        ...new Set(starts.map((start) => expandNumbersXY(positions, start))),
      ],
    };
  });

  // const sum = surroundingNumbers.reduce((acc, { numbers }) => {
  //   return acc + numbers.reduce((acc, num) => acc + num, 0);
  // }, 0);

  // tap(sum);

  const gearSums = surroundingNumbers
    .filter(({ char, numbers }) => char === "*" && numbers.length === 2)
    .map(({ numbers }) => numbers[0] * numbers[1])
    .reduce((acc, num) => acc + num, 0);

  tap(gearSums);
}

run();
