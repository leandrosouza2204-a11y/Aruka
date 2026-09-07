import { useMemo, useState } from "react";
import { AlertCircle, Play, RefreshCcw, X } from "lucide-react";
import { getStudentExerciseMediaSignedUrl } from "../../../services/studentDailyExperienceService.js";
import { parseStudentExerciseMedia } from "../utils/exerciseVideoProvider.js";

function ExerciseVideoPlayer({ title = "exercício", videoUrl, media, treinoExercicioId }) {
  const video = useMemo(() => parseStudentExerciseMedia(media, videoUrl), [media, videoUrl]);
  const [open, setOpen] = useState(false);
  const [signedUrl, setSignedUrl] = useState("");
  const [mediaStatus, setMediaStatus] = useState("idle");

  if (!video) return null;

  async function loadUploadedVideo() {
    if (video.type !== "uploaded_video" || !treinoExercicioId || mediaStatus === "loading") return;
    setMediaStatus("loading");
    setSignedUrl("");
    try {
      const result = await getStudentExerciseMediaSignedUrl(treinoExercicioId);
      setSignedUrl(result.signedUrl);
      setMediaStatus("ready");
    } catch {
      setMediaStatus("error");
    }
  }

  function toggleOpen() {
    setOpen((current) => {
      const next = !current;
      if (next && video.type === "uploaded_video" && !signedUrl) {
        window.setTimeout(loadUploadedVideo, 0);
      }
      return next;
    });
  }

  return (
    <div style={styles.wrapper} data-testid="exercise-video-player">
      <button
        type="button"
        style={styles.button}
        onClick={toggleOpen}
        data-testid="exercise-video-toggle"
        aria-expanded={open}
      >
        {open ? <X size={16} /> : <Play size={16} />}
        {open ? "Ocultar demonstração" : "Ver demonstração"}
      </button>
      {open && (
        video.type === "uploaded_video" ? (
          <div style={styles.frameBox} data-testid="exercise-uploaded-video-frame">
            {mediaStatus === "loading" && (
              <div aria-live="polite" style={styles.mediaState} data-testid="exercise-media-loading">
                <RefreshCcw size={18} />
                Carregando vídeo...
              </div>
            )}
            {mediaStatus === "error" && (
              <div aria-live="assertive" style={styles.mediaState} data-testid="exercise-media-error">
                <AlertCircle size={18} />
                <span>Não foi possível carregar o vídeo deste exercício.</span>
                <button type="button" style={styles.retryButton} onClick={loadUploadedVideo} data-testid="exercise-media-retry">
                  <RefreshCcw size={15} />
                  Tentar novamente
                </button>
              </div>
            )}
            {mediaStatus === "ready" && signedUrl && (
              <video
                controls
                controlsList="nodownload"
                data-testid="exercise-uploaded-video"
                preload="metadata"
                src={signedUrl}
                style={styles.iframe}
                title={`Demonstração de ${title}`}
              />
            )}
          </div>
        ) : (
          <div style={styles.frameBox} data-testid="exercise-video-frame">
            <iframe
              title={`Demonstração de ${title}`}
              src={video.embedUrl}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={styles.iframe}
            />
          </div>
        )
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: "grid",
    gap: 10,
    margin: "10px 0 12px",
  },
  button: {
    alignItems: "center",
    alignSelf: "start",
    background: "#fff",
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    color: "#174ea6",
    cursor: "pointer",
    display: "inline-flex",
    fontWeight: 800,
    gap: 8,
    minHeight: 40,
    padding: "0 14px",
  },
  frameBox: {
    aspectRatio: "16 / 9",
    background: "#0f172a",
    border: "1px solid #dbe3ef",
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
  },
  mediaState: {
    alignItems: "center",
    color: "#e5e7eb",
    display: "grid",
    gap: 10,
    height: "100%",
    justifyItems: "center",
    padding: 16,
    textAlign: "center",
  },
  retryButton: {
    alignItems: "center",
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    color: "#174ea6",
    cursor: "pointer",
    display: "inline-flex",
    fontWeight: 800,
    gap: 6,
    minHeight: 38,
    padding: "0 12px",
  },
  iframe: {
    border: 0,
    display: "block",
    height: "100%",
    width: "100%",
  },
};

export default ExerciseVideoPlayer;
