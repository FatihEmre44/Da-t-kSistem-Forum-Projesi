"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthToken = void 0;
class AuthToken {
    constructor({ userId, token, createdAt, expiresAt } = {}) {
        this.userId = userId ?? null;
        this.token = token ?? "";
        this.createdAt = createdAt ? new Date(createdAt) : new Date();
        this.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }
    isExpired(atTime = new Date()) {
        if (!this.expiresAt) {
            return false;
        }
        return this.expiresAt.getTime() <= atTime.getTime();
    }
    toJSON() {
        return {
            userId: this.userId,
            token: this.token,
            createdAt: this.createdAt,
            expiresAt: this.expiresAt,
        };
    }
}
exports.AuthToken = AuthToken;
