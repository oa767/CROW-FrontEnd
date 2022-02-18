import './usernames.css';

export default function Username() {
  return (
	  /* Users on the website can select from a set of 10 different usernames 
	  before entering a room. If a user does not select a name before entering 
	  a room the website should give them a random one from this set of names. 
	  The random user name that is selected must be unique from all other users
	  in the chatroom.
	  	*/
    <div className="content">
      <h3> Choose a username </h3>
      <button className="username-item">
	Default Username #1
      </button>
      <button className="username-item">
        Default Username #2
      </button>
      <button className="username-item">
        Default Username #3
      </button>
      <button className="username-item">
        Default Username #4
      </button>
      <button className="username-item">
        Default Username #5
      </button>
      <button className="username-item">
        Default Username #6
      </button>
      <button className="username-item">
        Default Username #7
      </button>
      <button className="username-item">
        Default Username #8
      </button>      
      <button className="username-item">
        Default Username #9
      </button>
      <button className="username-item">
        Default Username #10
      </button>
    </div>
  );
};
