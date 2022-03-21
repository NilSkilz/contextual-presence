import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const EditEdgeModal = ({ isOpen = false, setIsOpen, edge, updateEdge }) => {
  const [local, setLocal] = useState();

  useEffect(() => {
    setLocal(edge);
  }, [edge]);

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>{'Edit Portal'}</ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            id="name"
            type="text"
            placeholder="Entity"
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
              axios.delete(`/api/edges/${edge._id}`, edge).then(() => {
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
              updateEdge(local);
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

export default EditEdgeModal;
