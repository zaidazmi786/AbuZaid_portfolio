import profile from '../profile.js';

export default function Avatar() {
  if (profile.avatar) {
    return <img src={profile.avatar} alt={profile.firstName} className="avatar-img" />;
  }
  return (
    <svg className="avatar-img avatar-default" viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="78" r="38" fill="currentColor" opacity="0.9" />
      <path d="M24 190c4-42 36-66 76-66s72 24 76 66z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}
