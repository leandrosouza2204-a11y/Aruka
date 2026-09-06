const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com"]);

export const YOUTUBE_MEDIA_ERRORS = {
  EMPTY: "EMPTY",
  INVALID_FORMAT: "INVALID_FORMAT",
  UNSUPPORTED_HOST: "UNSUPPORTED_HOST",
  INVALID_VIDEO_ID: "INVALID_VIDEO_ID",
};

export function parseYouTubeMediaInput(value) {
  const raw = String(value || "").trim();
  if (!raw) return failure(YOUTUBE_MEDIA_ERRORS.EMPTY);

  if (YOUTUBE_ID_PATTERN.test(raw)) return success(raw);
  if (/[<>"'`\s]/.test(raw)) return failure(YOUTUBE_MEDIA_ERRORS.INVALID_FORMAT);

  const url = parseUrl(raw);
  if (!url) return failure(YOUTUBE_MEDIA_ERRORS.INVALID_FORMAT);
  if (!["http:", "https:"].includes(url.protocol)) {
    return failure(YOUTUBE_MEDIA_ERRORS.INVALID_FORMAT);
  }

  const host = url.hostname.toLowerCase();
  const videoId = extractYouTubeVideoId(url, host);
  if (videoId === null) return failure(YOUTUBE_MEDIA_ERRORS.UNSUPPORTED_HOST);
  if (!YOUTUBE_ID_PATTERN.test(videoId)) return failure(YOUTUBE_MEDIA_ERRORS.INVALID_VIDEO_ID);

  return success(videoId);
}

export function normalizeYouTubeMediaInput(value) {
  const result = parseYouTubeMediaInput(value);
  return result.ok ? result.media : null;
}

export function getYouTubeMediaErrorMessage(error) {
  if (error === YOUTUBE_MEDIA_ERRORS.EMPTY) return "";
  if (error === YOUTUBE_MEDIA_ERRORS.UNSUPPORTED_HOST) return "Use um link do YouTube ou youtu.be.";
  if (error === YOUTUBE_MEDIA_ERRORS.INVALID_VIDEO_ID) {
    return "Informe um link ou ID de vídeo válido do YouTube.";
  }
  return "Não cole iframes, HTML ou links inseguros.";
}

function parseUrl(raw) {
  try {
    return new URL(raw);
  } catch {
    try {
      return new URL(`https://${raw}`);
    } catch {
      return null;
    }
  }
}

function extractYouTubeVideoId(url, host) {
  if (host === "youtu.be") return firstPathSegment(url);
  if (!YOUTUBE_HOSTS.has(host)) return null;

  if (url.pathname === "/watch") return url.searchParams.get("v") || "";

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts[0] === "shorts" || parts[0] === "embed") return parts[1] || "";

  return "";
}

function success(videoId) {
  return {
    ok: true,
    error: null,
    message: "",
    media: {
      type: "youtube",
      videoId,
      canonicalUrl: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    },
  };
}

function failure(error) {
  return {
    ok: false,
    error,
    message: getYouTubeMediaErrorMessage(error),
    media: null,
  };
}

function firstPathSegment(url) {
  return url.pathname.split("/").filter(Boolean)[0] || "";
}
