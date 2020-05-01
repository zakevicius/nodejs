const util = require("util");
const crypto = require("crypto");
const Repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
	async create(data) {
		data.id = this.randomId();

		// Salting and generating hash
		const salt = crypto.randomBytes(8).toString("hex");
		const buff = await scrypt(data.password, salt, 64);

		const records = await this.getAll();
		const record = {
			...data,
			password: `${buff.toString("hex")}.${salt}`,
		};

		records.push(record);

		await this.writeAll(records);

		return record;
	}

	async comparePasswords(saved, supplied) {
		// Saved -> password in our database
		// Supplied -> password entered by user while signing in
		const [hashed, salt] = saved.split(".");
		const hashedSuppliedBuff = await scrypt(supplied, salt, 64);

		return hashed === hashedSuppliedBuff.toString("hex");
	}
}

module.exports = new UsersRepository("users.json");
