import { useEffect, useState } from 'react';
import {
  getAuth,
  createConnection,
  subscribeEntities,
  ERR_INVALID_AUTH,
  ERR_CANNOT_CONNECT,
  getCollection,
  getStates,
} from 'home-assistant-js-websocket';

const hassUrl = 'https://ha.pidgeonsnest.uk';

const getConnection = () => {
  return getAuth({
    hassUrl,
    saveTokens: (token) => {
      // console.log({ token });
      window.localStorage.setItem('auth', JSON.stringify(token));
    },
    loadTokens: () => {
      // console.log('LOADING TOKEN');
      const token = JSON.parse(window.localStorage.getItem('auth'));
      // console.log({ token });
      return Promise.resolve(token);
    },
  })
    .then((auth) => {
      // console.log('Connected');
      return createConnection({ auth });
    })
    .catch((err) => {
      if (err === ERR_CANNOT_CONNECT) console.log('Cannot Connect');
      if (err === ERR_INVALID_AUTH) console.log('Invalid Auth');
    });

  // subscribeEntities(connection, (ent) => console.log(ent));
};

const useHaService = () => {
  const [entities, setEntites] = useState();
  const [isLoading, setIsLoading] = useState(true);
 
  const [connection, setConnection] = useState();

  useEffect(() => {
    getConnection().then((c) => {
      setConnection(c);
    });
  }, []);

  useEffect(() => {
    if (connection) {
      getStates(connection).then((entities) => {
        setEntites(entities);
        setIsLoading(false)
      });
    }
  }, [connection]);

  return { entities, isLoading };
};

export default useHaService;
