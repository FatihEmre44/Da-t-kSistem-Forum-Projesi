"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moderator = void 0;
const user_1 = require("./user");
class Moderator extends user_1.User {
    constructor({ id, username, sadakatpuani = 0, level = 1 } = {}) {
        super({ id, username, sadakatpuani });
        this.level = Number.isFinite(level) ? level : 1;
    }
    flagPost(postId, reason = "") {
        return {
            postId: postId ?? null,
            reason,
            flaggedAt: new Date(),
        };
    }
    toJSON() {
        return {
            ...super.toJSON(),
            level: this.level,
        };
    }
}
exports.Moderator = Moderator;
