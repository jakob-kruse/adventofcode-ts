import fs from "fs/promises";

type Color = "red" | "green" | "blue";
type Move = { amount: number; color: Color };
type MoveSet = Move[][];
type Game = {
  id: number;
  sets: MoveSet;
};

type ColorCounts = Record<Color, number>;

function trim(s: string) {
  return s.trim();
}

function tap<T>(d: T, ...other: any[]) {
  console.log(d, ...other);
  return d;
}

function parseGame(str: string): Game {
  const [title, ...setsStr] = str.split(":");
  const [, id] = title.split(" ");

  const sets: MoveSet = setsStr
    .join("")
    .split(";")
    .map((setStr) =>
      setStr
        .split(",")
        .map(trim)
        .map((move) => {
          const [amount, color] = move.split(" ").map(trim);

          return {
            color: color as Color,
            amount: parseInt(amount),
          };
        })
    );

  return {
    id: parseInt(id),
    sets,
  };
}

function countColors(set: Move[]): ColorCounts {
  return set.reduce(
    (max, { color, amount }) => {
      return {
        ...max,
        [color]: max[color] + amount,
      };
    },
    { red: 0, green: 0, blue: 0 } as ColorCounts
  );
}

function isGamePossible(max: ColorCounts, game: Game) {
  return game.sets
    .map(countColors)
    .every((colorCount) =>
      Object.entries(colorCount).every(
        ([color, amount]) => amount <= max[color]
      )
    );
}

async function run() {
  const inputLines = (await fs.readFile("input.txt", "utf-8"))
    .split("\n")
    .filter(Boolean);

  const max = {
    red: 12,
    green: 13,
    blue: 14,
  };

  const part1 = inputLines
    .map(parseGame)
    .filter((game) => isGamePossible(max, game))
    .reduce((acc, game) => acc + game.id, 0);

  tap("Part 1", part1);

  const part2 = inputLines
    .map(parseGame)
    .map((game) =>
      game.sets.map(countColors).reduce(
        (maxCounts, counts) => {
          return {
            red: Math.max(maxCounts.red, counts.red),
            green: Math.max(maxCounts.green, counts.green),
            blue: Math.max(maxCounts.blue, counts.blue),
          };
        },
        { red: 0, green: 0, blue: 0 }
      )
    )
    .map((count) => count.red * count.green * count.blue)
    .reduce((acc, v) => acc + v, 0);

  tap("Part 2", part2);
}

run();
