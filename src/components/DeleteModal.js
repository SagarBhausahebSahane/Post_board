import React from 'react';

export default function DeleteModal({ post, onClose, onConfirm }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={`overlay${post ? ' open' : ''}`} onClick={handleOverlayClick}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>Delete Post</h2>
          <button className="btn-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <div className="delete-warn">
            ⚠️ This action cannot be undone. The post and its image will be permanently deleted.
          </div>
          {post && ( <p className="delete-target-title">"{post.title}"</p> )}
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-submit danger" onClick={onConfirm}>Delete Post</button>
        </div>
      </div>
    </div>
  );
}
