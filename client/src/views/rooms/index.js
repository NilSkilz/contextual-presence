import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';
import AddEditModal from './addEditModal';
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'

const Rooms = () => {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [floors, setFloors] = useState();

  const [isOpen, setIsOpen] = useState(false)
  const [roomToEdit, setRoomToEdit] = useState()

  useEffect(() => {
    axios.get('/api/rooms').then(({ data }) => {
      console.log('Got Rooms')
      setLoading(false);
      setRooms(data);
      console.log(data)
    });
  }, [isOpen]);

  // useEffect(() => {
  //   axios.get('/api/floors').then(({ data }) => {
  //       setFloors(data);
  //       if (!data.length) {
  //           setLoading(true);
  //       }
  //     });
  // }, [])

  // const getFloorName = (floor_id) => {
  //   if (!floors) return '';
  //   const floor = floors.find(floor => floor._id === floor_id);
  //   if (!floor) return '';
  //   return <a href={`/#/floors`}>{floor.name}</a>;
  // }

  if (loading)
    return (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );

  return (
    <>
      {/* <AddEditModal isOpen={isOpen} setIsOpen={setIsOpen} room={roomToEdit}/> */}
      <div style={{ marginBottom: '20px' }}>
        <button className="btn btn-primary" type="button" onClick={()=> {
            setIsOpen(true);
            setRoomToEdit(null)
        }}>
          Create Room
        </button>
      </div>
      <CCard className="mb-4">
        <CCardHeader>Rooms</CCardHeader>
        <CCardBody>
          <table className="table caption-top">
            <caption>List of rooms</caption>

            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                {/* <th scope="col">Floor</th> */}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => {
                return (
                  <tr key={room._id}>
                    <th scope="row">{room._id}</th>
                    <td>{room.data.label}</td>
                    {/* <td>{floors && getFloorName(room.floor_id)}</td> */}
                    <td>{<button className="btn btn-link" type="button" style={{padding: '0'}} onClick={() => {
                        setRoomToEdit(room);
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
