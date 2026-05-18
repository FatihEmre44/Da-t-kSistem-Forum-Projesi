import { Router } from "express";

const createHealthRouter = (): Router => {
	const router = Router();

	router.get("/", (_req, res) => {
		res.json({ status: "ok" });
	});

	return router;
};

export { createHealthRouter };
