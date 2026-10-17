export const stages = ["Brief", "In progress", "Review", "Shipped"] as const;

export type Stage = (typeof stages)[number];

export type Project = {
  id: string;
  name: string;
  client: string;
  owner: string;
  due: string;
  stage: Stage;
};

export const projects: Project[] = [
  {
    id: "nl-24",
    name: "Harbor rebrand",
    client: "Harbor & Co.",
    owner: "Amina Shah",
    due: "2026-11-04",
    stage: "Brief",
  },
  {
    id: "nl-23",
    name: "Fall catalog",
    client: "Lumen Goods",
    owner: "Chris Pell",
    due: "2026-10-28",
    stage: "Brief",
  },
  {
    id: "nl-21",
    name: "Storefront refresh",
    client: "Fieldnote",
    owner: "Jules Park",
    due: "2026-10-22",
    stage: "In progress",
  },
  {
    id: "nl-19",
    name: "Packaging system",
    client: "Marrow",
    owner: "Amina Shah",
    due: "2026-10-30",
    stage: "In progress",
  },
  {
    id: "nl-17",
    name: "Annual report",
    client: "North Civic",
    owner: "Ren Ito",
    due: "2026-10-20",
    stage: "Review",
  },
  {
    id: "nl-12",
    name: "Wayfinding kit",
    client: "Kestrel Hall",
    owner: "Jules Park",
    due: "2026-10-08",
    stage: "Shipped",
  },
  {
    id: "nl-09",
    name: "Member welcome",
    client: "Atelier Row",
    owner: "Chris Pell",
    due: "2026-09-30",
    stage: "Shipped",
  },
];

export function projectsInStage(stage: Stage, list: Project[] = projects) {
  return list.filter((project) => project.stage === stage);
}

export function nextProjectId(list: Project[]) {
  const used = new Set(list.map((project) => project.id));
  let highest = 0;
  for (const project of list) {
    const match = /^nl-(\d+)$/.exec(project.id);
    if (match) highest = Math.max(highest, Number(match[1]));
  }
  let id = `nl-${highest + 1}`;
  while (used.has(id)) {
    highest += 1;
    id = `nl-${highest + 1}`;
  }
  return id;
}

export function formatDue(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(year, month - 1, day));
}
