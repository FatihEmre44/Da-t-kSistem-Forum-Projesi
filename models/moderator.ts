import { User, UserProps } from "./user";

export interface ModeratorProps extends UserProps {
	level?: number;
}

export class Moderator extends User {
	level: number;

	constructor({ id, username, sadakatpuani = 0, level = 1 }: ModeratorProps = {}) {
		super({ id, username, sadakatpuani });
		this.level = Number.isFinite(level) ? level : 1;
	}

	flagPost(postId: string, reason = ""): { postId: string | null; reason: string; flaggedAt: Date } {
		return {
			postId: postId ?? null,
			reason,
			flaggedAt: new Date(),
		};
	}

	toJSON(): { id: string | null; username: string; sadakatpuani: number; postCount: number; level: number } {
		return {
			...super.toJSON(),
			level: this.level,
		};
	}
}
