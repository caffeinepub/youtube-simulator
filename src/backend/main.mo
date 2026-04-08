import Text "mo:core/Text";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import AccessControl "mo:caffeineai-authorization/access-control";

import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Storage "mo:caffeineai-object-storage/Storage";

actor {
  type VideoId = Text;
  type ChannelId = Principal;
  type CommentId = Nat;
  type Category = {
    #gaming;
    #education;
    #music;
    #comedy;
    #news;
    #sports;
    #other;
  };

  public type Channel = {
    id : ChannelId;
    name : Text;
    description : Text;
    subscriberCount : Nat;
    videoCount : Nat;
    creationTime : Time.Time;
  };

  public type Video = {
    id : VideoId;
    title : Text;
    description : Text;
    tags : [Text];
    category : Category;
    thumbnail : Storage.ExternalBlob;
    videoFile : Storage.ExternalBlob;
    isShort : Bool;
    creator : ChannelId;
    views : Nat;
    likes : Nat;
    dislikes : Nat;
    watchTime : Nat;
    uploadTime : Time.Time;
  };

  public type Comment = {
    id : CommentId;
    videoId : VideoId;
    author : Principal;
    text : Text;
    likes : Nat;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    bio : Text;
    avatar : Storage.ExternalBlob;
    banner : Storage.ExternalBlob;
  };

  module Video {
    public func compareByTitle(video1 : Video, video2 : Video) : Order.Order {
      Text.compare(video1.title, video2.title);
    };
  };

  module Channel {
    public func compare(channel1 : Channel, channel2 : Channel) : Order.Order {
      Text.compare(channel1.name, channel2.name);
    };
  };

  module Comment {
    public func compareByTimestamp(comment1 : Comment, comment2 : Comment) : Order.Order {
      Int.compare(comment1.timestamp, comment2.timestamp);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinObjectStorage();

  var nextCommentId = 0;

  let channels = Map.empty<ChannelId, Channel>();
  let videos = Map.empty<VideoId, Video>();
  let comments = Map.empty<CommentId, Comment>();
  let channelSubscriptions = Map.empty<ChannelId, Set.Set<Principal>>();
  let videoComments = Map.empty<VideoId, [CommentId]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  func getChannelWithTrap(id : ChannelId) : Channel {
    switch (channels.get(id)) {
      case (null) { Runtime.trap("Channel does not exist") };
      case (?channel) { channel };
    };
  };

  func getVideoWithTrap(id : VideoId) : Video {
    switch (videos.get(id)) {
      case (null) { Runtime.trap("Video does not exist") };
      case (?video) { video };
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Channel management
  public shared ({ caller }) func createChannel(name : Text, description : Text) : async ChannelId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create channels");
    };
    if (channels.containsKey(caller)) { Runtime.trap("Channel already exists") };
    let channelData : Channel = {
      id = caller;
      name;
      description;
      subscriberCount = 0;
      videoCount = 0;
      creationTime = Time.now();
    };
    channels.add(caller, channelData);
    caller;
  };

  public query ({ caller }) func getMyChannel() : async ?Channel {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their channel");
    };
    channels.get(caller);
  };

  public shared ({ caller }) func updateMyChannel(name : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update channels");
    };
    let channel = getChannelWithTrap(caller);
    let updatedChannel = {
      id = channel.id;
      name;
      description;
      subscriberCount = channel.subscriberCount;
      videoCount = channel.videoCount;
      creationTime = channel.creationTime;
    };
    channels.add(caller, updatedChannel);
  };

  public query func getAllChannels() : async [Channel] {
    channels.values().toArray().sort();
  };

  // Video management
  public shared ({ caller }) func uploadVideo(title : Text, description : Text, tags : [Text], category : Category, thumbnail : Storage.ExternalBlob, videoFile : Storage.ExternalBlob, isShort : Bool) : async VideoId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload videos");
    };
    if (title.isEmpty()) { Runtime.trap("Title cannot be empty") };
    let videoId = caller.toText() # "-" # Time.now().toText();
    let video : Video = {
      id = videoId;
      title;
      description;
      tags;
      category;
      thumbnail;
      videoFile;
      isShort;
      creator = caller;
      views = 0;
      likes = 0;
      dislikes = 0;
      watchTime = 0;
      uploadTime = Time.now();
    };
    videos.add(videoId, video);
    videoId;
  };

  public shared ({ caller }) func incrementViews(videoId : VideoId) : async () {
    let video = getVideoWithTrap(videoId);
    let updatedVideo = {
      id = video.id;
      title = video.title;
      description = video.description;
      tags = video.tags;
      category = video.category;
      thumbnail = video.thumbnail;
      videoFile = video.videoFile;
      isShort = video.isShort;
      creator = video.creator;
      views = video.views + 1;
      likes = video.likes;
      dislikes = video.dislikes;
      watchTime = video.watchTime;
      uploadTime = video.uploadTime;
    };
    videos.add(videoId, updatedVideo);
  };

  public shared ({ caller }) func likeDislikeVideo(videoId : VideoId, like : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like/dislike videos");
    };
    let video = getVideoWithTrap(videoId);
    let updatedVideo = {
      id = video.id;
      title = video.title;
      description = video.description;
      tags = video.tags;
      category = video.category;
      thumbnail = video.thumbnail;
      videoFile = video.videoFile;
      isShort = video.isShort;
      creator = video.creator;
      views = video.views;
      likes = if (like) { video.likes + 1 } else { video.likes };
      dislikes = if (not like) { video.dislikes + 1 } else { video.dislikes };
      watchTime = video.watchTime;
      uploadTime = video.uploadTime;
    };
    videos.add(videoId, updatedVideo);
  };

  public query func getAllVideos() : async [Video] {
    videos.values().toArray();
  };

  public query func getVideoById(videoId : VideoId) : async ?Video {
    videos.get(videoId);
  };

  public query ({ caller }) func getMyVideos() : async [Video] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their videos");
    };
    videos.values().toArray().filter(func(v) { v.creator == caller });
  };

  // Comment management
  public shared ({ caller }) func addComment(videoId : VideoId, text : Text) : async CommentId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add comments");
    };
    let _ = getVideoWithTrap(videoId);
    let commentId = nextCommentId;
    let comment : Comment = {
      id = commentId;
      videoId;
      author = caller;
      text;
      likes = 0;
      timestamp = Time.now();
    };
    comments.add(commentId, comment);
    let existingComments = switch (videoComments.get(videoId)) {
      case (null) { [] };
      case (?ids) { ids };
    };
    videoComments.add(videoId, existingComments.concat([commentId]));
    nextCommentId += 1;
    commentId;
  };

  public query func getCommentsByVideoId(videoId : VideoId) : async [Comment] {
    let commentIds = switch (videoComments.get(videoId)) {
      case (null) { [] };
      case (?ids) { ids };
    };
    commentIds.map(
      func(id) {
        switch (comments.get(id)) {
          case (null) { Runtime.trap("Comment does not exist") };
          case (?comment) { comment };
        };
      }
    ).reverse();
  };

  // Subscription management
  public shared ({ caller }) func subscribe(channelId : ChannelId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can subscribe to channels");
    };
    if (not channels.containsKey(channelId)) { Runtime.trap("Channel does not exist") };
    let subscriptions = switch (channelSubscriptions.get(channelId)) {
      case (null) { Set.empty<Principal>() };
      case (?subs) { subs };
    };
    if (subscriptions.contains(caller)) { Runtime.trap("Already subscribed") };
    subscriptions.add(caller);
    channelSubscriptions.add(channelId, subscriptions);
    let channel = getChannelWithTrap(channelId);
    let updatedChannel = {
      id = channel.id;
      name = channel.name;
      description = channel.description;
      subscriberCount = channel.subscriberCount + 1;
      videoCount = channel.videoCount;
      creationTime = channel.creationTime;
    };
    channels.add(channelId, updatedChannel);
  };

  public shared ({ caller }) func unsubscribe(channelId : ChannelId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unsubscribe from channels");
    };
    let channel = getChannelWithTrap(channelId);
    switch (channelSubscriptions.get(channelId)) {
      case (null) { Runtime.trap("Not subscribed") };
      case (?subscriptions) {
        if (not subscriptions.contains(caller)) { Runtime.trap("Not subscribed") };
        subscriptions.remove(caller);
        channelSubscriptions.add(channelId, subscriptions);
        if (channel.subscriberCount > 0) {
          let updatedChannel = {
            id = channel.id;
            name = channel.name;
            description = channel.description;
            subscriberCount = channel.subscriberCount - 1;
            videoCount = channel.videoCount;
            creationTime = channel.creationTime;
          };
          channels.add(channelId, updatedChannel);
        };
      };
    };
  };

  public query func getSubscribers(channelId : ChannelId) : async [Principal] {
    switch (channelSubscriptions.get(channelId)) {
      case (null) { [] };
      case (?subscriptions) { subscriptions.toArray() };
    };
  };

  public query func getSubscriptionCount(channelId : ChannelId) : async Nat {
    switch (channelSubscriptions.get(channelId)) {
      case (null) { 0 };
      case (?subscriptions) { subscriptions.size() };
    };
  };
};
