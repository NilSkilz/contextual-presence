import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';
import AddEditModal from './AddEditModal';
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'

const Rooms = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const [isOpen, setIsOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState()

  useEffect(() => {
    axios.get('/api/users').then(({ data }) => {
      setLoading(false);
      setUsers(data);
      console.log(data)
    });
  }, [isOpen]);

  if (loading)
    return (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );

  return (
    <>
      <AddEditModal isOpen={isOpen} setIsOpen={setIsOpen} user={userToEdit}/>
      <div style={{ marginBottom: '20px' }}>
        <button className="btn btn-primary" type="button" onClick={()=> {
            setIsOpen(true);
            setUserToEdit(null)
        }}>
          Create User
        </button>
      </div>
      <CCard className="mb-4">
        <CCardHeader>Users</CCardHeader>
        <CCardBody>
          <table className="table caption-top">
            <caption>List of users</caption>

            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr key={user._id}>
                    <th scope="row">{user._id}</th>
                    <td>{user.name}</td>
                    <td>{<button class="btn btn-link" type="button" style={{padding: '0'}} onClick={() => {
                        setUserToEdit(user);
                        setIsOpen(true)
                    }}>
                            <CIcon icon={cilPencil} customClassName="nav-icon" size='sm' height={16} />
                        </button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CCardBody>
      </CCard>
    </>
  );
};



export default Rooms;
