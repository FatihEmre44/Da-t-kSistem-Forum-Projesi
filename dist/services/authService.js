"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const auth_1 = require("../models/auth");
class AuthService {
    constructor() {
        this.tokensByValue = new Map();
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
}
exports.AuthService = AuthService;
