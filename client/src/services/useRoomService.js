import { useEffect, useState } from 'react';
import axios from 'axios';

const getPosition = (id) => {
  return {
    x: 20,
    y: 20 + 60 * id,
  };
};

function useRoomService() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    rooms.forEach(room => {
      updateRoom(room, false)
    })
  }, [rooms])

  const getRooms = () => {
    axios.get('/api/rooms').then(({ data }) => {
      console.log({ data });
      setRooms(
        data.map((room) => {
          return { ...room, id: room._id };
        })
      );
    });
  };

  const updateRoom = (room, withUpdate = true) => {
    axios.put(`/api/rooms/${room._id}`, room).then(({ data }) => {
      if (withUpdate) getRooms();
    });
  };

  const addRoom = () => {
    axios
      .post('/api/rooms', {
        _id: rooms.length.toString(),
        data: { label: `Room ${rooms.length+1}` },
        position: getPosition(rooms.length),
      })
      .then(({ data }) => {
        getRooms();
      });
  };

  return { rooms, setRooms, getRooms, addRoom, updateRoom };
}

export default useRoomService;
