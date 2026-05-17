"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeratorService = void 0;
const moderator_1 = require("../models/moderator");
class ModeratorService {
    constructor() {
        this.moderatorsById = new Map();
    }
    async createModerator({ id, username, sadakatpuani = 0, level = 1 } = {}) {
        const moderator = new moderator_1.Moderator({ id, username, sadakatpuani, level });
        if (!moderator.id) {
            throw new Error("Moderator id is required");
        }
        if (this.moderatorsById.has(moderator.id)) {
            throw new Error("Moderator already exists");
        }
        this.moderatorsById.set(moderator.id, moderator);
        return moderator;
    }
    async findById(moderatorId) {
        return this.moderatorsById.get(moderatorId) ?? null;
    }
    async listModerators() {
        return Array.from(this.moderatorsById.values());
    }
    async deleteModerator(moderatorId) {
        return this.moderatorsById.delete(moderatorId);
    }
    async flagPost(moderatorId, postId, reason = "") {
        const moderator = await this.findById(moderatorId);
        if (!moderator) {
            return null;
        }
        return moderator.flagPost(postId, reason);
    }
}
exports.ModeratorService = ModeratorService;
