import { Post, PostProps } from "../models/post";
import { IQueueProvider } from "../interfaces/IQueueProvider";
import { PostCreatedEvent } from "../events/PostCreatedEvent";
import { PostDeletedEvent } from "../events/PostDeletedEvent";

export interface PostServiceOptions {
	queueProvider?: IQueueProvider | null;
	queueNames?: string[];
}

export class PostService {
	private postsById: Map<string, Post>;
	private queueProvider: IQueueProvider | null;
	private queueNames: string[];

	constructor({ queueProvider = null, queueNames = [] }: PostServiceOptions = {}) {
		this.postsById = new Map();
		this.queueProvider = queueProvider;
		this.queueNames = queueNames.filter((name) => Boolean(name));
	}

	async createPost({ id, authorId, topicId, content, createdAt, upvotes = 0, aiStatus, aiScore }: PostProps = {}): Promise<Post> {
		const post = new Post({ id, authorId, topicId, content, createdAt, upvotes, aiStatus, aiScore });
		if (!post.id) {
			throw new Error("Post id is required");
		}
		if (this.postsById.has(post.id)) {
			throw new Error("Post already exists");
		}
		this.postsById.set(post.id, post);
		if (this.queueProvider && this.queueNames.length > 0) {
			const payload: PostCreatedEvent = {
				type: "post.created",
				post: post.toJSON(),
			};
			for (const queueName of this.queueNames) {
				console.log("PostService: publishing post.created", {
					queue: queueName,
					postId: payload.post.id,
					authorId: payload.post.authorId,
					topicId: payload.post.topicId,
				});
				await this.queueProvider.publish(queueName, JSON.stringify(payload));
			}
		}
		return post;
	}

	async findById(postId: string): Promise<Post | null> {
		return this.postsById.get(postId) ?? null;
	}

	async listPosts(): Promise<Post[]> {
		return Array.from(this.postsById.values());
	}

	async listByAuthor(authorId: string): Promise<Post[]> {
		return Array.from(this.postsById.values()).filter((post) => post.authorId === authorId);
	}

	async deletePost(postId: string): Promise<Post | null> {
		const post = await this.findById(postId);
		if (!post) {
			return null;
		}
		this.postsById.delete(postId);
		if (this.queueProvider && this.queueNames.length > 0) {
			const payload: PostDeletedEvent = {
				type: "post.deleted",
				post: post.toJSON(),
			};
			for (const queueName of this.queueNames) {
				console.log("PostService: publishing post.deleted", {
					queue: queueName,
					postId: payload.post.id,
					authorId: payload.post.authorId,
					topicId: payload.post.topicId,
				});
				await this.queueProvider.publish(queueName, JSON.stringify(payload));
			}
		}
		return post;
	}

	async upvote(postId: string): Promise<Post | null> {
		const post = await this.findById(postId);
		if (!post) {
			return null;
		}
		post.upvote();
		return post;
	}

	async updateAiResult(postId: string, status?: string | null, score?: number): Promise<Post | null> {
		const post = await this.findById(postId);
		if (!post) {
			return null;
		}
		post.updateAiResult(status, score);
		return post;
	}
}
