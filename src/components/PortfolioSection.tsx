import { projects } from "../data/projects";

export function PortfolioSection() {
  return (
    <main className="portfolio" id="portfolio">
      <div className="container">
        <div className="section-heading">
          <p className="terminal-label">$ ls ./portfolio</p>
          <h2>Selected Work</h2>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card terminal-frame" key={project.name}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="project-links">
                {project.links.map((link) => (
                  <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
