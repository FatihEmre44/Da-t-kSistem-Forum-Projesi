"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const auth_1 = require("../models/auth");
class AuthService {
    constructor() {
        this.tokensByValue = new Map();
        this.usersByUsername = new Map();
    }
    hashPassword(plain) {
        return crypto_1.default.createHash("sha256").update(plain).digest("hex");
    }
    verifyPassword(plain, hash) {
        return this.hashPassword(plain) === hash;
    }
    async createToken({ userId, token, createdAt, expiresAt } = {}) {
        const authToken = new auth_1.AuthToken({ userId, token, createdAt, expiresAt });
        if (!authToken.token) {
            throw new Error("Token value is required");
        }
        this.tokensByValue.set(authToken.token, authToken);
        return authToken;
    }
    async findByToken(token) {
        return this.tokensByValue.get(token) ?? null;
    }
    async isTokenValid(token) {
        const authToken = await this.findByToken(token);
        if (!authToken) {
            return false;
        }
        return !authToken.isExpired();
    }
    async revokeToken(token) {
        return this.tokensByValue.delete(token);
    }
    async register(username, password) {
        if (!username || !password) {
            throw new Error("Username and password are required");
        }
        if (this.usersByUsername.has(username)) {
            throw new Error("Username already exists");
        }
        const userId = crypto_1.default.randomUUID();
        const passwordHash = this.hashPassword(password);
        this.usersByUsername.set(username, { userId, passwordHash });
        const tokenValue = crypto_1.default.randomUUID();
        await this.createToken({ userId, token: tokenValue });
        return { userId, token: tokenValue };
    }
    async login(username, password) {
        const record = this.usersByUsername.get(username);
        if (!record) {
            throw new Error("Invalid username or password");
        }
        if (!this.verifyPassword(password, record.passwordHash)) {
            throw new Error("Invalid username or password");
        }
        const tokenValue = crypto_1.default.randomUUID();
        await this.createToken({ userId: record.userId, token: tokenValue });
        return { userId: record.userId, token: tokenValue };
    }
}
exports.AuthService = AuthService;
