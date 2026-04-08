import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// These types mirror what the backend would export if it had video storage.
// The game is fully offline/localStorage-based so all hooks return empty data.
export interface Video {
  id: string;
  title: string;
  views: bigint;
  likes: bigint;
  dislikes: bigint;
  description: string;
  creator: string;
  thumbnail: { getDirectURL: () => string } | null;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  subscriberCount: bigint;
}

export interface Comment {
  id: string;
  videoId: string;
  text: string;
  authorName: string;
}

export function useGetAllVideos() {
  return useQuery<Video[]>({
    queryKey: ["videos"],
    queryFn: async () => [],
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useGetVideoById(videoId: string | null) {
  return useQuery<Video | null>({
    queryKey: ["video", videoId],
    queryFn: async () => null,
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!videoId,
  });
}

export function useGetComments(videoId: string | null) {
  return useQuery<Comment[]>({
    queryKey: ["comments", videoId],
    queryFn: async () => [],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!videoId,
  });
}

export function useGetMyChannel() {
  return useQuery<Channel | null>({
    queryKey: ["myChannel"],
    queryFn: async () => null,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useGetAllChannels() {
  return useQuery<Channel[]>({
    queryKey: ["channels"],
    queryFn: async () => [],
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useIncrementViews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_videoId: string) => {},
    onSuccess: (_, videoId) => {
      qc.invalidateQueries({ queryKey: ["video", videoId] });
      qc.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

export function useLikeDislike() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_args: { videoId: string; like: boolean }) => {},
    onSuccess: (_, { videoId }) => {
      qc.invalidateQueries({ queryKey: ["video", videoId] });
    },
  });
}

export function useAddComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_args: { videoId: string; text: string }) => {},
    onSuccess: (_, { videoId }) => {
      qc.invalidateQueries({ queryKey: ["comments", videoId] });
    },
  });
}

export function useCreateChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_args: { name: string; description: string }) => {},
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myChannel"] });
    },
  });
}

export function useSubscribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_channelId: string) => {},
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["channels"] });
    },
  });
}

export function useUnsubscribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_channelId: string) => {},
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["channels"] });
    },
  });
}
