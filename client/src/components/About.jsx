import profile from '../profile.js';
import Avatar from './Avatar.jsx';

export default function About() {
  return (
    <section id="about" className="about">
      <div className="about-visual">
        <div className="dots" />
        <div className="brush" />
        <div className="about-avatar">
          <Avatar />
        </div>
      </div>

      <div className="about-text">
        <h2>
          About <span className="white">{profile.firstName + ' ' + profile.lastName}</span>
        </h2>
        <p>{profile.about}</p>
        <p className="muted">{profile.about2}</p>
        <div className="signature">{profile.signature}</div>
        <div className="about-actions">
          <a href="#contact" className="btn btn-yellow">
            HIRE ME →
          </a>
          <a href="/Abu_Zaid_Resume.pdf" download className="learn-more">
            DOWNLOAD RESUME
          </a>
        </div>
      </div>
    </section>
  );
}
