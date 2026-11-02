import { useEffect, useState } from 'react';
import api, { imageSrc } from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import CertificateForm from './CertificateForm.jsx';

export default function Certificates() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | certificate object
  const [viewing, setViewing] = useState(null); // certificate jiski badi image dikh rahi hai

  const load = async () => {
    try {
      const res = await api.get('/certificates');
      setItems(res.data);
      setError('');
    } catch {
      setError('Certificates load nahi ho paaye. Backend chal raha hai?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Esc dabane par badi image band ho jaye
  useEffect(() => {
    if (!viewing) return;
    const onKey = (e) => e.key === 'Escape' && setViewing(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewing]);

  const save = async (data) => {
    if (editing === 'new') await api.post('/certificates', data);
    else await api.put(`/certificates/${editing._id}`, data);
    setEditing(null);
    await load();
  };

  const remove = async (item) => {
    if (!window.confirm(`"${item.title}" delete karna hai?`)) return;
    try {
      await api.delete(`/certificates/${item._id}`);
      setItems((prev) => prev.filter((c) => c._id !== item._id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <section id="certificates" className="section">
      <h2 className="section-title">
        My <span className="accent">Certificates</span>
      </h2>

      {isAdmin && (
        <div className="admin-bar">
          <button className="btn btn-yellow" onClick={() => setEditing('new')}>
            + Add Certificate
          </button>
        </div>
      )}

      {loading && <p className="muted center">Loading...</p>}
      {error && <p className="error center">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="muted center">Abhi koi certificate nahi hai.</p>
      )}

      <div className="cert-grid">
        {items.map((c) => (
          <article className="cert-card" key={c._id}>
            {c.image ? (
              <button className="cert-img-btn" onClick={() => setViewing(c)} title="Badi image dekho">
                <img src={imageSrc(c.image)} alt={c.title} className="cert-img" />
              </button>
            ) : (
              <div className="cert-img cert-placeholder">🏆</div>
            )}
            <div className="cert-body">
              <h3>{c.title}</h3>
              {c.issuer && <p className="muted">{c.issuer}</p>}
              {c.date && <span className="cert-date">{c.date}</span>}
              {isAdmin && (
                <div className="card-admin">
                  <button className="btn btn-small" onClick={() => setEditing(c)}>
                    Edit
                  </button>
                  <button className="btn btn-small btn-danger" onClick={() => remove(c)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {editing && (
        <CertificateForm
          initial={editing === 'new' ? null : editing}
          onSubmit={save}
          onCancel={() => setEditing(null)}
        />
      )}

      {viewing && (
        <div className="modal-backdrop lightbox" onClick={() => setViewing(null)}>
          <img src={imageSrc(viewing.image)} alt={viewing.title} />
        </div>
      )}
    </section>
  );
}
