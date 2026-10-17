"use client";

import { useEffect, useState } from "react";
import { formatDue, type Project } from "@/lib/projects";

type Mode = "view" | "edit";

export function ProjectSheet({
  project,
  initialMode,
  openRequest,
  onClose,
  onSave,
  onDelete,
}: {
  project: Project;
  initialMode: Mode;
  openRequest: number;
  onClose: () => void;
  onSave: (project: Project) => void;
  onDelete: (id: string) => void;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [closing, setClosing] = useState(false);
  const [draft, setDraft] = useState({
    name: project.name,
    client: project.client,
    owner: project.owner,
    due: project.due,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setMode(initialMode);
    setError("");
  }, [initialMode, openRequest]);

  useEffect(() => {
    setDraft({
      name: project.name,
      client: project.client,
      owner: project.owner,
      due: project.due,
    });
  }, [project]);

  function requestClose() {
    setClosing(true);
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function finishClose(event: React.AnimationEvent<HTMLElement>) {
    if (!closing || event.target !== event.currentTarget) return;
    if (event.animationName !== "sheet-out") return;
    onClose();
  }

  function save() {
    const name = draft.name.trim();
    const client = draft.client.trim();
    const owner = draft.owner.trim();
    if (!name || !client || !owner || !draft.due) {
      setError("Add a name, client, owner, and due date.");
      return;
    }
    onSave({ ...project, name, client, owner, due: draft.due });
    setError("");
    setMode("view");
  }

  function cancelEdit() {
    setDraft({
      name: project.name,
      client: project.client,
      owner: project.owner,
      due: project.due,
    });
    setError("");
    setMode("view");
  }

  const motion = closing ? " is-closing" : "";

  return (
    <>
      <button
        type="button"
        className={`sheet-backdrop${motion}`}
        aria-label="Close project details"
        onClick={requestClose}
      />
      <aside
        className={`sheet${motion}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        onAnimationEnd={finishClose}
      >
        <header className="sheet-head">
          <p className="sheet-id">{project.id}</p>
          <button type="button" className="sheet-close" onClick={requestClose}>
            Close
          </button>
        </header>
        <div key={mode} className="sheet-panel">
          {mode === "view" ? (
            <>
              <div className="sheet-title-row">
                <h2 id="sheet-title">{project.name}</h2>
              </div>
              <dl className="sheet-details">
                <div>
                  <dt>Client</dt>
                  <dd>{project.client}</dd>
                </div>
                <div>
                  <dt>Owner</dt>
                  <dd>{project.owner}</dd>
                </div>
                <div>
                  <dt>Due</dt>
                  <dd>
                    <time dateTime={project.due}>{formatDue(project.due)}</time>
                  </dd>
                </div>
              </dl>
              <footer className="sheet-actions">
                <button type="button" className="sheet-edit" onClick={() => setMode("edit")}>
                  Edit
                </button>
                <button
                  type="button"
                  className="sheet-delete"
                  onClick={() => onDelete(project.id)}
                >
                  Delete
                </button>
              </footer>
            </>
          ) : (
            <form
              className="sheet-form"
              onSubmit={(event) => {
                event.preventDefault();
                save();
              }}
            >
              <h2 id="sheet-title" className="sheet-editing-label">
                Edit project
              </h2>
              <label className="sheet-field">
                Name
                <input
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, name: event.target.value }))
                  }
                  autoFocus
                />
              </label>
              <label className="sheet-field">
                Client
                <input
                  value={draft.client}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, client: event.target.value }))
                  }
                />
              </label>
              <label className="sheet-field">
                Owner
                <input
                  value={draft.owner}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, owner: event.target.value }))
                  }
                />
              </label>
              <label className="sheet-field">
                Due
                <input
                  type="date"
                  value={draft.due}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, due: event.target.value }))
                  }
                />
              </label>
              {error ? <p className="sheet-error">{error}</p> : null}
              <footer className="sheet-footer">
                <button type="button" className="sheet-close" onClick={cancelEdit}>
                  Cancel
                </button>
                <button type="submit" className="add-project">
                  Save
                </button>
              </footer>
            </form>
          )}
        </div>
      </aside>
    </>
  );
}
