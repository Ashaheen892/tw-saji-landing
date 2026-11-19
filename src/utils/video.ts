import { unwrapValue } from "./config.js";

const held = new WeakSet<HTMLMediaElement>();
const hushed = new WeakSet<HTMLIFrameElement>();

export function clipUrl(value: unknown): string {
  const raw = unwrapValue(value);
  if (typeof raw === "string") return raw.trim();
  if (raw && typeof raw === "object") {
    const url = (raw as { url?: unknown; src?: unknown }).url ?? (raw as { src?: unknown }).src;
    if (typeof url === "string") return url.trim();
  }
  return "";
}

export function isFileClip(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(url);
}

function kindOf(url: string): "youtube" | "vimeo" | "file" | "other" {
  if (isFileClip(url)) return "file";
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host === "youtu.be" || host.includes("youtube.com") || host.includes("youtube-nocookie.com")) return "youtube";
    if (host.includes("vimeo.com")) return "vimeo";
  } catch {
    /* keep the raw address */
  }
  return "other";
}

/** Embed address. Silent autoplay asks YouTube for mute and Vimeo for muted. */
export function frameSrc(url: string, silent: boolean, clean = false): string {
  let frame = url;
  const kind = kindOf(url);
  try {
    const parsed = new URL(url);
    if (kind === "youtube") {
      const host = parsed.hostname.replace(/^www\./, "");
      let id = "";
      if (host === "youtu.be") id = parsed.pathname.split("/").filter(Boolean)[0] || "";
      else if (parsed.pathname.includes("/embed/")) id = parsed.pathname.split("/embed/")[1]?.split("/")[0] || "";
      else if (parsed.pathname.includes("/shorts/")) id = parsed.pathname.split("/shorts/")[1]?.split("/")[0] || "";
      else id = parsed.searchParams.get("v") || "";
      if (id) frame = `https://www.youtube-nocookie.com/embed/${id}`;
    } else if (kind === "vimeo") {
      const id = parsed.pathname.split("/").filter(Boolean).pop() || "";
      if (/^\d+$/.test(id)) frame = `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    frame = url;
  }
  if (!silent || kind === "file") return frame;
  const params = new URLSearchParams();
  params.set("autoplay", "1");
  params.set("playsinline", "1");
  if (kind === "youtube") {
    params.set("mute", "1");
    params.set("rel", "0");
    params.set("enablejsapi", "1");
    if (clean) params.set("controls", "0");
  } else if (kind === "vimeo") {
    params.set("muted", "1");
    if (clean) {
      params.set("controls", "0");
      params.set("loop", "1");
      params.set("title", "0");
      params.set("byline", "0");
      params.set("portrait", "0");
    }
  } else {
    params.set("mute", "1");
    params.set("muted", "1");
  }
  return `${frame}${frame.includes("?") ? "&" : "?"}${params.toString()}`;
}

function muteFrame(frame: HTMLIFrameElement): void {
  const src = frame.src || "";
  const win = frame.contentWindow;
  if (!win) return;
  if (src.includes("youtube")) {
    win.postMessage(JSON.stringify({ event: "command", func: "mute", args: "" }), "*");
    win.postMessage(JSON.stringify({ event: "command", func: "setVolume", args: [0] }), "*");
  } else if (src.includes("vimeo")) {
    win.postMessage(JSON.stringify({ method: "setVolume", value: 0 }), "*");
  }
}

function unmuteFrame(frame: HTMLIFrameElement): void {
  const src = frame.src || "";
  const win = frame.contentWindow;
  if (!win) return;
  if (src.includes("youtube")) {
    win.postMessage(JSON.stringify({ event: "command", func: "unMute", args: "" }), "*");
    win.postMessage(JSON.stringify({ event: "command", func: "setVolume", args: [100] }), "*");
  } else if (src.includes("vimeo")) {
    win.postMessage(JSON.stringify({ method: "setVolume", value: 1 }), "*");
  }
}

/** Keep a file silent until the visitor presses the player. */
export function holdSilence(video: HTMLMediaElement): void {
  if (video.dataset.rwSound === "on") return;
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  if (!held.has(video)) {
    held.add(video);
    const lock = () => {
      if (video.dataset.rwSound === "on") return;
      video.muted = true;
      video.volume = 0;
    };
    video.addEventListener("play", lock);
    video.addEventListener("volumechange", lock);
    video.addEventListener("pointerdown", () => {
      video.dataset.rwSound = "on";
      held.delete(video);
    }, { once: true });
  }
  if (video.paused) void video.play().catch(() => undefined);
}

/** Ask an embed to stay silent while its player is still starting. */
export function holdFrameSilence(frame: HTMLIFrameElement): void {
  if (frame.dataset.rwSound === "on" || hushed.has(frame)) return;
  hushed.add(frame);
  const send = () => {
    if (frame.dataset.rwSound !== "on") muteFrame(frame);
  };
  frame.addEventListener("load", send);
  window.setTimeout(send, 400);
  window.setTimeout(send, 1400);
  window.setTimeout(send, 2500);
  send();
}

export function releaseSound(root: ParentNode): void {
  root.querySelectorAll("video").forEach((video) => {
    video.dataset.rwSound = "on";
    held.delete(video);
    video.muted = false;
    video.volume = 1;
    void video.play().catch(() => undefined);
  });
  root.querySelectorAll("iframe").forEach((frame) => {
    frame.dataset.rwSound = "on";
    hushed.delete(frame);
    unmuteFrame(frame);
  });
}

export function settleSilence(root: ParentNode): void {
  root.querySelectorAll("video").forEach((video) => holdSilence(video));
  root.querySelectorAll("iframe").forEach((frame) => holdFrameSilence(frame));
}

export function hushRoot(root: ParentNode): void {
  root.querySelectorAll("video").forEach((video) => {
    delete video.dataset.rwSound;
    held.delete(video);
    holdSilence(video);
  });
  root.querySelectorAll("iframe").forEach((frame) => {
    delete frame.dataset.rwSound;
    hushed.delete(frame);
    holdFrameSilence(frame);
  });
}
