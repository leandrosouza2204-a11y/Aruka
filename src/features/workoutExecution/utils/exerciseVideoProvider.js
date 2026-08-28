const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com"]);

export function parseExerciseVideoUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;

  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (!["http:", "https:"].includes(url.protocol)) return null;

  const host = url.hostname.toLowerCase();
  const videoId = extractYoutubeVideoId(url, host);
  if (!videoId || !YOUTUBE_ID_PATTERN.test(videoId)) return null;

  return {
    provider: "youtube",
    videoId,
    canonicalUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
  };
}

function extractYoutubeVideoId(url, host) {
  if (host === "youtu.be") return firstPathSegment(url);
  if (!YOUTUBE_HOSTS.has(host)) return "";

  if (url.pathname === "/watch") return url.searchParams.get("v") || "";
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts[0] === "shorts") return parts[1] || "";
  return "";
}

function firstPathSegment(url) {
  return url.pathname.split("/").filter(Boolean)[0] || "";
}
