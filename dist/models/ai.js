"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiResult = void 0;
class AiResult {
    constructor({ id, postId, status = "pending", score = 0, checkedAt } = {}) {
        this.id = id ?? null;
        this.postId = postId ?? null;
        this.status = status ?? "pending";
        this.score = Number.isFinite(score) ? score : 0;
        this.checkedAt = checkedAt ? new Date(checkedAt) : null;
    }
    update(status, score) {
        if (status !== undefined && status !== null) {
            this.status = status;
        }
        if (Number.isFinite(score)) {
            this.score = score;
        }
        this.checkedAt = new Date();
        return { status: this.status, score: this.score, checkedAt: this.checkedAt };
    }
    toJSON() {
        return {
            id: this.id,
            postId: this.postId,
            status: this.status,
            score: this.score,
            checkedAt: this.checkedAt,
        };
    }
}
exports.AiResult = AiResult;
