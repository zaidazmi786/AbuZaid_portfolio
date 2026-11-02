import { useEffect, useState } from 'react';
import { imageSrc } from '../api';

const MAX_SIZE = 5 * 1024 * 1024;

export default function CertificateForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    issuer: initial?.issuer || '',
    date: initial?.date || '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image ? imageSrc(initial.image) : '');
  const [removeImage, setRemoveImage] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  useEffect(() => {
    return () => {
      if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const pickFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return setError('Sirf image file chuno');
    if (f.size > MAX_SIZE) return setError('Image 5MB se choti honi chahiye');
    setError('');
    setFile(f);
    setRemoveImage(false);
    setPreview(URL.createObjectURL(f));
  };

  const clearImage = () => {
    setFile(null);
    setPreview('');
    setRemoveImage(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) data.append('image', file);
    if (removeImage && !file) data.append('removeImage', 'true');

    try {
      await onSubmit(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h3>{initial ? 'Edit Certificate' : 'Add New Certificate'}</h3>
        {error && <div className="error">{error}</div>}

        <input
          placeholder="Certificate title *"
          value={form.title}
          onChange={set('title')}
          required
        />
        <input
          placeholder="Issued by / details (e.g. LPU, Udemy)"
          value={form.issuer}
          onChange={set('issuer')}
        />
        <input placeholder="Date (e.g. 18 Nov 2025)" value={form.date} onChange={set('date')} />

        <div className="upload-box">
          {preview ? (
            <div className="upload-preview">
              <img src={preview} alt="Preview" />
              <button type="button" className="btn btn-small btn-danger" onClick={clearImage}>
                Remove image
              </button>
            </div>
          ) : (
            <p className="muted">Certificate ki image select nahi hui</p>
          )}
          <label className="btn btn-small upload-btn">
            {preview ? 'Change image' : 'Upload certificate image'}
            <input type="file" accept="image/*" onChange={pickFile} hidden />
          </label>
          <small className="muted">JPG, PNG, WEBP ya GIF, max 5MB</small>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-yellow" disabled={busy}>
            {busy ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
