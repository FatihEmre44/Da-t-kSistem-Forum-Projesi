"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQProvider = void 0;
const amqp = __importStar(require("amqplib"));
class RabbitMQProvider {
    constructor(url) {
        this.connection = null;
        this.channel = null;
        this.url = url;
    }
    async connect() {
        try {
            this.connection = await amqp.connect(this.url);
            this.connection.on("error", (err) => {
                console.error("RabbitMQ connection error:", err);
            });
            this.connection.on("close", () => {
                console.warn("RabbitMQ connection closed");
            });
            this.channel = await this.connection.createChannel();
        }
        catch (error) {
            console.error("RabbitMQ connect failed:", error);
            throw error;
        }
    }
    async publish(queue, message) {
        try {
            if (!this.channel) {
                throw new Error("RabbitMQ channel is not initialized");
            }
            await this.channel.assertQueue(queue, { durable: true });
            this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
        }
        catch (error) {
            console.error(`RabbitMQ publish failed (queue: ${queue}):`, error);
            throw error;
        }
    }
    async subscribe(queue, callback) {
        try {
            if (!this.channel) {
                throw new Error("RabbitMQ channel is not initialized");
            }
            await this.channel.assertQueue(queue, { durable: true });
            await this.channel.consume(queue, async (msg) => {
                if (!msg) {
                    return;
                }
                try {
                    const content = msg.content.toString();
                    await callback(content);
                    this.channel?.ack(msg);
                }
                catch (callbackError) {
                    console.error(`RabbitMQ callback error (queue: ${queue}):`, callbackError);
                    this.channel?.nack(msg, false, true);
                }
            });
        }
        catch (error) {
            console.error(`RabbitMQ subscribe failed (queue: ${queue}):`, error);
            throw error;
        }
    }
}
exports.RabbitMQProvider = RabbitMQProvider;
