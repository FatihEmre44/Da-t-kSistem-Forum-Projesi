"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicService = void 0;
const topic_1 = require("../models/topic");
class TopicService {
    constructor() {
        this.topicsById = new Map();
    }
    async createTopic({ id, title, authorId, createdAt, postIds } = {}) {
        const topic = new topic_1.Topic({ id, title, authorId, createdAt, postIds });
        if (!topic.id) {
            throw new Error("Topic id is required");
        }
        if (this.topicsById.has(topic.id)) {
            throw new Error("Topic already exists");
        }
        this.topicsById.set(topic.id, topic);
        return topic;
    }
    async findById(topicId) {
        return this.topicsById.get(topicId) ?? null;
    }
    async listTopics() {
        return Array.from(this.topicsById.values());
    }
    async deleteTopic(topicId) {
        return this.topicsById.delete(topicId);
    }
    async addPostToTopic(topicId, postId) {
        const topic = await this.findById(topicId);
        if (!topic) {
            return null;
        }
        topic.addPost(postId);
        return topic;
    }
}
exports.TopicService = TopicService;
