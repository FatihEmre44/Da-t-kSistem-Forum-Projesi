export interface PostModerationFailedEvent {
	type: "post.moderation.failed";
	postId: string;
	reasons: string[];
}
