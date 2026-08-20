interface AboutSkillsProps {
  about: string
  skills: string[]
  loading: boolean
}

export function AboutSkills({ about, skills, loading }: AboutSkillsProps) {
  return (
    <section className="content-grid">
      <article className="panel">
        <p className="eyebrow">About</p>
        <h2>Tell your story on chain</h2>
        <p>
          {loading
            ? 'Fetching the about field from your portfolio object...'
            : about || 'Add your background, interests, and goals after you create or load a portfolio object.'}
        </p>
      </article>
      <article className="panel">
        <p className="eyebrow">Skills</p>
        <h2>Workshop-ready tags</h2>
        <div className="skill-list">
          {(skills.length ? skills : ['Move', 'Sui', 'Wallets']).map((skill) => (
            <span key={skill} className="skill-chip">
              {skill}
            </span>
          ))}
        </div>
      </article>
    </section>
  )
}
