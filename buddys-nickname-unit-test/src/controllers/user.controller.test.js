// jest imports
import { afterEach, describe, expect, it, jest } from "@jest/globals";

// mocks
jest.unstable_mockModule("../services/user.service.js", () => ({
	getUser: jest.fn(),
	createUser: jest.fn(),
	updateUser: jest.fn(),
	deleteUser: jest.fn(),
}));

jest.unstable_mockModule("../utils/tokenStore.js", () => ({
	addToken: jest.fn(),
	removeToken: jest.fn(),
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
	default: {
		sign: jest.fn(),
		verify: jest.fn(),
	},
}));

jest.unstable_mockModule("bcrypt", () => ({
	compare: jest.fn(),
	hash: jest.fn(),
}));

// imports after mocks
const { createUserHandler, loginUserHandler } = await import(
	"../controllers/user.controller.js"
);
const { getUser, createUser } = await import("../services/user.service.js");
const { addToken } = await import("../utils/tokenStore.js");
const jwt = (await import("jsonwebtoken")).default;
const bcrypt = await import("bcrypt");

// express server mocking
const mockReqResNext = (body = {}, params = {}) => {
	const req = { body, params };
	const res = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn().mockReturnThis(),
		send: jest.fn().mockReturnThis(),
	};
	const next = jest.fn();
	return { req, res, next };
};

describe("createUserHandler", () => {
	afterEach(() => jest.clearAllMocks());

	it("should create a user and return 201", async () => {
		const { req, res, next } = mockReqResNext({
			username: "alice",
			password: "pass123",
		});

		getUser.mockResolvedValue(null);
		createUser.mockResolvedValue({ username: "alice" });

		await createUserHandler(req, res, next);

		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ username: "alice" });
	});

	it("should call next with 400 when username or password missing", async () => {
		const { req, res, next } = mockReqResNext({ username: "alice" });

		await createUserHandler(req, res, next);

		expect(next).toHaveBeenCalled();
		expect(next.mock.calls[0][0].statusCode).toBe(400);
	});

	it("should call next with 409 when user already exists", async () => {
		const { req, res, next } = mockReqResNext({
			username: "alice",
			password: "pass123",
		});

		getUser.mockResolvedValue({ username: "alice" });

		await createUserHandler(req, res, next);

		expect(next.mock.calls[0][0].statusCode).toBe(409);
	});
});

describe("loginUserHandler", () => {
	afterEach(() => jest.clearAllMocks());

	it("should return accessToken on valid credentials", async () => {
		const { req, res, next } = mockReqResNext({
			username: "alice",
			password: "pass123",
		});

		getUser.mockResolvedValue({ username: "alice", password: "hashed" });
		bcrypt.compare.mockResolvedValue(true);
		jwt.sign.mockReturnValue("mock_token");

		await loginUserHandler(req, res, next);

		expect(addToken).toHaveBeenCalledWith("mock_token");
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith({ accessToken: "mock_token" });
	});

	it("should call next with 401 on wrong password", async () => {
		const { req, res, next } = mockReqResNext({
			username: "alice",
			password: "wrong",
		});

		getUser.mockResolvedValue({ username: "alice", password: "hashed" });
		bcrypt.compare.mockResolvedValue(false);

		await loginUserHandler(req, res, next);

		expect(next).toHaveBeenCalled();
		expect(next.mock.calls[0][0].statusCode).toBe(401);
	});

	it("should call next with 404 when user not found", async () => {
		const { req, res, next } = mockReqResNext({
			username: "ghost",
			password: "pass123",
		});

		getUser.mockResolvedValue(null);

		await loginUserHandler(req, res, next);

		expect(next.mock.calls[0][0].statusCode).toBe(404);
	});
});
