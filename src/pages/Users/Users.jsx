import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

import './users.css';

export default function Users() {
  const [users, setUsers] = useState(undefined);
  const [error, setError] = useState(undefined);

  const [refresh, setRefresh] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [userToDelete, setUserToDelete] = useState('');

  const history = useHistory();

  useEffect(() => {
    axios.get('https://crow249.herokuapp.com/users/list')
      .then((response) => {
        if (response.data){
          setUsers(response.data);
        }
      })
      .catch(error => {
        setError(error);
        console.log(error);
      });
  }, [refresh])

  const handleCreateUser = () => {
    axios.post(`https://crow249.herokuapp.com/users/create/${newUserName}`)
      .then(() => {
        setIsModalOpen(false);
        setRefresh(refresh + 1);
      })
      .catch(error => {
        setError(error);
        console.log(error);
      })
  }
  
  const handleDeleteUser = () => {
    axios.post(`https://crow249.herokuapp.com/users/delete/${userToDelete}`)
      .then(() => {
        setIsDeleteOpen(false);
        setRefresh(refresh + 1);
      })
      .catch(error => {
        setError(error);
        console.log(error);
      })
  }
  
  return (
    <>
      <div className="rooms-header">
        <h1>Users</h1>
        <button
          onClick={() => history.push('/')}
          className="button"
        >
          {"<--"}Go Back Home
        </button>
      </div>

      {error && (
        <div className="rooms-error-box">
          <p>{error.toString()}</p>
        </div>
      )}

      <div className="rooms-list">
	{isModalOpen &&
          <div className="create-modal">
            <input
              className="user-input"
              placeholder="User Name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
            <div className="create-actions">
              <button className="button" onClick={handleCreateUser}>Create New User</button>
              <button className="button" onClick={() => setIsModalOpen(false)}> Cancel </button>
            </div>
          </div>
        }
        {isDeleteOpen &&
          <div className="create-modal">
            <div className="create-actions">
              <button className="button" onClick={handleDeleteUser}> Delete User</button>
              <button className="button" onClick={() => setIsDeleteOpen(false)}> Cancel </button>
            </div>
          </div>
        }

        {users ? users.map((user, index) => (
          <div 
            className="user-item"
            key={`${user.user_name}-${index}`}
            onClick={() => {
              setUserToDelete(user.user_name);
    	      setIsDeleteOpen(true);
            }}
	  >
            <p>{user.user_name}</p>
            <p>{index}</p>
          </div>
        )) : (
          <div className="rooms-empty">
            <p>Sorry there are no rooms right now... Come back later </p>
          </div>
        )}
      </div>
      <div style={{paddingBottom: "125px", width: "300px", alignItems: "center", margin: "auto", paddingTop: "20px"}}>
        <button className="page-button" onClick={() => setIsModalOpen(true)}> Add New User </button>
      </div>
    </>
  )
}
