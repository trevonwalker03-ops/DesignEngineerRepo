"use client";

import { useRef, useState } from "react";
import { AddProjectDialog } from "@/components/AddProjectDialog";
import { Board } from "@/components/Board";
import { nextProjectId, type Project, type Stage } from "@/lib/projects";

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
  const [adding, setAdding] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);

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
      <main>
        <Board jobs={jobs} setJobs={setJobs} />
      </main>
      {adding ? (
        <AddProjectDialog onClose={closeDialog} onSubmit={addProject} />
      ) : null}
    </div>
  );
}
