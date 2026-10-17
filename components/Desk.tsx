"use client";

import { useRef, useState } from "react";
import { AddProjectDialog } from "@/components/AddProjectDialog";
import { Board } from "@/components/Board";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toasts, type ToastItem } from "@/components/Toasts";
import {
  nextProjectId,
  filterProjects,
  removeProject,
  restoreProject,
  type Project,
  type RemovedProject,
  type Stage,
} from "@/lib/projects";

export function Desk({
  projects,
  today,
  todayIso,
}: {
  projects: Project[];
  today: string;
  todayIso: string;
}) {
  const [jobs, setJobs] = useState(projects);
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const jobsRef = useRef(jobs);
  const toastId = useRef(0);
  jobsRef.current = jobs;
  const visible = filterProjects(jobs, query);

  function pushToast(
    toast:
      | { kind: "created"; name: string }
      | { kind: "deleted"; name: string; removed: RemovedProject },
  ) {
    toastId.current += 1;
    const id = toastId.current;
    const next: ToastItem =
      toast.kind === "created"
        ? { id, kind: "created", name: toast.name }
        : { id, kind: "deleted", name: toast.name, removed: toast.removed };
    setToasts((current) => [...current, next]);
  }

  function dismissToast(id: number) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function undoDelete(removed: RemovedProject) {
    const next = restoreProject(jobsRef.current, removed);
    jobsRef.current = next;
    setJobs(next);
  }

  function closeDialog() {
    setAdding(false);
    addButtonRef.current?.focus();
  }

  function addProject(project: {
    name: string;
    client: string;
    owner: string;
    due: string;
    stage: Stage;
  }) {
    setJobs((current) => {
      const next = [...current, { ...project, id: nextProjectId(current) }];
      jobsRef.current = next;
      return next;
    });
    setAdding(false);
    pushToast({ kind: "created", name: project.name });
  }

  function deleteProject(id: string) {
    const result = removeProject(jobsRef.current, id);
    if (!result.removed) return;
    jobsRef.current = result.list;
    setJobs(result.list);
    pushToast({
      kind: "deleted",
      name: result.removed.project.name,
      removed: result.removed,
    });
  }

  return (
    <div className="desk">
      <header className="topbar">
        <div className="brand">
          <p className="studio">Field office</p>
          <h1>Northline</h1>
        </div>
        <div className="topbar-side">
          <button
            ref={addButtonRef}
            type="button"
            className="add-project"
            onClick={() => setAdding(true)}
          >
            Add project
          </button>
          <p className="today">
            <time dateTime={todayIso}>{today}</time>
          </p>
          <ThemeToggle />
        </div>
      </header>
      <div
        className="search"
        onKeyDown={(event) => {
          if (event.key === "Escape" && query) {
            event.preventDefault();
            setQuery("");
          }
        }}
      >
        <svg className="search-icon" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="7" cy="7" r="4.25" />
          <path d="M10.2 10.2 13 13" />
        </svg>
        <input
          type="search"
          value={query}
          placeholder="Search projects"
          aria-label="Search projects"
          onChange={(event) => setQuery(event.target.value)}
        />
        {query ? (
          <button
            type="button"
            className="search-clear"
            aria-label="Clear search"
            onClick={() => setQuery("")}
          >
            ×
          </button>
        ) : null}
      </div>
      {query.trim() && visible.length === 0 ? (
        <p className="search-empty">No projects match “{query.trim()}”.</p>
      ) : null}
      <main>
        <Board jobs={visible} setJobs={setJobs} onDeleteProject={deleteProject} />
      </main>
      <Toasts toasts={toasts} onDismiss={dismissToast} onUndo={undoDelete} />
      {adding ? (
        <AddProjectDialog onClose={closeDialog} onSubmit={addProject} />
      ) : null}
    </div>
  );
}
