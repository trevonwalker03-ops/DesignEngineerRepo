import { Board } from "@/components/Board";
import { projects } from "@/lib/projects";

export default function Home() {
  const now = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);
  const todayIso = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <div className="desk">
      <header className="topbar">
        <div className="brand">
          <p className="studio">Field office</p>
          <h1>Northline</h1>
        </div>
        <p className="today">
          <time dateTime={todayIso}>{today}</time>
        </p>
      </header>
      <main>
        <Board projects={projects} />
      </main>
    </div>
  );
}
