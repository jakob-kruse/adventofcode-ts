import { createStorage } from "unstorage";
import fsLiteDriver from "unstorage/drivers/fs-lite";
import redisDriver from "unstorage/drivers/redis";
import fs from "fs/promises";
import { FSFileAdapter } from "./file-retriever";

async function run() {
  const fsCache = createStorage({
    driver: fsLiteDriver({ base: ".tmp" }),
  });

  const redisCache = createStorage({
    driver: redisDriver({}),
  });

  const fr = new FSFileAdapter(redisCache);

  await fr.writeFile("test.txt", Buffer.from("Hello !"), {
    type: "text",
  });

  const [file, meta] = await fr.readFile("test.txt");

  console.log("Read Text File", file.toString(), "with meta:", meta);

  const image = await fs.readFile("image.jpg");

  await fr.writeFile("image.jpg", image, {
    type: "image",
  });

  const [file2, meta2] = await fr.readFile("image.jpg");

  console.log("Read Image File", "with meta:", meta2);

  await fr.moveFile("image.jpg", "image2.jpg", {
    type: "image",
  });

  const [file3, meta3] = await fr.readFile("image2.jpg");

  console.log("Read Image File", "with meta:", meta3);
}

run();
