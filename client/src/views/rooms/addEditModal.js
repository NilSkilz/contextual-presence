import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  UncontrolledAccordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
} from 'reactstrap';

const AddEditModal = ({ isOpen = false, setIsOpen, room: roomToEdit }) => {
  const [room, setRoom] = useState(roomToEdit || {});
  const [rooms, setRooms] = useState([]);
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    setRoom(roomToEdit || {});
  }, [roomToEdit]);

  useEffect(() => {
    axios.get('/api/floors').then(({ data }) => {
      setFloors(data);
      if (!room.floor_id) room.floor_id = data[0]._id;
    });
    axios.get('/api/rooms').then(({ data }) => {
      setRooms(data);
    });
  }, [isOpen]);

  const isEdit = room._id ? true : false;

  const addPortal = () => {
    if (!room.portals) {
      setRoom({ ...room, portals: [{}] });
    } else {
      setRoom({ ...room, portals: [...room.portals, {}] });
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>{room?._id ? 'Edit Room' : 'Create Room'}</ModalHeader>
      <ModalBody>
        <UncontrolledAccordion open="1" flush>
          <AccordionItem>
            <AccordionHeader targetId="1">Room Details</AccordionHeader>
            <AccordionBody accordionId="1">
              <div className="mb-3">
                <label className="form-label">ID</label>
                <input
                  className="form-control"
                  id="id"
                  type="text"
                  placeholder="living_room"
                  value={room._id}
                  onChange={({ target }) => {
                    setRoom({ ...room, id: target.value });
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  id="name"
                  type="text"
                  placeholder="Living Room"
                  value={room.name}
                  onChange={({ target }) => {
                    setRoom({ ...room, name: target.value });
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Floor</label>
                <select
                  class="form-select"
                  aria-label="Default select example"
                  value={room.floor_id}
                  onChange={({ target }) => {
                    setRoom({ ...room, floor_id: target.value });
                  }}
                >
                  {floors.map((floor) => {
                    return <option value={floor._id}>{floor.name}</option>;
                  })}
                </select>
              </div>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader targetId="2">Portals</AccordionHeader>
            <AccordionBody accordionId="2">
              <div className="mb-3">
                {room.portals &&
                  room.portals.map((portal) => (
                    <div className="row">
                      <div className="mb-3 col-6">
                        <label className="form-label">To</label>
                        <select
                          class="form-select"
                          aria-label="Default select example"
                          value={portal.room_id}
                          disabled={isEdit}
                          onChange={({ target }) => {
                            // setRoom({...room, portals});
                          }}
                        >
                          {rooms.map((room) => {
                            return (
                              <option value={room._id}>{room.name}</option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="mb-3 col-6">
                        <label className="form-label">Device</label>
                        <select
                          class="form-select"
                          aria-label="Default select example"
                          value={portal.room_id}
                          onChange={({ target }) => {
                            // setRoom({...room, portals});
                          }}
                        >
                          {rooms.map((room) => {
                            return (
                              <option value={room._id}>{room.name}</option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  ))}
              </div>
              <Button
                outline
                onClick={() => {
                  addPortal();
                }}
              >
                Add Portal
              </Button>
            </AccordionBody>
          </AccordionItem>
        </UncontrolledAccordion>
      </ModalBody>
      <ModalFooter style={{ justifyContent: 'space-between' }}>
        {isEdit ? (
          <div>
            <Button
              color="danger"
              onClick={() => {
                if (isEdit) {
                  axios
                    .delete(`/api/rooms/${roomToEdit._id}`, room)
                    .then(() => {
                      setIsOpen(false);
                    });
                }
              }}
            >
              Delete
            </Button>
          </div>
        ) : (
          <div></div>
        )}
        <div>
          <Button
            color="primary"
            onClick={() => {
              if (isEdit) {
                axios.put(`/api/rooms/${roomToEdit._id}`, room).then(() => {
                  setIsOpen(false);
                });
              } else {
                axios.post('/api/rooms', room).then(() => {
                  setIsOpen(false);
                });
              }
            }}
          >
            Save
          </Button>{' '}
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default AddEditModal;
