import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import useHaService from '../../../../services/useHaService';
import useWebsocketService from '../../../../services/useWebsocketService';
import { io } from 'socket.io-client';
import { useEffect, useMemo, useState } from 'react';

const RoomNode = ({ room }) => {
  const [local, setLocal] = useState(room);
  const { entities, isLoading } = useHaService();

  const [manager] = useWebsocketService();

  useEffect(() => {
    const socket = manager.socket('/');

    socket.on(room._id, (data) => {
      if (JSON.stringify(data) !== JSON.stringify(local)) {
        console.log({local, data})
        setLocal({...data});
      }
    });

    manager.open();
  }, []);

  if (isLoading) return null;

  console.log({local})

  const roomHelper = entities.find(
    (e) => e.entity_id === room.entity?.entity_id
  );

  return (
    <>
      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
        {local.data?.name}
      </div>
      {/* <div>People: {room.occupancy?.length || 0}</div> */}
      <div style={{ display: 'flex', marginTop: '20px' }}>
        {roomHelper?.state}
      </div>
      {local.occupancy?.map((o, index) => {
        return (
          <div key={index} style={{ display: 'flex', marginTop: '20px' }}>
            {o.confidence}
          </div>
        );
      })}
    </>
  );
};

export default RoomNode;
