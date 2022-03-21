import axios from 'axios';
import React, {useEffect, useState} from 'react'
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap';

const addEditModal = ({isOpen = false, setIsOpen, floor: floorToEdit}) => {

    const [floor, setFloor] = useState(floorToEdit || {})

    useEffect(()=>{
        setFloor(floorToEdit || {});
    }, [floorToEdit])

    const isEdit = floor._id ? true : false;

  return (
    <Modal
    isOpen={isOpen}
  >
    <ModalHeader>
      {floor?._id ? 'Edit Floor' : 'Create Floor'}
    </ModalHeader>
    <ModalBody>
    <div className="mb-3">
        <label className="form-label" for="id">ID</label>
        <input className="form-control" id="id" type="text" placeholder="ground_floor" value={floor._id} disabled={isEdit} onChange={(({target}) => {
            setFloor({...floor, _id: target.value})
        })}/>
    </div>
    <div className="mb-3">
        <label className="form-label" for="name">Name</label>
        <input className="form-control" id="name" type="text" placeholder="Ground Floor" value={floor.name} onChange={(({target}) => {
             setFloor({...floor, name: target.value})
        })}/>
    </div>

    <div className="mb-3">
        <label className="form-label" for="level">Level</label>
        <input className="form-control" id="level" type="number" placeholder="0" value={floor.level} onChange={(({target}) => {
             setFloor({...floor, level: target.value})
        })}/>
    </div>
    </ModalBody>
    <ModalFooter style={{ justifyContent: 'space-between' }}>
        {isEdit ? (
          <div>
            <Button
              color="danger"
              onClick={() => {
                if (isEdit) {
                  axios.delete(`/api/floors/${floorToEdit._id}`, floor).then(() => {
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
                axios.put(`/api/floors/${floorToEdit._id}`, floor).then(() => {
                  setIsOpen(false);
                });
              } else {
                axios.post('/api/floors', floor).then(() => {
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