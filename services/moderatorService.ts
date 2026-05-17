import { Moderator, ModeratorProps } from "../models/moderator";

export class ModeratorService {
	private moderatorsById: Map<string, Moderator>;

	constructor() {
		this.moderatorsById = new Map();
	}

	async createModerator({ id, username, sadakatpuani = 0, level = 1 }: ModeratorProps = {}): Promise<Moderator> {
		const moderator = new Moderator({ id, username, sadakatpuani, level });
		if (!moderator.id) {
			throw new Error("Moderator id is required");
		}
		if (this.moderatorsById.has(moderator.id)) {
			throw new Error("Moderator already exists");
		}
		this.moderatorsById.set(moderator.id, moderator);
		return moderator;
	}

	async findById(moderatorId: string): Promise<Moderator | null> {
		return this.moderatorsById.get(moderatorId) ?? null;
	}

	async listModerators(): Promise<Moderator[]> {
		return Array.from(this.moderatorsById.values());
	}

	async deleteModerator(moderatorId: string): Promise<boolean> {
		return this.moderatorsById.delete(moderatorId);
	}

	async flagPost(moderatorId: string, postId: string, reason = ""): Promise<{ postId: string | null; reason: string; flaggedAt: Date } | null> {
		const moderator = await this.findById(moderatorId);
		if (!moderator) {
			return null;
		}
		return moderator.flagPost(postId, reason);
	}
}
