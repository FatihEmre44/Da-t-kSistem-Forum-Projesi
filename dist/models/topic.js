"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
class Topic {
    constructor({ id, title, authorId, createdAt, postIds } = {}) {
        this.id = id ?? null;
        this.title = title ?? "";
        this.authorId = authorId ?? null;
        this.createdAt = createdAt ? new Date(createdAt) : new Date();
        this.postIds = Array.isArray(postIds) ? postIds.slice() : [];
    }
    addPost(postId) {
        if (postId && !this.postIds.includes(postId)) {
            this.postIds.push(postId);
        }
        return this.postIds.length;
    }
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            authorId: this.authorId,
            createdAt: this.createdAt,
            postIds: this.postIds.slice(),
        };
    }
}
exports.Topic = Topic;
