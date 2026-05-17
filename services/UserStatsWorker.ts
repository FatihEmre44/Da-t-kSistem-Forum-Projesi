import { IQueueProvider } from "../interfaces/IQueueProvider";
import { PostCreatedEvent } from "../interfaces/PostCreatedEvent";
import { UserService } from "./userService";

export class UserStatsWorker {
	private readonly queueProvider: IQueueProvider;
	private readonly queueName: string;
	private readonly userService: UserService;

	constructor(queueProvider: IQueueProvider, queueName: string, userService: UserService) {
		this.queueProvider = queueProvider;
		this.queueName = queueName;
		this.userService = userService;
	}

	async start(): Promise<void> {
		await this.queueProvider.subscribe(this.queueName, async (raw) => {
			let event: PostCreatedEvent | null = null;
			try {
				event = JSON.parse(raw) as PostCreatedEvent;
			} catch (error) {
				console.error("UserStatsWorker: invalid message payload", error);
				return;
			}

			if (!event || event.type !== "post.created") {
				return;
			}

			const authorId = event.post.authorId;
			if (!authorId) {
				return;
			}

			console.log("UserStatsWorker: consumed post.created", {
				queue: this.queueName,
				postId: event.post.id,
				authorId,
			});

			await this.userService.incrementPostCount(authorId);
		});
	}
}
