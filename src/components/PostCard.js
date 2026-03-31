import React from 'react';

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function PostCard({ post, onView, onEdit, onDelete }) {
  return (
    <div className="card">
      {post.image ? (
        <img className="card-img" src={post.image} alt={post.title} loading="lazy" />
      ) : (
        <div className="card-img-placeholder">🖼</div>
      )}
      <div className="card-body">
        <div className="card-meta">
          <span className="card-date">{formatDate(post.createdAt)}</span>
          <span className="card-tag">Post</span>
        </div>
        <h3>{post.title}</h3>
        <p>{post.desc}</p>
      </div>
      <div className="card-actions">
        <button className="btn-action" onClick={() => onView(post)}>View</button>
        <button className="btn-action primary-outline" onClick={() => onEdit(post)}>Edit</button>
        <button className="btn-action danger" onClick={() => onDelete(post)}>Delete</button>
      </div>
    </div>
  );
}
