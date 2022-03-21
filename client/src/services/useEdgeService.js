import { useEffect, useState } from 'react';
import axios from 'axios';

const getPosition = (id) => {
  return {
    x: 20,
    y: 20 + 60 * id,
  };
};

function useEdgeService() {
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    console.log(edges);
    if (edges) {
      edges.forEach((edge) => {
        updateEdge(edge, false);
      });
    }
  }, [edges]);

  const getEdges = () => {
    axios.get('/api/edges').then(({ data }) => {
      console.log({ data });
      setEdges(
        data.map((edge) => {
          return { ...edge, id: edge._id };
        })
      );
    });
  };

  const updateEdge = (edge, withUpdate = true) => {
    axios.put(`/api/edges/${edge._id}`, edge).then(({ data }) => {
      if (withUpdate) getEdges();
    });
  };

  const addEdge = (params) => {
    axios.post('/api/edges', params).then(({ data }) => {
      getEdges();
    });
  };

  return { edges, setEdges, getEdges, addEdge, updateEdge };
}

export default useEdgeService;
