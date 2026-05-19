import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { createPostsRouter } from "./routes/postsRouter";
import { PostService } from "./services/postService";
import { RabbitMQProvider } from "./queue/RabbitMQProvider";
import { PostModerationFailedEvent } from "./events/PostModerationFailedEvent";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const rabbitUrl = process.env.RABBITMQ_URL || "amqp://localhost";
const postsQueueStats = process.env.POSTS_QUEUE_STATS || process.env.POSTS_QUEUE || "posts.events.stats";
const postsQueueAi = process.env.POSTS_QUEUE_AI || process.env.POSTS_QUEUE || "posts.events.ai";

const queueProvider = new RabbitMQProvider(rabbitUrl);
const postService = new PostService({ queueProvider, queueNames: [postsQueueStats, postsQueueAi] });

app.use("/health", (_req, res) => {
	res.json({ status: "ok" });
});

app.use("/posts", createPostsRouter(postService));

const port = Number(process.env.PORT) || 3002;
const startServer = async (): Promise<void> => {
	try {
		await queueProvider.connect();
		await queueProvider.subscribe(postsQueueAi, async (raw) => {
			let event: PostModerationFailedEvent | null = null;
			try {
				event = JSON.parse(raw) as PostModerationFailedEvent;
			} catch (error) {
				return;
			}

			if (!event || event.type !== "post.moderation.failed") {
				return;
			}

			if (!event.postId) {
				return;
			}

			const deleted = await postService.deletePost(event.postId);
			if (!deleted) {
				console.warn("PostService: moderation delete skipped (missing post)", {
					postId: event.postId,
					reasons: event.reasons,
				});
				return;
			}

			console.warn("PostService: deleted post after moderation failure", {
				postId: event.postId,
				reasons: event.reasons,
			});
		});
		app.listen(port, () => {
			console.log(`Post service listening on port ${port}`);
		});
	} catch (error) {
		console.error("Startup failed:", error);
		process.exit(1);
	}
};

void startServer();
