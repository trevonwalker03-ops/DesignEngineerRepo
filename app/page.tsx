import { Desk } from "@/components/Desk";
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

  return <Desk projects={projects} today={today} todayIso={todayIso} />;
}
