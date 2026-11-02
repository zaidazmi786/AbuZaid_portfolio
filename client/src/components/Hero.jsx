import profile from '../profile.js';
import Avatar from './Avatar.jsx';

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-text">
        <h1>
          Hi I'm <span className="accent">{profile.firstName + ' ' + profile.lastName}</span>
          <br />
          {profile.role}
        </h1>
        <p>{profile.tagline}</p>
        <a href="#projects" className="btn btn-yellow">
          GET STARTED
        </a>
      </div>

      <div className="hero-visual">
        <div className="ring ring-outer" />
        <div className="ring ring-inner">
          <Avatar />
        </div>
        <span className="name-badge">{profile.firstName + ' ' + profile.lastName}</span>
      </div>

      <div className="socials">
        <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">gh</a>
        <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
        <a href={profile.socials.email} aria-label="Email">@</a>
        <span className="follow">FOLLOW ME</span>
      </div>

      <a href="#about" className="scroll-down">
        <span>Scroll Down</span>
        <i className="mouse" />
      </a>
    </section>
  );
}
