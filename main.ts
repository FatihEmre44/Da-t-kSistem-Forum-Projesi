import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { PostService } from "./services/postService";
import { RabbitMQProvider } from "./services/RabbitMQProvider";
import { UserStatsWorker } from "./services/UserStatsWorker";
import { UserService } from "./services/userService";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const userService = new UserService();

const rabbitUrl = process.env.RABBITMQ_URL || "amqp://localhost";
const postsQueue = process.env.POSTS_QUEUE || "posts.events";

const queueProvider = new RabbitMQProvider(rabbitUrl);
const postService = new PostService({ queueProvider, queueName: postsQueue });
const userStatsWorker = new UserStatsWorker(queueProvider, postsQueue, userService);

app.get("/health", (_req: Request, res: Response) => {
	res.json({ status: "ok" });
});

app.post("/users", async (req: Request, res: Response) => {
	try {
		const user = await userService.createUser(req.body);
		res.status(201).json(user.toJSON());
	} catch (error) {
		res.status(400).json({ error: (error as Error).message });
	}
});

app.get("/users", async (_req: Request, res: Response) => {
	const users = await userService.listUsers();
	res.json(users.map((user) => user.toJSON()));
});

app.post("/posts", async (req: Request, res: Response) => {
	try {
		const post = await postService.createPost(req.body);
		res.status(201).json(post.toJSON());
	} catch (error) {
		res.status(400).json({ error: (error as Error).message });
	}
});

app.get("/posts", async (_req: Request, res: Response) => {
	const posts = await postService.listPosts();
	res.json(posts.map((post) => post.toJSON()));
});

const port = Number(process.env.PORT) || 3000;
const startServer = async (): Promise<void> => {
	try {
		await queueProvider.connect();
		await userStatsWorker.start();
		app.listen(port, () => {
			console.log(`GsForum API listening on port ${port}`);
		});
	} catch (error) {
		console.error("Startup failed:", error);
		process.exit(1);
	}
};

void startServer();
