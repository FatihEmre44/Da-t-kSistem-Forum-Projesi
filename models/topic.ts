export interface TopicProps {
	id?: string | null;
	title?: string;
	authorId?: string | null;
	createdAt?: Date | string | null;
	postIds?: string[];
}

export class Topic {
	id: string | null;
	title: string;
	authorId: string | null;
	createdAt: Date;
	postIds: string[];

	constructor({ id, title, authorId, createdAt, postIds }: TopicProps = {}) {
		this.id = id ?? null;
		this.title = title ?? "";
		this.authorId = authorId ?? null;
		this.createdAt = createdAt ? new Date(createdAt) : new Date();
		this.postIds = Array.isArray(postIds) ? postIds.slice() : [];
	}

	addPost(postId: string): number {
		if (postId && !this.postIds.includes(postId)) {
			this.postIds.push(postId);
		}
		return this.postIds.length;
	}

	toJSON(): {
		id: string | null;
		title: string;
		authorId: string | null;
		createdAt: Date;
		postIds: string[];
	} {
		return {
			id: this.id,
			title: this.title,
			authorId: this.authorId,
			createdAt: this.createdAt,
			postIds: this.postIds.slice(),
		};
	}
}
