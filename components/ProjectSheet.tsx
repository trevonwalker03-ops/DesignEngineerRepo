"use client";

import { useEffect, useRef } from "react";
import { formatDue, type Project } from "@/lib/projects";

export function ProjectSheet({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project.id, onClose]);

  return (
    <>
      <button
        type="button"
        className="sheet-backdrop"
        aria-label="Close project details"
        onClick={onClose}
      />
      <aside
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
      >
        <header className="sheet-head">
          <p className="sheet-id">{project.id}</p>
          <button
            ref={closeRef}
            type="button"
            className="sheet-close"
            onClick={onClose}
          >
            Close
          </button>
        </header>
        <h2 id="sheet-title">{project.name}</h2>
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
      </aside>
    </>
  );
}
