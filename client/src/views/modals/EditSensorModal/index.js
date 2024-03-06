import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import Select from 'react-select';
import useHaService from '../../../services/useHaService';
import OccupancySensor from './Components/OccupancySensor';
import PresenceSensor from './Components/PresenceSensor';
import Slider from 'rc-slider';

const EditSensorModal = ({ isOpen = false, setIsOpen, sensor, saveSensor }) => {
  const [local, setLocal] = useState();

  const { entities, isLoading } = useHaService();

  useEffect(() => {
    if (sensor && !sensor.decay) sensor.decay = 70;
    setLocal(sensor);
  }, [sensor]);

  if (!local) return null;



  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>{'Edit Sensor'}</ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <Select
            className="basic-single mb-3"
            classNamePrefix="select"
            isLoading={isLoading}
            defaultValue={{
              value: local.entity?.entity_id,
              label: (
                <>
                  <div>{local.entity?.attributes?.friendly_name}</div>
                  <div style={{ color: 'grey', fontSize: '12px' }}>
                    {local.entity?.entity_id}
                  </div>
                </>
              ),
            }}
            onChange={({ value }) => {
              const entity = entities.find((e) => e.entity_id === value);

              const mutable = { ...local };
              mutable.entity = entity;
              setLocal(mutable);
            }}
            name="sensor"
            options={entities?.map((entity) => {
              return {
                label: (
                  <>
                    <div>{entity.attributes.friendly_name}</div>
                    <div style={{ color: 'grey', fontSize: '12px' }}>
                      {entity.entity_id}
                    </div>
                  </>
                ),
                value: entity.entity_id,
              };
            })}
          />
        </div>
        <div
          style={{
            fontSize: '12px',
            color: '#aaa',
            marginTop: '10px',
            marginBottom: '10px',
          }}
        >
          Occupancy implies that a person is present, but the specific person is
          unknown. Presence implies that a specific person is present.
        </div>
        <div>
          <input
            type="radio"
            className="mx-3"
            checked={local && local.isOccupancy}
            onChange={({ target }) => {
              console.log({ target });
              if (target.checked) {
                setLocal({ ...local, isOccupancy: true });
              }
            }}
          />
          <label>Occupancy</label>
        </div>
        <div className="mb-3">
          <input
            type="radio"
            className="mx-3"
            checked={local && local.isOccupancy === false}
            onChange={({ target }) => {
              console.log({ target });
              if (target.checked) {
                setLocal({ ...local, isOccupancy: false });
              }
            }}
          />
          <label>Presence</label>
        </div>

        <OccupancySensor
          isOpen={local && local.isOccupancy}
          local={local}
          setLocal={setLocal}
        />

        <PresenceSensor
          isOpen={local && local.isOccupancy === false}
          local={local}
          setLocal={setLocal}
        />
        <label className="form-label">Rate of Decay</label>
        <div
          style={{
            fontSize: '12px',
            color: '#aaa',
            marginTop: '10px',
            marginBottom: '10px',
          }}
        >
          <div>How quickly is a person expected to leave the area?</div>{' '}
          <div>0 = never</div>
          <div>100 = within a minute</div>
          <div style={{ marginLeft: '10px', marginRight: '10px', marginTop: '20px' }}>
            <Slider
              min={0}
              max={100}
              step={10}
              marks={{ 0: '0', 50: '50', 100: '100' }}
              value={local.decay}
              onChange={(e) => {
                setLocal({ ...local, decay: e })
              }}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter style={{ justifyContent: 'space-end' }}>
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
              saveSensor(local);
              setIsOpen(false);
            }}
          >
            Save
          </Button>{' '}
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default EditSensorModal;
