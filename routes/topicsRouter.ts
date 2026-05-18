import { Router, Request, Response } from "express";

import { TopicService } from "../services/topicService";

const createTopicsRouter = (topicService: TopicService): Router => {
	const router = Router();

	router.post("/", async (req: Request, res: Response) => {
		try {
			const topic = await topicService.createTopic(req.body);
			res.status(201).json(topic.toJSON());
		} catch (error) {
			res.status(400).json({ error: (error as Error).message });
		}
	});

	router.get("/", async (_req: Request, res: Response) => {
		const topics = await topicService.listTopics();
		res.json(topics.map((topic) => topic.toJSON()));
	});

	router.get("/trending", async (req: Request, res: Response) => {
		const limit = Number(req.query.limit) || 10;
		const topics = await topicService.getTrendingTopics(limit);
		res.json(topics.map((topic) => topic.toJSON()));
	});

	return router;
};

export { createTopicsRouter };
