const fs = require("fs");
const crypto = require("crypto");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

module.exports = class Repository {
	constructor(filename) {
		if (!filename) {
			throw new Error("Creating a repository requires a filename");
		}

		this.filename = filename;

		try {
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, "[]");
		}
	}

	async create(data) {
		data.id = this.randomId();

		const records = await this.getAll();
		records.push(data);

		await this.writeAll(records);

		return data;
	}

	randomId() {
		return crypto.randomBytes(4).toString("hex");
	}

	async getAll() {
		return JSON.parse(
			await readFile(this.filename, {
				encoding: "utf8",
			})
		);
	}

	async getOne(id) {
		const records = await this.getAll();
		return records.find((record) => record.id === id);
	}

	async getOneBy(filters) {
		const records = await this.getAll();

		for (let record of records) {
			let found = true;

			for (let key in filters) {
				if (record[key] !== filters[key]) {
					found = false;
				}
			}

			if (found) return record;
		}
	}

	async writeAll(records) {
		await writeFile(this.filename, JSON.stringify(records, null, 2));
	}

	async delete(id) {
		const records = await this.getAll();
		const filtered = records.filter((record) => record.id !== id);

		this.writeAll(filtered);
	}

	async update(id, data) {
		const records = await this.getAll();
		const record = records.find((record) => record.id === id);

		if (!record) throw new Error(`Record with id of ${id} is not found`);

		Object.assign(record, data);

		await this.writeAll(records);
	}
};
