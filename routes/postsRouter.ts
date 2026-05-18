import { Router, Request, Response } from "express";

import { PostService } from "../services/postService";

const createPostsRouter = (postService: PostService): Router => {
	const router = Router();

	router.post("/", async (req: Request, res: Response) => {
		try {
			const post = await postService.createPost(req.body);
			res.status(201).json(post.toJSON());
		} catch (error) {
			res.status(400).json({ error: (error as Error).message });
		}
	});

	router.get("/", async (_req: Request, res: Response) => {
		const posts = await postService.listPosts();
		res.json(posts.map((post) => post.toJSON()));
	});

	router.delete("/:id", async (req: Request, res: Response) => {
		const deleted = await postService.deletePost(req.params.id);
		if (!deleted) {
			res.status(404).json({ error: "Post not found" });
			return;
		}
		res.json(deleted.toJSON());
	});

	return router;
};

export { createPostsRouter };
