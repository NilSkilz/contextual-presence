import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';
import AddEditModal from './addEditModal';
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'

const Devices = () => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [floors, setFloors] = useState();

  const [isOpen, setIsOpen] = useState(false)
  const [deviceToEdit, setDeviceToEdit] = useState()

  useEffect(() => {
    axios.get('/api/devices').then(({ data }) => {
      setLoading(false);
      setDevices(data);
      console.log(data)
    });
  }, [isOpen]);

  useEffect(() => {
    axios.get('/api/floors').then(({ data }) => {
        setFloors(data);
        if (!data.length) {
            setLoading(true);
        }
      });
  }, [])

  const getFloorName = (floor_id) => {
    if (!floors) return '';
    const floor = floors.find(floor => floor._id === floor_id);
    if (!floor) return '';
    return <a href={`/#/floors`}>{floor.name}</a>;
  }

  if (loading)
    return (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );

  return (
    <>
      <AddEditModal isOpen={isOpen} setIsOpen={setIsOpen} device={deviceToEdit}/>
      <div style={{ marginBottom: '20px' }}>
        <button className="btn btn-primary" type="button" onClick={()=> {
            setIsOpen(true);
            setDeviceToEdit(null)
        }}>
          Create Device
        </button>
      </div>
      <CCard className="mb-4">
        <CCardHeader>Devices</CCardHeader>
        <CCardBody>
          <table className="table caption-top">
            <caption>List of devices</caption>

            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Owner</th>
            
                <th></th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => {
                return (
                  <tr key={device._id}>
                    <th scope="row">{device._id}</th>
                    <td>{device.name}</td>
                    <td>{device.owner}</td>
                    <td>{<button class="btn btn-link" type="button" style={{padding: '0'}} onClick={() => {
                        setDeviceToEdit(device);
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



export default Devices;
