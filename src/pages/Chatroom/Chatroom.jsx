import React from 'react';

import './chatroom.css';

export default function Chatroom() {
  const roomName = localStorage.getItem('roomName');
  const username = localStorage.getItem('username');

  return (
    <>
      <div className="wrapper">
	<div className="topBar">
	  <div className="roomName"> roomName </div>
	</div>
      </div>
      <div className="sidebar">
        <div className="sidebarContent">
	  <h3> User 1 </h3>
	  <h3> User 2 </h3>
	</div>
      </div>
      <div className="chatbar">
        <input
	  className="chatInput"
          placeholder="Type a message"
        />
      </div>
    </>
  )
}
