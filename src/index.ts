import console, { log } from "console";
import fs from "fs/promises";

function tap<T>(d: T) {
  console.log(d);
  return d;
}

function part1(inputLines: string[]) {
  return inputLines
    .map((line) => line.split(""))
    .map((chars) => chars.map(Number))
    .map((numChars) => numChars.filter((n) => !isNaN(n)))
    .map((nums) => [nums[0], nums[nums.length - 1]])
    .map((firstLast) => firstLast.join(""))
    .map((str) => parseInt(str))
    .reduce((sum, num) => sum + num, 0);
}

function part2(inputLines: string[]) {
  const numberLiterals = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];

  let res: number[][] = [];
  for (let line of inputLines) {
    console.log(line);
    let nums: number[] = [];
    while (line.length > 0) {
      for (const lit of numberLiterals) {
        if (line.startsWith(lit)) {
          nums.push(numberLiterals.indexOf(lit) + 1);
        }
      }

      if (!isNaN(Number(line[0]))) {
        nums.push(Number(line[0]));
      }
      line = line.substring(1);
    }

    res.push(nums);
  }

  return part1(res.map((r) => r.join("")));
}

async function run() {
  const inputLines = (await fs.readFile("input.txt", "utf-8"))
    .split("\n")
    .filter(Boolean);

  const result1 = part1(inputLines);

  console.log(`Part 1: ${result1}`);

  const result2 = part2(inputLines);

  console.log(`Part 2: ${result2}`);
}

run();
