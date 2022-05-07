import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';
import AddEditModal from './AddEditModal';
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
  
const Floors = () => {
  const [loading, setLoading] = useState(true);
  const [floors, setFloors] = useState([]);

  const [isOpen, setIsOpen] = useState(false)
  const [floorToEdit, setFloorToEdit] = useState()

  useEffect(() => {
    axios.get('/api/floors').then(({ data }) => {
      setLoading(false);
      setFloors(data);
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
      <AddEditModal isOpen={isOpen} setIsOpen={setIsOpen} floor={floorToEdit}/>
      <div style={{ marginBottom: '20px' }}>
        <button className="btn btn-primary" type="button" onClick={()=> {
            setFloorToEdit({})
            setIsOpen(true);
        }}>
          Create Floor
        </button>
      </div>
      <CCard className="mb-4">
        <CCardHeader>Floors</CCardHeader>
        <CCardBody>
          <table className="table caption-top">
            <caption>List of floors</caption>

            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Level</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {floors.map((floor) => {
                return (
                  <tr key={floor._id}>
                    <th scope="row">{floor._id}</th>
                    <td>{floor.name}</td>
                    <td>{floor.level}</td>
                    <td>{<button class="btn btn-link" type="button" style={{padding: '0'}} onClick={() => {
                        setFloorToEdit(floor);
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

export default Floors;
