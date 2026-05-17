"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatsWorker = void 0;
class UserStatsWorker {
    constructor(queueProvider, queueName, userService) {
        this.queueProvider = queueProvider;
        this.queueName = queueName;
        this.userService = userService;
    }
    async start() {
        await this.queueProvider.subscribe(this.queueName, async (raw) => {
            let event = null;
            try {
                event = JSON.parse(raw);
            }
            catch (error) {
                console.error("UserStatsWorker: invalid message payload", error);
                return;
            }
            if (!event || event.type !== "post.created") {
                return;
            }
            const authorId = event.post.authorId;
            if (!authorId) {
                return;
            }
            console.log("UserStatsWorker: consumed post.created", {
                queue: this.queueName,
                postId: event.post.id,
                authorId,
            });
            await this.userService.incrementPostCount(authorId);
        });
    }
}
exports.UserStatsWorker = UserStatsWorker;
