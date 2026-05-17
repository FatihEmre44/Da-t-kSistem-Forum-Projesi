import { Admin, AdminProps } from "../models/admin";

export class AdminService {
	private adminsById: Map<string, Admin>;

	constructor() {
		this.adminsById = new Map();
	}

	async createAdmin({ id, username, sadakatpuani = 0, scope = "all" }: AdminProps = {}): Promise<Admin> {
		const admin = new Admin({ id, username, sadakatpuani, scope });
		if (!admin.id) {
			throw new Error("Admin id is required");
		}
		if (this.adminsById.has(admin.id)) {
			throw new Error("Admin already exists");
		}
		this.adminsById.set(admin.id, admin);
		return admin;
	}

	async findById(adminId: string): Promise<Admin | null> {
		return this.adminsById.get(adminId) ?? null;
	}

	async listAdmins(): Promise<Admin[]> {
		return Array.from(this.adminsById.values());
	}

	async deleteAdmin(adminId: string): Promise<boolean> {
		return this.adminsById.delete(adminId);
	}

	async banUser(adminId: string, userId: string, reason = ""): Promise<{ userId: string | null; reason: string; bannedAt: Date } | null> {
		const admin = await this.findById(adminId);
		if (!admin) {
			return null;
		}
		return admin.banUser(userId, reason);
	}
}
