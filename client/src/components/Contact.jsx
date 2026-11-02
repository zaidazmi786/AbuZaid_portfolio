import profile from '../profile.js';

export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <h2 className="section-title">
        Get In <span className="accent">Touch</span>
      </h2>
      <p className="muted center">
        Are you looking for an entry-level MERN Stack role or a project idea? Let's talk!
      </p>
      <div className="contact-row">
        <a href={`mailto:${profile.email}`} className="btn btn-yellow">
          {profile.email}
        </a>
        <a href={`tel:${profile.phone}`} className="btn btn-ghost">
          {profile.phone}
        </a>
        <a href={profile.socials.github} target="_blank" rel="noreferrer" className="btn btn-ghost">
          GitHub
        </a>
        <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost">
          LinkedIn
        </a>
      </div>
      <p className="muted center small">{profile.location}</p>
      <footer className="footer">
        © {new Date().getFullYear()} {profile.firstName} {profile.lastName}. All rights reserved.
      </footer>
    </section>
  );
}
