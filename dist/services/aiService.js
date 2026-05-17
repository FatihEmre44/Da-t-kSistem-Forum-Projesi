"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const ai_1 = require("../models/ai");
class AiService {
    constructor() {
        this.resultsByPostId = new Map();
    }
    async createResult({ id, postId, status = "pending", score = 0, checkedAt } = {}) {
        const result = new ai_1.AiResult({ id, postId, status, score, checkedAt });
        if (!result.postId) {
            throw new Error("Post id is required");
        }
        this.resultsByPostId.set(result.postId, result);
        return result;
    }
    async findByPostId(postId) {
        return this.resultsByPostId.get(postId) ?? null;
    }
    async updateResult(postId, status, score) {
        const result = await this.findByPostId(postId);
        if (!result) {
            return null;
        }
        result.update(status, score);
        return result;
    }
    async deleteResult(postId) {
        return this.resultsByPostId.delete(postId);
    }
}
exports.AiService = AiService;
