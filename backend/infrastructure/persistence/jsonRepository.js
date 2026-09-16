import fs from "fs/promises";
import path from "path";

const writeQueues = new Map();

const clone = (value) => JSON.parse(JSON.stringify(value));

export class JsonRepository {
  constructor(filePath, defaultValue) {
    this.filePath = filePath;
    this.defaultValue = defaultValue;
  }

  async initialize() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });

    try {
      await fs.access(this.filePath);
    } catch {
      await this.#writeAtomic(clone(this.defaultValue));
    }
  }

  async read() {
    await this.initialize();
    const content = await fs.readFile(this.filePath, "utf8");
    return JSON.parse(content);
  }

  async replace(value) {
    return this.#enqueue(async () => {
      await this.#writeAtomic(value);
      return clone(value);
    });
  }

  async update(mutator) {
    return this.#enqueue(async () => {
      const current = await this.read();
      const next = await mutator(clone(current));
      await this.#writeAtomic(next);
      return clone(next);
    });
  }

  async #enqueue(operation) {
    const previous = writeQueues.get(this.filePath) || Promise.resolve();
    const next = previous.catch(() => undefined).then(operation);
    writeQueues.set(this.filePath, next);

    try {
      return await next;
    } finally {
      if (writeQueues.get(this.filePath) === next) writeQueues.delete(this.filePath);
    }
  }

  async #writeAtomic(value) {
    const temporaryPath = `${this.filePath}.${process.pid}.tmp`;
    await fs.writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    await fs.rename(temporaryPath, this.filePath);
  }
}

