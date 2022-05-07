import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const BaseModal = ({
  isOpen = false,
  setIsOpen,
  updateThing,
  deleteThing,
  children,
}) => {
  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>{'Edit Portal'}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter style={{ justifyContent: 'space-between' }}>
        {deleteThing ? (
          <div>
            <Button
              color="danger"
              onClick={() => {
                deleteThing();
                setIsOpen(false);
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
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>{' '}
          <Button
            color="primary"
            onClick={() => {
              updateThing();
              setIsOpen(false);
            }}
          >
            Save
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default BaseModal;
