// jest imports
import { afterEach, describe, expect, it, jest } from "@jest/globals";

// mocks
jest.unstable_mockModule("../models/user.model.js", () => ({
	User: {
		findOne: jest.fn(),
		create: jest.fn(),
	},
}));

jest.unstable_mockModule("bcrypt", () => ({
	compare: jest.fn(),
	hash: jest.fn(),
}));

// imports after mocks
const { getUser, createUser } = await import("../services/user.service.js");
const { User } = await import("../models/user.model.js");
const bcrypt = await import("bcrypt");

describe("getUser", () => {
	afterEach(() => jest.clearAllMocks());

	it("should query with lowercase username and exclude password by default", async () => {
		const mockPopulate = jest.fn().mockResolvedValue({ username: "alice" });
		User.findOne.mockReturnValue({ populate: mockPopulate });

		const result = await getUser("Alice");

		expect(User.findOne).toHaveBeenCalledWith(
			{ username: "alice" },
			{ password: 0 },
		);
		expect(result).toEqual({ username: "alice" });
	});

	it("should include password field when returnPassword is true", async () => {
		const mockPopulate = jest
			.fn()
			.mockResolvedValue({ username: "alice", password: "hashed" });
		User.findOne.mockReturnValue({ populate: mockPopulate });

		const result = await getUser("alice", true);

		expect(User.findOne).toHaveBeenCalledWith({ username: "alice" }, {});
		expect(result.password).toBe("hashed");
	});

	it("should return null when user does not exist", async () => {
		const mockPopulate = jest.fn().mockResolvedValue(null);
		User.findOne.mockReturnValue({ populate: mockPopulate });

		const result = await getUser("nobody");

		expect(result).toBeNull();
	});
});

describe("createUser", () => {
	afterEach(() => jest.clearAllMocks());

	it("should hash password, create user, and strip password from result", async () => {
		bcrypt.hash.mockResolvedValue("hashed_pass");

		const fakeDoc = {
			toObject: jest
				.fn()
				.mockReturnValue({ username: "alice", password: "hashed_pass" }),
		};
		User.create.mockResolvedValue(fakeDoc);

		const result = await createUser({ username: "Alice", password: "pass123" });

		expect(bcrypt.hash).toHaveBeenCalled();
		expect(User.create).toHaveBeenCalledWith(
			expect.objectContaining({ username: "alice" }),
		);

		// password must be stripped from the returned object
		expect(result.password).toBeUndefined();
	});

	it("should lowercase the username before saving", async () => {
		bcrypt.hash.mockResolvedValue("hashed_pass");

		const fakeDoc = {
			toObject: jest
				.fn()
				.mockReturnValue({ username: "alice", password: "hashed_pass" }),
		};
		User.create.mockResolvedValue(fakeDoc);

		await createUser({ username: "ALICE", password: "pass123" });

		expect(User.create).toHaveBeenCalledWith(
			expect.objectContaining({ username: "alice" }),
		);
	});

	it("should throw AppError 400 when no valid fields are provided", async () => {
		await expect(createUser({})).rejects.toMatchObject({ statusCode: 400 });
	});
});
