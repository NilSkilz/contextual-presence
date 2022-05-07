import { Manager } from 'socket.io-client';

const useWebsocketService = () => {
  const manager = new Manager('ws://localhost:3001', {
    reconnectionDelayMax: 10000,
    autoConnect: true,
  });

  return [manager];
};

export default useWebsocketService;

// const socket = manager.socket("/", {
//   auth: {
//     token: "123"
//   }
// });
