import React, { useState, useEffect, useRef } from 'react';

const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

export default function PostFormModal({ open, editPost, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  useEffect(() => {
    if (open) {
      setTitle(editPost ? editPost.title : '');
      setDesc(editPost ? editPost.desc : '');
      setImage(editPost ? editPost.image || null : null);
      setErrors({});
    }
  }, [open, editPost]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors(prev => ({ ...prev, image: 'Only PNG, JPG or JPEG images are allowed.' }));
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target.result);
      setErrors(prev => ({ ...prev, image: null }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required.';
    if (!desc.trim()) errs.desc = 'Description is required.';
    if (!image) errs.image = 'Please select an image (PNG, JPG, JPEG).';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ title: title.trim(), desc: desc.trim(), image });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={`overlay${open ? ' open' : ''}`} onClick={handleOverlayClick}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>{editPost ? 'Edit Post' : 'New Post'}</h2>
          <button className="btn-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="f-title">Title *</label>
            <input
              id="f-title"
              type="text"
              placeholder="Enter a compelling title…"
              maxLength={120}
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={errors.title ? 'err' : ''}
            />
            {errors.title && <div className="err-msg">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="f-desc">Description *</label>
            <textarea
              id="f-desc"
              placeholder="Write something interesting…"
              maxLength={2000}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className={errors.desc ? 'err' : ''}
            />
            {errors.desc && <div className="err-msg">{errors.desc}</div>}
          </div>
          <div className="form-group">
            <label>Post Image *</label>
            {!image && (
              <div className="img-upload-area">
                <input
                  ref={fileRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                  onChange={handleFile}
                />
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a09790" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p><strong>Click to upload</strong> or drag &amp; drop</p>
                <p>PNG, JPG or JPEG only</p>
              </div>
            )}
            {errors.image && <div className="err-msg">{errors.image}</div>}
            {image && (
              <div className="img-preview">
                <img src={image} alt="Preview" />
                <button className="img-preview-remove" onClick={removeImage} type="button">✕</button>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-submit" onClick={handleSubmit}>
            {editPost ? 'Save Changes' : 'Publish Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
