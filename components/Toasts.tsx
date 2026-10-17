"use client";

import { useEffect, useRef, useState } from "react";
import type { RemovedProject } from "@/lib/projects";

export type ToastItem =
  | { id: number; kind: "created"; name: string }
  | { id: number; kind: "deleted"; name: string; removed: RemovedProject };

const durationFor = {
  created: 4000,
  deleted: 6000,
} as const;

export function Toasts({
  toasts,
  onDismiss,
  onUndo,
}: {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
  onUndo: (removed: RemovedProject) => void;
}) {
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={() => onDismiss(toast.id)}
          onUndo={
            toast.kind === "deleted" ? () => onUndo(toast.removed) : undefined
          }
        />
      ))}
    </div>
  );
}

function Toast({
  toast,
  onDismiss,
  onUndo,
}: {
  toast: ToastItem;
  onDismiss: () => void;
  onUndo?: () => void;
}) {
  const [leaving, setLeaving] = useState(false);
  const finished = useRef(false);
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  useEffect(() => {
    if (leaving) {
      const timer = window.setTimeout(() => {
        if (finished.current) return;
        finished.current = true;
        dismissRef.current();
      }, 500);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setLeaving(true), durationFor[toast.kind]);
    return () => window.clearTimeout(timer);
  }, [leaving, toast.kind]);

  function finish() {
    if (finished.current) return;
    finished.current = true;
    dismissRef.current();
  }

  function dismiss() {
    setLeaving(true);
  }

  function undo() {
    if (leaving) return;
    onUndo?.();
    setLeaving(true);
  }

  return (
    <article
      className={leaving ? "toast is-leaving" : "toast"}
      onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.animationName !== "toast-out") return;
        finish();
      }}
    >
      <p className="toast-title">
        {toast.kind === "created" ? (
          <svg className="toast-check" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3.2 8.2 6.4 11.4 12.8 4.6" />
          </svg>
        ) : null}
        {toast.kind === "created" ? "Project created" : "Project deleted"}
      </p>
      <button
        type="button"
        className="toast-dismiss"
        aria-label="Dismiss notification"
        onClick={dismiss}
      >
        ×
      </button>
      <p className="toast-copy">
        {toast.kind === "created"
          ? `${toast.name} was added successfully.`
          : `${toast.name} was removed.`}
      </p>
      {toast.kind === "deleted" ? (
        <button type="button" className="toast-undo" onClick={undo}>
          Undo
        </button>
      ) : null}
    </article>
  );
}
