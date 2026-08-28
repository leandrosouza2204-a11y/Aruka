import { useMemo, useState } from "react";
import { Play, X } from "lucide-react";
import { parseExerciseVideoUrl } from "../utils/exerciseVideoProvider.js";

function ExerciseVideoPlayer({ title = "exercício", videoUrl }) {
  const video = useMemo(() => parseExerciseVideoUrl(videoUrl), [videoUrl]);
  const [open, setOpen] = useState(false);

  if (!video) return null;

  return (
    <div style={styles.wrapper} data-testid="exercise-video-player">
      <button
        type="button"
        style={styles.button}
        onClick={() => setOpen((current) => !current)}
        data-testid="exercise-video-toggle"
        aria-expanded={open}
      >
        {open ? <X size={16} /> : <Play size={16} />}
        {open ? "Ocultar execução" : "Ver execução"}
      </button>
      {open && (
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
  iframe: {
    border: 0,
    display: "block",
    height: "100%",
    width: "100%",
  },
};

export default ExerciseVideoPlayer;
