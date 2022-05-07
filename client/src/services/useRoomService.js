import { useEffect, useState } from 'react';
import axios from 'axios';

// const baseUrl = '/api';
const baseUrl = 'http://localhost:3001'

const getPosition = (id) => {
  return {
    x: 20,
    y: 20 + 60 * id,
  };
};

function useRoomService() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    rooms.forEach((room) => {
      updateRoom(room, false);
    });
  }, [rooms]);

  const getRooms = () => {
    axios.get(`${baseUrl}/rooms`).then(({ data }) => {
      setRooms(
        data.map((room) => {
          return { ...room, id: room._id };
        })
      );
    });
  };

  const updateRoom = (room, withUpdate = true) => {
    room.data.label = undefined;
    axios.put(`${baseUrl}/rooms/${room._id}`, room).then(({ data }) => {
      if (withUpdate) getRooms();
    });
  };

  const addRoom = () => {
    axios
      .post(`${baseUrl}/rooms`, {
        data: { name: `Room ${rooms.length + 1}` },
        position: getPosition(rooms.length),
        sensors: {},
      })
      .then(({ data }) => {
        getRooms();
      });
  };

  const deleteRoom = (room) => {
    axios.delete(`${baseUrl}/rooms/${room._id}`).then(() => {
      getRooms();
    });
  };

  return { rooms, setRooms, getRooms, addRoom, updateRoom, deleteRoom };
}

export default useRoomService;
