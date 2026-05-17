import { User, UserProps } from "./user";

export interface AdminProps extends UserProps {
	scope?: string;
}

export class Admin extends User {
	scope: string;

	constructor({ id, username, sadakatpuani = 0, scope = "all" }: AdminProps = {}) {
		super({ id, username, sadakatpuani });
		this.scope = scope ?? "all";
	}

	banUser(userId: string, reason = ""): { userId: string | null; reason: string; bannedAt: Date } {
		return {
			userId: userId ?? null,
			reason,
			bannedAt: new Date(),
		};
	}

	toJSON(): { id: string | null; username: string; sadakatpuani: number; postCount: number; scope: string } {
		return {
			...super.toJSON(),
			scope: this.scope,
		};
	}
}
