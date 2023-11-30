import fs from "fs/promises";
import { MetaData } from "../file-retriever";

export class FSFile {
  constructor(private _path: string, private _metaData?: MetaData) {}

  get metaData() {
    return this._metaData;
  }

  get path() {
    return this._path;
  }

  async read(): Promise<Buffer> {
    return await fs.readFile(this.path);
  }

  async write(data: Buffer): Promise<void> {
    await fs.writeFile(this.path, data);
  }

  async move(toPath: string): Promise<void> {
    await fs.rename(this.path, toPath);
    this._path = toPath;
  }
}
