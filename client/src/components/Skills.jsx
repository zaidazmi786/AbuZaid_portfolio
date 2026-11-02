import profile from '../profile.js';

export default function Skills() {
  return (
    <section id="skills" className="section">
      <h2 className="section-title">
        My <span className="accent">Skills</span>
      </h2>
      <div className="skill-groups">
        {profile.skillGroups.map((g) => (
          <div className="skill-group" key={g.title}>
            <h3>{g.title}</h3>
            <div className="tags">
              {g.items.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="extra-grid">
        <div className="skill-group">
          <h3>Achievements</h3>
          <ul className="plain-list">
            {profile.achievements.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
        <div className="skill-group">
          <h3>Education</h3>
          <ul className="plain-list">
            {profile.education.map((e) => (
              <li key={e.degree}>
                <strong>{e.degree}</strong>
                <br />
                <span className="muted">{e.place}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
