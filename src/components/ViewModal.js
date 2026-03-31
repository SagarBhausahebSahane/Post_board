import React from 'react';

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'});
}

export default function ViewModal({ post, onClose }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={`overlay${post ? ' open' : ''}`} onClick={handleOverlayClick}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>Post Details</h2>
          <button className="btn-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          {post && (
            <>
              {post.image && (
                <img className="view-img" src={post.image} alt={post.title} />
              )}
              <div className="view-date">
                {formatDate(post.createdAt)}
                {post.updatedAt ? ` · Edited ${formatDate(post.updatedAt)}` : ''}
              </div>
              <div className="view-title">{post.title}</div>
              <div className="view-desc">{post.desc}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
