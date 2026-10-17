"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { stages, type Stage } from "@/lib/projects";

const emptyError = "Enter a name, client, owner, due date, and stage.";

export function AddProjectDialog({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (project: {
    name: string;
    client: string;
    owner: string;
    due: string;
    stage: Stage;
  }) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [owner, setOwner] = useState("");
  const [due, setDue] = useState("");
  const [stage, setStage] = useState<Stage | "">("");
  const [error, setError] = useState("");

  useEffect(() => {
    nameRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function trapTab(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = [
      ...panelRef.current.querySelectorAll<HTMLElement>(
        "button, input, select, textarea, [href], [tabindex]:not([tabindex='-1'])",
      ),
    ].filter((element) => !element.hasAttribute("disabled"));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = name.trim();
    const nextClient = client.trim();
    const nextOwner = owner.trim();
    const nextDue = due.trim();
    if (!nextName || !nextClient || !nextOwner || !nextDue || !stage) {
      setError(emptyError);
      return;
    }
    onSubmit({
      name: nextName,
      client: nextClient,
      owner: nextOwner,
      due: nextDue,
      stage,
    });
  }

  return (
    <>
      <button
        type="button"
        className="modal-backdrop"
        aria-label="Close add project"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-project-title"
        onKeyDown={trapTab}
      >
        <p className="modal-kicker">New project</p>
        <h2 id="add-project-title">Add project</h2>
        <form className="modal-form" onSubmit={submit} noValidate>
          <label className="field" htmlFor="project-name">
            <span>Name</span>
            <input
              ref={nameRef}
              id="project-name"
              name="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
            />
          </label>
          <label className="field" htmlFor="project-client">
            <span>Client</span>
            <input
              id="project-client"
              name="client"
              value={client}
              onChange={(event) => {
                setClient(event.target.value);
                setError("");
              }}
            />
          </label>
          <label className="field" htmlFor="project-owner">
            <span>Owner</span>
            <input
              id="project-owner"
              name="owner"
              value={owner}
              onChange={(event) => {
                setOwner(event.target.value);
                setError("");
              }}
            />
          </label>
          <label className="field" htmlFor="project-due">
            <span>Due</span>
            <input
              id="project-due"
              name="due"
              type="date"
              value={due}
              onChange={(event) => {
                setDue(event.target.value);
                setError("");
              }}
            />
          </label>
          <label className="field" htmlFor="project-stage">
            <span>Stage</span>
            <select
              id="project-stage"
              name="stage"
              value={stage}
              onChange={(event) => {
                setStage(event.target.value as Stage | "");
                setError("");
              }}
            >
              <option value="">Select a stage</option>
              {stages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          {error ? (
            <p className="modal-error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="modal-actions">
            <button type="button" className="modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-submit">
              Add project
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
