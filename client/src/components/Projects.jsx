import { useEffect, useState } from 'react';
import api, { imageSrc } from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import ProjectForm from './ProjectForm.jsx';

export default function Projects() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | project object

  const load = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
      setError('');
    } catch {
      setError('Projects could not be loaded. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (data) => {
    if (editing === 'new') await api.post('/projects', data);
    else await api.put(`/projects/${editing._id}`, data);
    setEditing(null);
    await load();
  };

  const remove = async (project) => {
    if (!window.confirm(`"${project.title}" delete karna hai?`)) return;
    try {
      await api.delete(`/projects/${project._id}`);
      setProjects((prev) => prev.filter((p) => p._id !== project._id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <section id="projects" className="section">
      <h2 className="section-title">
        My <span className="accent">Projects</span>
      </h2>

      {isAdmin && (
        <div className="admin-bar">
          <button className="btn btn-yellow" onClick={() => setEditing('new')}>
            + Add Project
          </button>
        </div>
      )}

      {loading && <p className="muted center">Loading...</p>}
      {error && <p className="error center">{error}</p>}
      {!loading && !error && projects.length === 0 && (
        <p className="muted center">I don't have any projects at the moment.</p>
      )}

      <div className="project-grid">
        {projects.map((p) => (
          <article className="card" key={p._id}>
            {p.image ? (
              <img src={imageSrc(p.image)} alt={p.title} className="card-img" />
            ) : (
              <div className="card-img placeholder">{p.title.slice(0, 1)}</div>
            )}
            <div className="card-body">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="tags">
                {p.tech.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="card-links">
                {p.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noreferrer">
                    Live
                  </a>
                )}
                {p.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                )}
              </div>
              {isAdmin && (
                <div className="card-admin">
                  <button className="btn btn-small" onClick={() => setEditing(p)}>
                    Edit
                  </button>
                  <button className="btn btn-small btn-danger" onClick={() => remove(p)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {editing && (
        <ProjectForm
          initial={editing === 'new' ? null : editing}
          onSubmit={save}
          onCancel={() => setEditing(null)}
        />
      )}
    </section>
  );
}
