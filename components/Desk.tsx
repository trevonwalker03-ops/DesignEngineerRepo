"use client";

import { useRef, useState } from "react";
import { AddProjectDialog } from "@/components/AddProjectDialog";
import { Board } from "@/components/Board";
import { nextProjectId, filterProjects, type Project, type Stage } from "@/lib/projects";

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
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const visible = filterProjects(jobs, query);

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
    setJobs((current) => [...current, { ...project, id: nextProjectId(current) }]);
    setAdding(false);
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
        <Board jobs={visible} setJobs={setJobs} />
      </main>
      {adding ? (
        <AddProjectDialog onClose={closeDialog} onSubmit={addProject} />
      ) : null}
    </div>
  );
}
