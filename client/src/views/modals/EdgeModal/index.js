import React, { useEffect, useState } from 'react';
import useEdgeService from '../../../services/useEdgeService';
import useHaService from '../../../services/useHaService';
import EditSensorModal from '../EditSensorModal';
import BaseModal from '../BaseModal';
import Select from 'react-select';

const EdgeModal = ({ isOpen = false, setIsOpen, edge, updateEdge }) => {
  const [local, setLocal] = useState();
  const [sensor, setSensor] = useState();

  const { deleteEdge } = useEdgeService();

  const { entities, isLoading } = useHaService();

  useEffect(() => {
    setLocal(edge);
  }, [edge]);

  const saveSensor = (sensor) => {
    const sensors = local.sensors || {};
    sensors[sensor.entity.entity_id.replaceAll('.', '___')] = sensor;
    console.log({ sensors });
    setLocal({ ...local, sensors });
  };

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
          updateEdge(local);
        }}
        deleteThing={() => {
          deleteEdge(local);
        }}
      >
        <>
          <div className="mb-3">
            <label className="form-label">Name</label>
            {edge && (
              <Select
                className="basic-single"
                classNamePrefix="select"
                isLoading={isLoading}
                defaultValue={{
                  value: local?.data?.entity?.entity_id,
                  label: (
                    <>
                      <div>{local?.label}</div>
                      <div style={{ color: 'grey', fontSize: '12px' }}>
                        {local?.data?.entity?.entity_id}
                      </div>
                    </>
                  ),
                }}
                onChange={({ value }) => {
                  const entity = entities.find((e) => e.entity_id === value);
                  setLocal({
                    ...local,
                    data: {
                      ...local.data,
                      entity: entity,
                    },
                    label: entity.attributes.friendly_name || entity.entity_id,
                    type: undefined // Show label instead of button
                  });
                }}
                name="color"
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
            )}
            <div className="form-check mt-3 mb-3">
              <input
                className="form-check-input"
                id="flexCheckDefault"
                type="checkbox"
                checked={local?.data?.directional}
                onChange={({ target }) => {
                  setLocal({
                    ...local,
                    data: { ...local.data, directional: target.checked },
                  });
                }}
              />
              <label className="form-check-label" for="flexCheckDefault">
                Directional?
              </label>
            </div>
            {local?.data?.directional && (
              <div className="row">
                <div className="col-6 mb-3">
                  <input
                    className="form-control"
                    id="exampleFormControlInput1"
                    type="email"
                    placeholder="Enter Value"
                    value={local?.data?.enter}
                    onChange={({ target }) => {
                      setLocal({
                        ...local,
                        data: { ...local.data, enter: target.value },
                      });
                    }}
                  />
                </div>
                <div className="col-6 mb-3">
                  <input
                    className="form-control"
                    id="exampleFormControlInput1"
                    type="email"
                    placeholder="Exit Value"
                    value={local?.data?.exit}
                    onChange={({ target }) => {
                      setLocal({
                        ...local,
                        data: { ...local.data, exit: target.value },
                      });
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      </BaseModal>
    </>
  );
};

export default EdgeModal;
