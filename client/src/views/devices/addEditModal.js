import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const addEditModal = ({ isOpen = false, setIsOpen, device: deviceToEdit }) => {
  const [device, setDevice] = useState(deviceToEdit || {});
  const [users, setUsers] = useState([]);
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    setDevice(deviceToEdit || {});
  }, [deviceToEdit]);

  useEffect(() => {
    axios.get('/api/floors').then(({ data }) => {
      setFloors(data);
      if (!device.floor_id) device.floor_id = data[0]._id;
      console.log(device);
    });
    axios.get('/api/users').then(({ data }) => {
      setUsers([{name: 'None', id: undefined }, ...data]);
    });
  }, [isOpen]);

  const isEdit = device._id ? true : false;

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>{device?._id ? 'Edit Device' : 'Create Device'}</ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <label className="form-label">ID</label>
          <input
            className="form-control"
            id="id"
            type="text"
            placeholder="living_device"
            value={device._id}
            disabled={isEdit}
            onChange={({ target }) => {
              setDevice({ ...device, _id: target.value });
            }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            id="name"
            type="text"
            placeholder="Living Device"
            value={device.name}
            onChange={({ target }) => {
              setDevice({ ...device, name: target.value });
            }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Owner</label>
          <select
            class="form-select"
            aria-label="Default select example"
            value={device.owner_id}
            onChange={({ target }) => {
              setDevice({ ...device, owner_id: target.value });
            }}
          >
            {users.map((user) => {
              return <option value={user._id}>{user.name}</option>;
            })}
          </select>
        </div>
      </ModalBody>
      <ModalFooter style={{ justifyContent: 'space-between' }}>
        {isEdit ? (
          <div>
            <Button
              color="danger"
              onClick={() => {
                if (isEdit) {
                  axios.delete(`/api/devices/${deviceToEdit._id}`, device).then(() => {
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
                axios.put(`/api/devices/${deviceToEdit._id}`, device).then(() => {
                  setIsOpen(false);
                });
              } else {
                axios.post('/api/devices', device).then(() => {
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

export default addEditModal;
