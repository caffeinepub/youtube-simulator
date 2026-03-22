import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Video {
    id: VideoId;
    title: string;
    creator: ChannelId;
    isShort: boolean;
    thumbnail: ExternalBlob;
    views: bigint;
    watchTime: bigint;
    tags: Array<string>;
    description: string;
    videoFile: ExternalBlob;
    likes: bigint;
    category: Category;
    dislikes: bigint;
    uploadTime: Time;
}
export type CommentId = bigint;
export type Time = bigint;
export interface Comment {
    id: CommentId;
    text: string;
    author: Principal;
    likes: bigint;
    timestamp: Time;
    videoId: VideoId;
}
export type ChannelId = Principal;
export interface Channel {
    id: ChannelId;
    videoCount: bigint;
    name: string;
    description: string;
    creationTime: Time;
    subscriberCount: bigint;
}
export type VideoId = string;
export interface UserProfile {
    bio: string;
    name: string;
    banner: ExternalBlob;
    avatar: ExternalBlob;
}
export enum Category {
    music = "music",
    other = "other",
    news = "news",
    education = "education",
    gaming = "gaming",
    sports = "sports",
    comedy = "comedy"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(videoId: VideoId, text: string): Promise<CommentId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createChannel(name: string, description: string): Promise<ChannelId>;
    getAllChannels(): Promise<Array<Channel>>;
    getAllVideos(): Promise<Array<Video>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCommentsByVideoId(videoId: VideoId): Promise<Array<Comment>>;
    getMyChannel(): Promise<Channel | null>;
    getMyVideos(): Promise<Array<Video>>;
    getSubscribers(channelId: ChannelId): Promise<Array<Principal>>;
    getSubscriptionCount(channelId: ChannelId): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideoById(videoId: VideoId): Promise<Video | null>;
    incrementViews(videoId: VideoId): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    likeDislikeVideo(videoId: VideoId, like: boolean): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    subscribe(channelId: ChannelId): Promise<void>;
    unsubscribe(channelId: ChannelId): Promise<void>;
    updateMyChannel(name: string, description: string): Promise<void>;
    uploadVideo(title: string, description: string, tags: Array<string>, category: Category, thumbnail: ExternalBlob, videoFile: ExternalBlob, isShort: boolean): Promise<VideoId>;
}
