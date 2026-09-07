const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com"]);
const SAFE_MEDIA_PATH_PATTERN = /^[0-9a-f-]{36}\/exercises\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(mp4|webm)$/i;

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

export function parseStudentExerciseMedia(media = {}, fallbackVideoUrl = "") {
  if (media?.type === "youtube") {
    const videoId = String(media.videoId || media.video_id || "").trim();
    const parsed = videoId && YOUTUBE_ID_PATTERN.test(videoId)
      ? {
          provider: "youtube",
          videoId,
          canonicalUrl: `https://www.youtube.com/watch?v=${videoId}`,
          embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
        }
      : parseExerciseVideoUrl(media.youtubeUrl || media.youtube_url || fallbackVideoUrl);
    return parsed ? { type: "youtube", ...parsed } : null;
  }

  if (media?.type === "uploaded_video") {
    const mediaPath = String(media.mediaPath || media.media_path || "").trim();
    if (mediaPath && !SAFE_MEDIA_PATH_PATTERN.test(mediaPath)) return null;
    return {
      type: "uploaded_video",
      mediaPath,
      mimeType: String(media.mimeType || media.mime_type || "video/mp4").trim() || "video/mp4",
    };
  }

  return parseExerciseVideoUrl(fallbackVideoUrl);
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
