"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const user_1 = require("./user");
class Admin extends user_1.User {
    constructor({ id, username, sadakatpuani = 0, scope = "all" } = {}) {
        super({ id, username, sadakatpuani });
        this.scope = scope ?? "all";
    }
    banUser(userId, reason = "") {
        return {
            userId: userId ?? null,
            reason,
            bannedAt: new Date(),
        };
    }
    toJSON() {
        return {
            ...super.toJSON(),
            scope: this.scope,
        };
    }
}
exports.Admin = Admin;
