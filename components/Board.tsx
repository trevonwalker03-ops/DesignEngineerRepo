"use client";

import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from "react";
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
}: {
  jobs: Project[];
  setJobs: Dispatch<SetStateAction<Project[]>>;
}) {
  const [overStage, setOverStage] = useState<Stage | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  function openProject(id: string) {
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    setSelectedId(id);
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
                        role="button"
                        tabIndex={0}
                        onDragStart={(event) => onDragStart(event, job.id)}
                        onClick={() => openProject(job.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedId(job.id);
                          }
                        }}
                      >
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
        <ProjectSheet project={selected} onClose={closeSheet} />
      ) : null}
    </>
  );
}
