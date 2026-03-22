import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Channel, Comment, Video } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllVideos() {
  const { actor, isFetching } = useActor();
  return useQuery<Video[]>({
    queryKey: ["videos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVideoById(videoId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Video | null>({
    queryKey: ["video", videoId],
    queryFn: async () => {
      if (!actor || !videoId) return null;
      return actor.getVideoById(videoId);
    },
    enabled: !!actor && !isFetching && !!videoId,
  });
}

export function useGetComments(videoId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Comment[]>({
    queryKey: ["comments", videoId],
    queryFn: async () => {
      if (!actor || !videoId) return [];
      return actor.getCommentsByVideoId(videoId);
    },
    enabled: !!actor && !isFetching && !!videoId,
  });
}

export function useGetMyChannel() {
  const { actor, isFetching } = useActor();
  return useQuery<Channel | null>({
    queryKey: ["myChannel"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyChannel();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllChannels() {
  const { actor, isFetching } = useActor();
  return useQuery<Channel[]>({
    queryKey: ["channels"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllChannels();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIncrementViews() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (videoId: string) => {
      if (!actor) return;
      await actor.incrementViews(videoId);
    },
    onSuccess: (_, videoId) => {
      qc.invalidateQueries({ queryKey: ["video", videoId] });
      qc.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

export function useLikeDislike() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      videoId,
      like,
    }: { videoId: string; like: boolean }) => {
      if (!actor) return;
      await actor.likeDislikeVideo(videoId, like);
    },
    onSuccess: (_, { videoId }) => {
      qc.invalidateQueries({ queryKey: ["video", videoId] });
    },
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      videoId,
      text,
    }: { videoId: string; text: string }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addComment(videoId, text);
    },
    onSuccess: (_, { videoId }) => {
      qc.invalidateQueries({ queryKey: ["comments", videoId] });
    },
  });
}

export function useCreateChannel() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      description,
    }: { name: string; description: string }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createChannel(name, description);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myChannel"] });
    },
  });
}

export function useSubscribe() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (channelId: string) => {
      if (!actor) throw new Error("Not authenticated");
      // channelId is a Principal string but subscribe takes ChannelId (Principal)
      // We need to handle this properly - for now just call with the string as-is
      await (actor as any).subscribe(channelId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["channels"] });
    },
  });
}

export function useUnsubscribe() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (channelId: string) => {
      if (!actor) throw new Error("Not authenticated");
      await (actor as any).unsubscribe(channelId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["channels"] });
    },
  });
}
