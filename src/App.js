import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import PostCard from './components/PostCard';
import PostFormModal from './components/PostFormModal';
import ViewModal from './components/ViewModal';
import DeleteModal from './components/DeleteModal';
import Toast from './components/Toast';

const STORAGE_KEY = 'postboard_posts';

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function App() {
  const [posts, setPosts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState('');
  const [formModal, setFormModal] = useState({ open: false, editPost: null });
  const [viewPost, setViewPost] = useState(null);
  const [deletePost, setDeletePost] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: '' });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 2800);
  }, []);

  const handleCreate = () => setFormModal({ open: true, editPost: null });
  const handleEdit = (post) => setFormModal({ open: true, editPost: post });
  const handleView = (post) => setViewPost(post);
  const handleDeleteOpen = (post) => setDeletePost(post);

  const handleFormSubmit = (data) => {
    if (formModal.editPost) {
      setPosts(prev =>
        prev.map(p =>
          p.id === formModal.editPost.id
            ? { ...p, ...data, updatedAt: Date.now() }
            : p
        )
      );
      showToast('Post updated successfully!');
    } else {
      const newPost = { id: genId(), ...data, createdAt: Date.now() };
      setPosts(prev => [newPost, ...prev]);
      showToast('Post published!');
    }
    setFormModal({ open: false, editPost: null });
  };

  const handleDeleteConfirm = () => {
    setPosts(prev => prev.filter(p => p.id !== deletePost.id));
    setDeletePost(null);
    showToast('Post deleted.');
  };

  const filtered = search.trim()
    ? posts.filter(
        p =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.desc.toLowerCase().includes(search.toLowerCase())
      )
    : posts;

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <h1>Postboard</h1>
          <span>Your personal publishing space</span>
        </div>
        <button className="btn-new" onClick={handleCreate}>
          + New Post
        </button>
      </header>

      <main className="main">
        <div className="stats-bar">
          <div className="stats-left">
            <span className="stats-count">{posts.length}</span>
            <span className="stats-label">posts published</span>
          </div>
          <div className="search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📋</div>
            <h2>{search ? 'No results found' : 'No posts yet'}</h2>
            <p>
              {search
                ? 'Try a different search term.'
                : 'Click "New Post" to publish your first post.'}
            </p>
          </div>
        ) : (
          <div className="grid">
            {filtered.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteOpen}
              />
            ))}
          </div>
        )}
      </main>

      <PostFormModal
        open={formModal.open}
        editPost={formModal.editPost}
        onClose={() => setFormModal({ open: false, editPost: null })}
        onSubmit={handleFormSubmit}
      />

      <ViewModal
        post={viewPost}
        onClose={() => setViewPost(null)}
      />

      <DeleteModal
        post={deletePost}
        onClose={() => setDeletePost(null)}
        onConfirm={handleDeleteConfirm}
      />

      <Toast show={toast.show} msg={toast.msg} />
    </div>
  );
}
