import type { Episode } from "../../types";

/** 统一视图模型：短剧与吃瓜帖子共用同一套播放界面 */
export type FeedMeta = {
  title: string;
  cover: string;
  desc: string;
  author: string;
  authorId: number;
  tags: string[];
  score: number;
  like: number;
  comment: number;
  collect: number;
  episodes: Episode[];
};

export type FeedPanel = "episodes" | "comments" | "article" | "detail";
