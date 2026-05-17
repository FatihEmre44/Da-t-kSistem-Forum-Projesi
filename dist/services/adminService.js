"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const admin_1 = require("../models/admin");
class AdminService {
    constructor() {
        this.adminsById = new Map();
    }
    async createAdmin({ id, username, sadakatpuani = 0, scope = "all" } = {}) {
        const admin = new admin_1.Admin({ id, username, sadakatpuani, scope });
        if (!admin.id) {
            throw new Error("Admin id is required");
        }
        if (this.adminsById.has(admin.id)) {
            throw new Error("Admin already exists");
        }
        this.adminsById.set(admin.id, admin);
        return admin;
    }
    async findById(adminId) {
        return this.adminsById.get(adminId) ?? null;
    }
    async listAdmins() {
        return Array.from(this.adminsById.values());
    }
    async deleteAdmin(adminId) {
        return this.adminsById.delete(adminId);
    }
    async banUser(adminId, userId, reason = "") {
        const admin = await this.findById(adminId);
        if (!admin) {
            return null;
        }
        return admin.banUser(userId, reason);
    }
}
exports.AdminService = AdminService;
