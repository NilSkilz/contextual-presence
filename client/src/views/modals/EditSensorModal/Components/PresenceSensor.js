import { OPERATORS } from '../../../../constants';
import { Collapse, Row } from 'reactstrap';
import Select from 'react-select';

const PresenceSensor = ({ isOpen, local, setLocal }) => {
  return (
    <Collapse isOpen={isOpen}>
      <div>
        <label>Person to detect:</label>
        <input
          className="form-control"
          id="name"
          type="text"
          placeholder="John Doe"
          value={local?.name}
          onChange={({ target }) => {
            setLocal({
              ...local,
              name: target.value,
            });
          }}
        />
      </div>

      <Row>
        <div className="col-4">
          <label>Key:</label>
          <input
            className="form-control"
            id="name"
            type="text"
            placeholder="attributes.faces"
            value={local?.key}
            onChange={({ target }) => {
              setLocal({
                ...local,
                key: target.value,
              });
            }}
          />
        </div>
        <div className="col-4">
          <label>Operator:</label>
          <Select
            className="basic-single mb-3"
            classNamePrefix="select"
            defaultValue={{
              value: local.operator,
              label: OPERATORS[local.operator],
            }}
            onChange={({ value }) => {
              setLocal({ ...local, operator: value });
            }}
            name="sensor"
            options={Object.keys(OPERATORS).map((key) => {
              return {
                label: OPERATORS[key],
                value: key,
              };
            })}
          />
        </div>
        <div className="col-4">
          <label>Value:</label>
          <input
            className="form-control"
            id="name"
            type="text"
            placeholder="john_doe"
            value={local?.value}
            onChange={({ target }) => {
              setLocal({
                ...local,
                value: target.value,
              });
            }}
          />
        </div>
      </Row>
    </Collapse>
  );
};

export default PresenceSensor;
