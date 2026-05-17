"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor({ id, username, sadakatpuani = 0 } = {}) {
        this.id = id ?? null;
        this.username = username ?? "";
        this.sadakatpuani = Number.isFinite(sadakatpuani) ? sadakatpuani : 0;
    }
    hesaplaDerbiBonusu(puan) {
        const base = Number.isFinite(puan) ? puan : 0;
        return Math.max(0, Math.floor(base * 0.1));
    }
    increaseSadakat(puan) {
        const inc = Number.isFinite(puan) ? Math.floor(puan) : 0;
        if (inc > 0) {
            this.sadakatpuani += inc;
        }
        return this.sadakatpuani;
    }
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            sadakatpuani: this.sadakatpuani,
        };
    }
}
exports.User = User;
