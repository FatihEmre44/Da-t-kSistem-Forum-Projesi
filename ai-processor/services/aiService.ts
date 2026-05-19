import { AiResult, AiResultProps } from "../models/ai";

export interface AiServiceOptions {
	apiKey?: string;
	forceFlag?: boolean;
}

export class AiService {
	private resultsByPostId: Map<string, AiResult>;
	private apiKey: string;
	private forceFlag: boolean;

	constructor({ apiKey = "", forceFlag = false }: AiServiceOptions = {}) {
		this.resultsByPostId = new Map();
		this.apiKey = apiKey;
		this.forceFlag = forceFlag;
	}

	async moderateContent(content: string): Promise<{ flagged: boolean; reasons: string[] }> {
		if (this.forceFlag) {
			return { flagged: true, reasons: ["forced_test"] };
		}
		if (!this.apiKey) {
			console.warn("AiService: OPENAI_API_KEY is not set; moderation skipped");
			return { flagged: false, reasons: [] };
		}

		if (!content || !content.trim()) {
			return { flagged: false, reasons: [] };
		}

		const response = await fetch("https://api.openai.com/v1/moderations", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.apiKey}`,
			},
			body: JSON.stringify({
				model: "omni-moderation-latest",
				input: content,
			}),
		});

		if (!response.ok) {
			const text = await response.text();
			console.error("AiService: moderation request failed", {
				status: response.status,
				body: text,
			});
			return { flagged: false, reasons: [] };
		}

		const payload = (await response.json()) as {
			results?: Array<{
				flagged?: boolean;
				categories?: Record<string, boolean>;
			}>;
		};

		const result = payload.results?.[0];
		const categories = result?.categories ?? {};
		const reasons = Object.keys(categories).filter((key) => categories[key]);
		return { flagged: Boolean(result?.flagged), reasons };
	}

	async createResult({ id, postId, status = "pending", score = 0, checkedAt }: AiResultProps = {}): Promise<AiResult> {
		const result = new AiResult({ id, postId, status, score, checkedAt });
		if (!result.postId) {
			throw new Error("Post id is required");
		}
		this.resultsByPostId.set(result.postId, result);
		return result;
	}

	async findByPostId(postId: string): Promise<AiResult | null> {
		return this.resultsByPostId.get(postId) ?? null;
	}

	async updateResult(postId: string, status?: string | null, score?: number): Promise<AiResult | null> {
		const result = await this.findByPostId(postId);
		if (!result) {
			return null;
		}
		result.update(status, score);
		return result;
	}

	async deleteResult(postId: string): Promise<boolean> {
		return this.resultsByPostId.delete(postId);
	}
}
