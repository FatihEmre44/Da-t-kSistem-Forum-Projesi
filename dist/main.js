"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const postService_1 = require("./services/postService");
const userService_1 = require("./services/userService");
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "1mb" }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
const userService = new userService_1.UserService();
const postService = new postService_1.PostService();
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.post("/users", async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user.toJSON());
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
app.get("/users", async (_req, res) => {
    const users = await userService.listUsers();
    res.json(users.map((user) => user.toJSON()));
});
app.post("/posts", async (req, res) => {
    try {
        const post = await postService.createPost(req.body);
        res.status(201).json(post.toJSON());
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
app.get("/posts", async (_req, res) => {
    const posts = await postService.listPosts();
    res.json(posts.map((post) => post.toJSON()));
});
const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
    console.log(`GsForum API listening on port ${port}`);
});
