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

const EditRoomModal = ({
  isOpen = false,
  setIsOpen,
  room,
  updateRoom,
}) => {
  const [local, setLocal] = useState();

  useEffect(() => {
    setLocal(room);
  }, [room]);

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>{'Edit Room'}</ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            id="name"
            type="text"
            placeholder="Living Room"
            value={local?.data?.label}
            onChange={({ target }) => {
              setLocal({
                ...local,
                data: { ...local.data, label: target.value },
              });
              
            }}
          />
        </div>
      </ModalBody>
      <ModalFooter style={{ justifyContent: 'space-between' }}>
        <div>
          <Button
            color="danger"
            onClick={() => {
              axios.delete(`/api/rooms/${room._id}`, room).then(() => {
                setIsOpen(false);
              });
            }}
          >
            Delete
          </Button>
        </div>

        <div>
          <Button
            color="primary"
            onClick={() => {
              updateRoom(local);
              setIsOpen(false);
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

export default EditRoomModal;
