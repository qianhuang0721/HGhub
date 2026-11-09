import type { Episode } from "../../types";
import { fmt } from "../../api";
import { Avatar, Img, Sheet } from "../ui";
import { ArticlePanel, CommentsPanel, EpisodesPanel } from "../Panels";
import { IClose } from "../../icons";
import type { FeedMeta, FeedPanel } from "./types";

type Props = {
  isDesktop: boolean;
  panel: FeedPanel | null;
  /** 切换到指定面板（详情/选集 tab） */
  onPanel: (p: FeedPanel) => void;
  onClose: () => void;
  curId: number;
  curEp: number;
  kind: "video" | "post";
  episodes: Episode[];
  meta: FeedMeta;
  articleHtml: string;
  postHot: number | undefined;
  follows: number[];
  onPick: (ep: number) => void;
  onFollow: () => void;
};

/* 选集 / 评论：桌面停靠在右侧（画面让位），移动端底部弹层 */
export default function FeedPanels({
  isDesktop, panel, onPanel, onClose, curId, curEp, kind, episodes, meta, articleHtml, postHot, follows, onPick, onFollow,
}: Props) {
  return isDesktop ? (
    <div className={`desktop-dock-panel ${panel ? "is-open" : ""}`}>
      <div className="desktop-dock-inner">
        {panel === "episodes" ? (
          <EpisodesPanel videoId={curId} episodes={episodes} current={curEp} onPick={onPick} onClose={onClose} />
        ) : panel === "comments" ? (
          <CommentsPanel videoId={curId} ep={curEp} total={meta.comment} kind={kind} onClose={onClose} />
        ) : null}
      </div>
    </div>
  ) : (
    <>
      {/* 评论：移动端底部弹层（右侧操作栏「评论」入口） */}
      <Sheet open={panel === "comments"} onClose={onClose}>
        <div className="flex flex-col" style={{ height: "72vh" }}>
          <CommentsPanel videoId={curId} ep={curEp} total={meta.comment} kind={kind} onClose={onClose} />
        </div>
      </Sheet>

      {/* 吃瓜图文正文 */}
      <Sheet open={panel === "article"} onClose={onClose}>
        <div className="flex flex-col" style={{ height: "78vh" }}>
          <ArticlePanel title={meta.title} html={articleHtml} cover={meta.cover} hot={postHot} onClose={onClose} />
        </div>
      </Sheet>

      <Sheet open={panel === "detail" || panel === "episodes"} onClose={onClose}>
        <div className="flex flex-col" style={{ height: "72vh" }}>
          {/* 双栏抽屉：详情 / 选集 */}
          <div className="shrink-0 flex items-center gap-2 px-4 pb-2">
            <div className="flex flex-1 bg-s3 rounded-(--r-ctl) p-1">
              {([["detail", "详情"], ["episodes", "选集"]] as const).map(([k, l]) => (
                <button key={k} onClick={() => onPanel(k)}
                  className={`flex-1 h-8 rounded-(--r-ctl) text-[12px] font-semibold pressable ${panel === k ? "text-on-sec" : "text-mut"}`}
                  style={panel === k ? { background: "var(--p-sec)", color: "var(--p-primary)" } : undefined}>{l}</button>
              ))}
            </div>
            <button onClick={onClose} aria-label="关闭"
              className="w-8 h-8 rounded-full bg-s3 flex items-center justify-center text-mut pressable">
              <IClose size={14} />
            </button>
          </div>

          <div className="flex-1 min-h-0">
            {panel === "episodes" ? (
              <EpisodesPanel bare videoId={curId} episodes={episodes} current={curEp} onPick={onPick} onClose={onClose} />
            ) : (
              <div className="h-full scroll-y px-4 pb-5">
                {/* 封面 / 标题 / 评分 / 数据 */}
                <div className="flex gap-3">
                  <div className="relative w-[84px] shrink-0 rounded-(--r-sm) overflow-hidden bg-s3" style={{ aspectRatio: "3 / 4" }}>
                    <Img src={meta.cover} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-bold text-on leading-snug clamp-2">{meta.title}</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      {!!meta.score && <span className="text-[12px] font-bold text-amber">{meta.score.toFixed(1)} 分</span>}
                      {episodes.length > 0 && <span className="text-[10.5px] text-mut">共 {episodes.length} 集</span>}
                    </div>
                    <div className="flex gap-3 mt-2 text-[10.5px] text-mut">
                      <span>点赞 {fmt(meta.like)}</span>
                      <span>收藏 {fmt(meta.collect)}</span>
                      <span>评论 {fmt(meta.comment)}</span>
                    </div>
                  </div>
                </div>

                {/* 作者 + 关注 */}
                <div className="mt-4 flex items-center gap-2.5 rounded-(--r-md) bg-s2 p-2.5">
                  <Avatar size={34} name={meta.author} hue={220} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-semibold text-on truncate">{meta.author}</div>
                    <div className="text-[10px] text-mut">作者</div>
                  </div>
                  {meta.authorId > 0 && (
                    <button onClick={onFollow}
                      className={`h-7 px-3 rounded-full text-[11px] font-semibold pressable ${follows.includes(meta.authorId) ? "bg-s3 text-mut" : "bg-primary text-on-primary"}`}>
                      {follows.includes(meta.authorId) ? "已关注" : "+ 关注"}
                    </button>
                  )}
                </div>

                {/* 简介 */}
                <div className="mt-4">
                  <div className="text-[11px] font-semibold text-dim mb-1.5">简介</div>
                  <p className="text-[11.5px] leading-relaxed text-mut whitespace-pre-wrap">{meta.desc || "暂无简介"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Sheet>
    </>
  );
}
