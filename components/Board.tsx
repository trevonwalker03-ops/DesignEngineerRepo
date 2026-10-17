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

export function Board({ projects }: { projects: Project[] }) {
  return (
    <>
      <ul className="counts">
        {stages.map((stage) => {
          const count = projectsInStage(stage, projects).length;
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
          const jobs = projectsInStage(stage, projects);
          return (
            <section
              key={stage}
              className="column"
              data-stage={stageSlug(stage)}
              aria-labelledby={`stage-${stageSlug(stage)}`}
            >
              <header className="column-head">
                <h2 id={`stage-${stageSlug(stage)}`}>{stage}</h2>
                <span className="column-count">{jobs.length}</span>
              </header>
              {jobs.length === 0 ? (
                <p className="empty">Nothing in {stage}.</p>
              ) : (
                <ul className="cards">
                  {jobs.map((job) => (
                    <li key={job.id}>
                      <article className="card">
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
    </>
  );
}
