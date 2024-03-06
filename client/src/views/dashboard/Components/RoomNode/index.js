import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import useHaService from '../../../../services/useHaService';
import useWebsocketService from '../../../../services/useWebsocketService';
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react';


const getPersonLabel = (state) => {
  console.log({ state })
  if (!state) return '';
  if (state === '1.0') return '1 Person'

  const num = parseInt(state);

  return `${num} People`

}


const RoomNode = ({ room }) => {
  const [local, setLocal] = useState(room);
  const { entities, isLoading } = useHaService();

  const [manager] = useWebsocketService();

  useEffect(() => {
    const socket = manager.socket('/');

    socket.on(room._id, (data) => {
      if (JSON.stringify(data) !== JSON.stringify(local)) {
        console.log({ local, data })
        setLocal({ ...data });
      }
    });

    manager.open();
  }, []);

  if (isLoading) return null;

  console.log({ local })

  const roomHelper = entities.find(
    (e) => e.entity_id === room.entity?.entity_id
  );

  return (
    <>
      <div style={{ fontSize: '14px', fontWeight: 'bold', }}>
        {local.data?.name}
      </div>
      <div style={{ display: 'flex', marginTop: '20px' }}>
        {/* {getPersonLabel(roomHelper?.state)} */}
      </div>
      {local.occupancy?.map((o, index) => {
        return (
          <div key={index} style={{ textAlign: 'left', marginTop: '20px' }}>
            <div>{o.name || 'Unknown Person'}</div>
            <div style={{ color: '#aaa' }}>Confidence: <span style={{ color: o.confidence >= 90 ? 'green' : 'orange' }}>{o.confidence}%</span></div>
            <div style={{ color: '#aaa' }}>Last seen: {moment.unix(o.timestamp).fromNow()}</div>
          </div>
        );
      })}
    </>
  );
};

export default RoomNode;
