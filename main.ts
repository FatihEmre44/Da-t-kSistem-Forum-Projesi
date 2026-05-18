import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { PostService } from "./services/postService";
import { RabbitMQProvider } from "./services/RabbitMQProvider";
import { TopicStatsWorker } from "./services/TopicStatsWorker";
import { TopicService } from "./services/topicService";
import { UserStatsWorker } from "./services/UserStatsWorker";
import { UserService } from "./services/userService";
import { createHealthRouter } from "./routes/healthRouter";
import { createUsersRouter } from "./routes/usersRouter";
import { createPostsRouter } from "./routes/postsRouter";
import { createTopicsRouter } from "./routes/topicsRouter";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const userService = new UserService();
const topicService = new TopicService();

const rabbitUrl = process.env.RABBITMQ_URL || "amqp://localhost";
const postsQueue = process.env.POSTS_QUEUE || "posts.events";

const queueProvider = new RabbitMQProvider(rabbitUrl);
const postService = new PostService({ queueProvider, queueName: postsQueue });
const userStatsWorker = new UserStatsWorker(queueProvider, postsQueue, userService);
const topicStatsWorker = new TopicStatsWorker(queueProvider, postsQueue, topicService);

app.use("/health", createHealthRouter());
app.use("/users", createUsersRouter(userService));
app.use("/posts", createPostsRouter(postService));
app.use("/topics", createTopicsRouter(topicService));

const port = Number(process.env.PORT) || 3000;
const startServer = async (): Promise<void> => {
	try {
		await queueProvider.connect();
		await userStatsWorker.start();
		await topicStatsWorker.start();
		app.listen(port, () => {
			console.log(`GsForum API listening on port ${port}`);
		});
	} catch (error) {
		console.error("Startup failed:", error);
		process.exit(1);
	}
};

void startServer();
