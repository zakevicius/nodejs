const { check } = require("express-validator");
const usersRepo = require("../../repositories/users");

module.exports = {
	requireTitle: check("title")
		.trim()
		.isLength({ min: 5, max: 40 })
		.withMessage("Title must be between 5 and 40 characters"),
	requirePrice: check("price")
		.trim()
		.toFloat()
		.isFloat({ min: 1 })
		.withMessage("Price must be minimum of 1"),
	requireEmail: check("email")
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage("Email must be valid")
		.custom(async (email) => {
			const existingUser = await usersRepo.getOneBy({ email });
			if (existingUser) {
				throw new Error("Email is already registered");
			}
		}),
	requirePassword: check("password")
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage("Password must be between 4 and 20 characters"),
	requirePasswordConfirmation: check("passwordConfirmation")
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage("Password must be between 4 and 20 characters")
		.custom((passwordConfirmation, { req }) => {
			if (passwordConfirmation !== req.body.password) {
				throw new Error("Passwords do not match");
			}
			return true;
		}),
	requireEmailExists: check("email")
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage("Email must be valid")
		.custom(async (email) => {
			const user = await usersRepo.getOneBy({ email });
			if (!user) {
				throw new Error("User with this email is not registered");
			}
		}),
	requireValidPassword: check("password")
		.trim()
		.custom(async (password, { req }) => {
			const user = await usersRepo.getOneBy({ email: req.body.email });
			if (!user) {
				throw new Error("Invalid password");
			}
			const isValid = await usersRepo.comparePasswords(user.password, password);
			if (!isValid) {
				throw new Error("Invalid password");
			}
			return true;
		}),
};
