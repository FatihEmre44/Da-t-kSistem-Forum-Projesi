import { Router, Request, Response } from "express";

import { UserService } from "../services/userService";

const createUsersRouter = (userService: UserService): Router => {
	const router = Router();

	router.post("/", async (req: Request, res: Response) => {
		try {
			const user = await userService.createUser(req.body);
			res.status(201).json(user.toJSON());
		} catch (error) {
			res.status(400).json({ error: (error as Error).message });
		}
	});

	router.get("/", async (_req: Request, res: Response) => {
		const users = await userService.listUsers();
		res.json(users.map((user) => user.toJSON()));
	});

	return router;
};

export { createUsersRouter };
