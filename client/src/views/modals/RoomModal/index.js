import React, { useEffect, useState } from 'react';
import { Button, Table } from 'reactstrap';
import useRoomService from '../../../services/useRoomService';
import useHaService from '../../../services/useHaService';
import EditSensorModal from '../EditSensorModal';
import BaseModal from '../BaseModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { OPERATORS } from '../../../constants';
import Select from 'react-select';

const RoomModal = ({ isOpen = false, setIsOpen, room, updateRoom }) => {
  const [local, setLocal] = useState();
  const [sensor, setSensor] = useState();

  const { deleteRoom } = useRoomService();

  const { entities, isLoading } = useHaService();

  useEffect(() => {
    setLocal(room);
  }, [room]);

  const saveSensor = (sensor) => {
    const sensors = local.sensors || {};
    sensors[sensor.entity.entity_id.replaceAll('.', '___')] = sensor;
    console.log({ sensors });
    setLocal({ ...local, sensors });
  };

  if (!local) return null;

  return (
    <>
      <EditSensorModal
        isOpen={!!sensor}
        setIsOpen={setSensor}
        sensor={sensor}
        saveSensor={saveSensor}
      />
      <BaseModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        updateThing={() => {
          updateRoom(local);
        }}
        deleteThing={() => {
          deleteRoom(local);
        }}
      >
        <>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              id="name"
              type="text"
              placeholder="Living Room"
              value={local?.data?.name}
              onChange={({ target }) => {
                setLocal({
                  ...local,
                  data: { ...local.data, name: target.value },
                });
              }}
            />
          </div>
          <div>
            <label className="form-label">Home Assistant Helper</label>
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

                console.log({entity})

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

          {Object.keys(local?.sensors || {}).length ? (
            <div
              style={{
                marginRight: '10px',
                marginLeft: '10px',
              }}
            >
              <Table
                style={{
                  tableLayout: 'fixed',
                  fontSize: '12px',
                }}
              >
                <thead>
                  <tr>
                    <th style={{ width: '70%' }}>Sensors:</th>
                    {/* <th>Key:</th> */}
                    {/* <th></th> */}
                    {/* <th>Value:</th> */}
                    <th style={{ width: '20%' }}></th>
                    <th style={{ width: '10%' }}></th>
                  </tr>
                  {Object.keys(local.sensors).map((key) => {
                    return (
                      <tr>
                        <td style={{ verticalAlign: 'middle' }}>
                          {key.replace('___', '.')}
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>{`${
                          local.sensors[key].key
                        } ${OPERATORS[local.sensors[key].operator]} ${
                          local.sensors[key].value
                        }`}</td>
                        {/* <td>{OPERATORS[local.sensors[key].operator]}</td> */}
                        {/* <td>{local.sensors[key].value}</td> */}
                        <td>
                          <Button
                            color="link"
                            size="sm"
                            style={{ padding: 0 }}
                            onClick={() => {
                              setSensor(local.sensors[key]);
                            }}
                          >
                            <FontAwesomeIcon icon={faPencil} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </thead>
              </Table>
            </div>
          ) : null}

          <Button
            color="link"
            onClick={() => {
              if (!local.data) {
                local.data = {};
              }
              setSensor({});
              // const sensors = local.data.sensors || [];
              // sensors.push({});

              // setLocal({ ...local, data: { ...local.data, sensors } });
            }}
          >
            <div style={{ fontSize: '10px' }}>Add Sensor</div>
          </Button>
        </>
      </BaseModal>
    </>
  );
};

export default RoomModal;
