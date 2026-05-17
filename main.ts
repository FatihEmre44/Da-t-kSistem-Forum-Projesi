import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { PostService } from "./services/postService";
import { UserService } from "./services/userService";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const userService = new UserService();
const postService = new PostService();

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
app.listen(port, () => {
	console.log(`GsForum API listening on port ${port}`);
});
