import React from 'react';

const PeerSupport = () => {
  return (
    <div className="component-container">
      <h2>👥 Peer Support Forum</h2>
      <div className="forum-posts">
        <div className="forum-post">
          <h4>Dealing with exam anxiety</h4>
          <p>Anonymous Student - 2 hours ago</p>
          <p>I've been struggling with severe anxiety during exams...</p>
          <button>💙 Support (12)</button>
        </div>
        <div className="forum-post">
          <h4>Making friends in college</h4>
          <p>Anonymous Student - 1 day ago</p>
          <p>I'm an introvert and finding it hard to make connections...</p>
          <button>💙 Support (8)</button>
        </div>
      </div>
    </div>
  );
};

export default PeerSupport;
