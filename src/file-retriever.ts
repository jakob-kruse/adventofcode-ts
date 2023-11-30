import type { Storage, StorageValue } from "unstorage";
import { FSFile } from "./fs/file";

export type MetaData = {
  type: "text" | "image";
};

export type AutoMeta = {
  createdAt: Date;
  updatedAt: Date;
};

export class FSFileAdapter {
  constructor(private storage: Storage<StorageValue>) {}

  async readFile(path: string) {
    const meta = await this.storage.getItem<MetaData & AutoMeta>(path);

    if (!meta) {
      throw new Error("File not found");
    }

    const cached = await this.storage.getItemRaw(path + "_cached");

    if (cached) {
      return [cached, meta];
    }

    const file = new FSFile(path);

    return [await file.read(), meta];
  }

  async writeFile(
    path: string,
    data: Buffer,
    metaData: MetaData
  ): Promise<void> {
    const file = new FSFile(path, metaData);

    // TODO: uncomment
    // await file.write(data);

    await this.storage.setItem(path, {
      ...metaData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.storage.setItemRaw(path + "_cached", data);
  }

  async moveFile(fromPath: string, toPath: string, metaData: MetaData) {
    const meta = await this.storage.getItem<MetaData & AutoMeta>(fromPath);

    if (!meta) {
      throw new Error("File not found");
    }

    const file = new FSFile(fromPath, metaData);

    // TODO: uncomment
    // await file.move(toPath);

    await Promise.all([
      this.storage.removeItem(fromPath),
      this.storage.removeItem(fromPath + "_cached"),
    ]);

    await Promise.all([
      this.storage.setItem(toPath, {
        ...meta,
        ...metaData,
        updatedAt: new Date(),
      }),
      this.storage.setItemRaw(toPath + "_cached", await file.read()),
    ]);
  }
}
