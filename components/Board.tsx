"use client";

import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { DeleteProjectDialog } from "@/components/DeleteProjectDialog";
import { ProjectSheet } from "@/components/ProjectSheet";
import {
  formatDue,
  projectsInStage,
  stages,
  type Project,
  type Stage,
} from "@/lib/projects";

function stageSlug(stage: Stage) {
  return stage.toLowerCase().replace(/\s+/g, "-");
}

export function Board({
  jobs,
  setJobs,
  onDeleteProject,
}: {
  jobs: Project[];
  setJobs: Dispatch<SetStateAction<Project[]>>;
  onDeleteProject: (id: string) => void;
}) {
  const [overStage, setOverStage] = useState<Stage | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetMode, setSheetMode] = useState<"view" | "edit">("view");
  const [sheetRequest, setSheetRequest] = useState(0);
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    name: string;
    restoreSheet: boolean;
  } | null>(null);
  const dragged = useRef(false);
  const selected = jobs.find((job) => job.id === selectedId) ?? null;
  const closeSheet = useCallback(() => setSelectedId(null), []);

  function moveProject(id: string, stage: Stage) {
    setJobs((current) =>
      current.map((job) => (job.id === id ? { ...job, stage } : job)),
    );
  }

  function onDragStart(event: React.DragEvent<HTMLElement>, id: string) {
    dragged.current = true;
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
  }

  function openProject(id: string, mode: "view" | "edit" = "view") {
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    setSheetMode(mode);
    setSheetRequest((current) => current + 1);
    setSelectedId(id);
  }

  function deleteProject(id: string) {
    onDeleteProject(id);
    setSelectedId((current) => (current === id ? null : current));
  }

  function askDelete(id: string, name: string) {
    const restoreSheet = selectedId === id;
    if (restoreSheet) setSelectedId(null);
    setPendingDelete({ id, name, restoreSheet });
  }

  function cancelDelete() {
    if (pendingDelete?.restoreSheet) {
      setSheetMode("view");
      setSelectedId(pendingDelete.id);
    }
    setPendingDelete(null);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    deleteProject(pendingDelete.id);
    setPendingDelete(null);
  }

  function saveProject(project: Project) {
    setJobs((current) =>
      current.map((job) => (job.id === project.id ? project : job)),
    );
  }

  function onDragOver(event: React.DragEvent<HTMLElement>, stage: Stage) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (overStage !== stage) setOverStage(stage);
  }

  function onDragLeave(event: React.DragEvent<HTMLElement>, stage: Stage) {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
      setOverStage((current) => (current === stage ? null : current));
    }
  }

  function onDrop(event: React.DragEvent<HTMLElement>, stage: Stage) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (id) moveProject(id, stage);
    setOverStage(null);
  }

  return (
    <>
      <ul className="counts">
        {stages.map((stage) => {
          const count = projectsInStage(stage, jobs).length;
          return (
            <li key={stage} data-stage={stageSlug(stage)}>
              <span className="count-value">{count}</span>
              <span className="count-label">{stage}</span>
            </li>
          );
        })}
      </ul>
      <div className="board">
        {stages.map((stage) => {
          const columnJobs = projectsInStage(stage, jobs);
          return (
            <section
              key={stage}
              className={overStage === stage ? "column is-over" : "column"}
              data-stage={stageSlug(stage)}
              aria-labelledby={`stage-${stageSlug(stage)}`}
              onDragOver={(event) => onDragOver(event, stage)}
              onDragLeave={(event) => onDragLeave(event, stage)}
              onDrop={(event) => onDrop(event, stage)}
            >
              <header className="column-head">
                <h2 id={`stage-${stageSlug(stage)}`}>{stage}</h2>
                <span className="column-count">{columnJobs.length}</span>
              </header>
              {columnJobs.length === 0 ? (
                <p className="empty">Nothing in {stage}.</p>
              ) : (
                <ul className="cards">
                  {columnJobs.map((job) => (
                    <li key={job.id}>
                      <article
                        className="card"
                        draggable
                        tabIndex={0}
                        onDragStart={(event) => onDragStart(event, job.id)}
                        onClick={() => openProject(job.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openProject(job.id);
                          }
                        }}
                      >
                        <div className="card-actions">
                          <button
                            type="button"
                            className="card-delete"
                            aria-label={`Delete ${job.name}`}
                            onMouseDown={(event) => event.stopPropagation()}
                            onDragStart={(event) => event.stopPropagation()}
                            onClick={(event) => {
                              event.stopPropagation();
                              askDelete(job.id, job.name);
                            }}
                          >
                            <svg viewBox="0 0 16 16" aria-hidden="true">
                              <path d="M3.2 4.5h9.6" />
                              <path d="M6.2 4.4V3.2h3.6v1.2" />
                              <path d="M4.4 4.5l.6 8.3h6l.6-8.3" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="card-edit"
                            aria-label={`Edit ${job.name}`}
                            onMouseDown={(event) => event.stopPropagation()}
                            onDragStart={(event) => event.stopPropagation()}
                            onClick={(event) => {
                              event.stopPropagation();
                              openProject(job.id, "edit");
                            }}
                          >
                            <svg viewBox="0 0 16 16" aria-hidden="true">
                              <path d="M11.2 1.8a1.2 1.2 0 0 1 1.7 0l1.3 1.3a1.2 1.2 0 0 1 0 1.7L6.4 12.6 3 13.4l.8-3.4 7.4-8.2Z" />
                              <path d="M2 14.2h12" />
                            </svg>
                          </button>
                        </div>
                        <h3>{job.name}</h3>
                        <p className="client">{job.client}</p>
                        <p className="meta">
                          <span>{job.owner}</span>
                          <time dateTime={job.due}>{formatDue(job.due)}</time>
                        </p>
                      </article>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
      {selected ? (
        <ProjectSheet
          key={selected.id}
          project={selected}
          initialMode={sheetMode}
          openRequest={sheetRequest}
          onClose={closeSheet}
          onSave={saveProject}
          onDelete={() => askDelete(selected.id, selected.name)}
        />
      ) : null}
      {pendingDelete ? (
        <DeleteProjectDialog
          name={pendingDelete.name}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      ) : null}
    </>
  );
}
