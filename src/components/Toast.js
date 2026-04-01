import React from 'react';

export default function Toast({ show, msg }) {
  return ( 
    <div className={`toast${show ? ' show' : ''}`} role="status" aria-live="polite">
      {msg}
    </div>
  );
}
