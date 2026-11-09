import type { RefObject } from "react";
import { fmt, fmtTime } from "../../api";
import {
  IChevR, IChevronDown, IChevronUp, ICommentF, IExpand, IHeart, IHeartF, ILink, IList, IStar, IStarF,
} from "../../icons";

/* 右侧操作栏（移动端）：收藏 / 评论 / 全屏 / 分享
   颜色写死不跟主题走：浅色主题下这些字必须仍是白色 */
export function MobileSideActions({ bottomInset, faved, onFav, onComments, onFullscreen, onShare }: {
  bottomInset: number;
  faved: boolean;
  onFav: () => void;
  onComments: () => void;
  onFullscreen: () => void;
  onShare: () => void;
}) {
  return (
    <div className="absolute right-3 z-20 flex flex-col items-center gap-[16px]"
      style={{ bottom: `calc(var(--sab, 0px) + ${bottomInset + 92}px)` }}>
      <button onClick={onFav} className="flex flex-col items-center gap-1 pressable" aria-pressed={faved} aria-label="收藏">
        {faved ? <IStarF size={27} className="hg-gold" /> : <IStar size={27} className="hg-ink hg-ov-shadow" />}
        <span className="text-[10.5px] hg-ink-2 hg-ov-shadow">收藏</span>
      </button>
      <button onClick={onComments} className="flex flex-col items-center gap-1 pressable" aria-label="评论">
        <ICommentF size={26} className="hg-ink hg-ov-shadow" />
        <span className="text-[10.5px] hg-ink-2 hg-ov-shadow">评论</span>
      </button>
      <button onClick={onFullscreen} className="flex flex-col items-center gap-1 pressable" aria-label="全屏">
        <IExpand size={26} className="hg-ink hg-ov-shadow" />
        <span className="text-[10.5px] hg-ink-2 hg-ov-shadow">全屏</span>
      </button>
      <button onClick={onShare} className="flex flex-col items-center gap-1 pressable" aria-label="分享">
        <ILink size={25} className="hg-ink hg-ov-shadow" />
        <span className="text-[10.5px] hg-ink-2 hg-ov-shadow">分享</span>
      </button>
    </div>
  );
}

/* 右侧操作栏（桌面） */
export function DesktopSideActions({
  index, total, kind, liked, faved, heartBurst, likeCount, commentCount, collectCount,
  onPrev, onNext, onLike, onFav, onComments, onEpisodes, onShare,
}: {
  index: number;
  total: number;
  kind: "video" | "post";
  liked: boolean;
  faved: boolean;
  heartBurst: number;
  likeCount: number;
  commentCount: number;
  collectCount: number;
  onPrev: () => void;
  onNext: () => void;
  onLike: () => void;
  onFav: () => void;
  onComments: () => void;
  onEpisodes: () => void;
  onShare: () => void;
}) {
  return (
    <div className="absolute z-20 flex flex-col items-center desktop-social">
      <div className="desktop-browse-inline">
        <button onClick={onPrev} disabled={index === 0} aria-label="上一个" title="上一个 ↑">
          <IChevronUp size={19} strokeWidth={1.8} />
        </button>
        <button onClick={onNext} disabled={index >= total - 1} aria-label="下一个" title="下一个 ↓">
          <IChevronDown size={19} strokeWidth={1.8} />
        </button>
        <small>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</small>
      </div>

      {kind === "video" && (
        <>
          <button onClick={onLike} className="flex flex-col items-center gap-1 pressable" aria-pressed={liked}>
            <span key={heartBurst} className={heartBurst ? "a-pop" : ""}>
              {liked ? <IHeartF size={30} className="text-neon" /> : <IHeart size={30} className="text-white tsh" />}
            </span>
            <span className="text-[10.5px] text-white/90 tabular-nums">{fmt(likeCount)}</span>
          </button>

          <button onClick={onComments} className="flex flex-col items-center gap-1 pressable">
            <ICommentF size={27} className="text-white tsh" />
            <span className="text-[10.5px] text-white/90 tabular-nums">{fmt(commentCount)}</span>
          </button>

          <button onClick={onFav} className="flex flex-col items-center gap-1 pressable" aria-pressed={faved}>
            {faved ? <IStarF size={27} className="hg-gold" /> : <IStar size={27} className="hg-ink hg-ov-shadow" />}
            <span className="text-[10.5px] text-white/90 tabular-nums">{fmt(collectCount)}</span>
          </button>

          <button onClick={onEpisodes} className="flex flex-col items-center gap-1 pressable">
            <IList size={26} className="text-white tsh" />
            <span className="text-[10.5px] text-white/90">选集</span>
          </button>
        </>
      )}

      <button onClick={onShare} className="flex flex-col items-center gap-1 pressable">
        <ILink size={25} className="text-white tsh" />
        <span className="text-[10.5px] text-white/90">分享</span>
      </button>
    </div>
  );
}

/* 桌面：左下信息 */
export function DesktopVideoMeta({ author, episodeCount, curEp, score, title, desc, descOpen, onToggleDesc }: {
  author: string;
  episodeCount: number;
  curEp: number;
  score: number;
  title: string;
  desc: string;
  descOpen: boolean;
  onToggleDesc: () => void;
}) {
  return (
    <div className="desktop-video-meta">
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-bold text-white tsh truncate">@{author}</span>
        {episodeCount > 0 && (
          <span className="shrink-0 px-1.5 py-px rounded-md text-[10px] font-bold text-white"
            style={{ background: "rgba(255,255,255,.16)" }}>
            第 {curEp}/{episodeCount} 集
          </span>
        )}
        {!!score && (
          <span className="shrink-0 text-[11px] font-bold hg-gold hg-ov-shadow">{score.toFixed(1)} 分</span>
        )}
      </div>

      <p className="mt-1 text-[13.5px] leading-snug hg-ink-2 hg-ov-shadow clamp-2">{title}</p>

      {/* 描述（单行，点开展开） */}
      <button onClick={onToggleDesc} className="mt-1 text-left w-full pressable group">
        <p className={`text-[11.5px] leading-relaxed hg-ink-4 ${descOpen ? "" : "clamp-1"}`}>
          {desc || "暂无简介"}
        </p>
        <span className="text-[10.5px] hg-link font-semibold">{descOpen ? "收起" : "展开简介"}</span>
      </button>
    </div>
  );
}

/* 移动端：标题 + 详情标签 + 进度线（不加底色，只铺一层柔和压暗保证可读） */
export function MobileBottomInfo({
  bottomInset, title, curEp, duration, barRef, barPct, barProgress, onDetail, onBarDown, onBarMove, onBarUp,
}: {
  bottomInset: number;
  title: string;
  curEp: number;
  duration: number;
  barRef: RefObject<HTMLDivElement | null>;
  barPct: number | null;
  barProgress: number;
  onDetail: () => void;
  onBarDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onBarMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onBarUp: (e: React.PointerEvent<HTMLDivElement>) => void;
}) {
  return (
    <div className="absolute inset-x-0 z-20" style={{ bottom: `calc(var(--sab, 0px) + ${bottomInset}px)` }}>
      <div className="absolute inset-x-0 bottom-0 h-[190px] pointer-events-none"
        style={{ background: "linear-gradient(0deg, rgba(0,0,0,.82) 0%, rgba(0,0,0,.42) 45%, transparent 100%)" }} />
      <p className="relative px-4 pb-2 text-[14px] font-semibold leading-snug hg-ink hg-ov-shadow clamp-2">{title}</p>
      <div className="relative pt-1.5 pb-2.5">
        <button onClick={onDetail}
          className="px-4 flex items-center gap-0.5 text-[10.5px] font-medium hg-ink hg-ov-shadow pressable">
          详情 · 第 {curEp} 集<IChevR size={11} />
        </button>
        <div ref={barRef} className="mx-4 mt-2 relative" style={{ height: 14, touchAction: "none" }}
          onPointerDown={onBarDown} onPointerMove={onBarMove} onPointerUp={onBarUp} onPointerCancel={onBarUp}>
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2.5px] rounded-full" style={{ background: "rgba(255,255,255,.3)" }}>
            <div className="h-full rounded-full bg-white"
              style={{ width: `${barProgress * 100}%`, transition: barPct !== null ? "none" : "width .25s linear" }} />
          </div>
          {barPct !== null && (
            <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2.5 py-1 rounded-md hg-chip-strong backdrop-blur-md text-[12px] font-bold tabular-nums whitespace-nowrap">
              {fmtTime(barPct * (duration || 0))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
