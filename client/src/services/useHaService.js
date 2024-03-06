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

const hassUrl = 'https://ha.cracky.co.uk';

const getConnection = () => {
  console.log('Getting auth')
  return getAuth({
    hassUrl,
    saveTokens: (token) => {
      console.log({ token });
      window.localStorage.setItem('auth', JSON.stringify(token));
    },
    loadTokens: () => {
      console.log('LOADING TOKEN');
      const token = JSON.parse(window.localStorage.getItem('auth'));
      console.log({ token });
      return Promise.resolve(token);
    },
  })
    .then((auth) => {
      console.log('Connected');
      console.log(auth)
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
    // const token = JSON.parse(window.localStorage.getItem('auth'));
    console.log('use effect')
    console.log(connection)

    if (!connection) {
      getConnection().then((c) => {
        console.log({ c })
        if (c) setConnection(c);
      });
    }
  }, []);

  useEffect(() => {
    if (connection) {
      console.log('Getting states');
      getStates(connection).then((entities) => {
        setEntites(entities);
        setIsLoading(false);
      });
    } else {
      console.log('Not connected');
    }
  }, [connection]);

  return { entities, isLoading };
};

export default useHaService;
