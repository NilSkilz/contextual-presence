import axios from 'axios';
import React, {useEffect, useState} from 'react'
import {Modal, ModalHeader, ModalBody, ModalFooter, Button, UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody} from 'reactstrap';

const addEditModal = ({isOpen = false, setIsOpen, user: userToEdit}) => {

    const [user, setUser] = useState(userToEdit || {})

    useEffect(()=>{
        setUser(userToEdit || {});
    }, [userToEdit])

   const isEdit = userToEdit?._id ? true : false;

  return (
    <Modal
    isOpen={isOpen}
  >
    <ModalHeader>
      {user?._id ? 'Edit User' : 'Create User'}
    </ModalHeader>
    <ModalBody>
    <div className="mb-3">
        <label className="form-label" for="id">ID</label>
        <input className="form-control" id="id" type="text" placeholder="joe_blogs" value={user._id} disabled={isEdit} onChange={(({target}) => {
            setUser({...user, _id: target.value})
        })}/>
    </div>
    <div className="mb-3">
        <label className="form-label" for="name">Name</label>
        <input className="form-control" id="name" type="text" placeholder="Joe Blogs" value={user.name} onChange={(({target}) => {
             setUser({...user, name: target.value})
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
                  axios.delete(`/api/users/${userToEdit._id}`, user).then(() => {
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
                axios.put(`/api/users/${userToEdit._id}`, user).then(() => {
                  setIsOpen(false);
                });
              } else {
                axios.post('/api/users', user).then(() => {
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