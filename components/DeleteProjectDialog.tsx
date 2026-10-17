"use client";

import { useEffect, useRef } from "react";

export function DeleteProjectDialog({
  name,
  onCancel,
  onConfirm,
}: {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <>
      <button
        type="button"
        className="modal-backdrop"
        aria-label="Cancel delete"
        onClick={onCancel}
      />
      <div
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
      >
        <p className="modal-kicker">Delete project</p>
        <h2 id="delete-title">Remove {name}?</h2>
        <p className="delete-copy">This takes the project off the board.</p>
        <div className="modal-actions">
          <button ref={cancelRef} type="button" className="modal-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="modal-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
