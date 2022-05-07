import { useEffect, useState } from 'react';
import axios from 'axios';

// const baseUrl = '/api';
const baseUrl = 'http://localhost:3001';

const getPosition = (id) => {
  return {
    x: 20,
    y: 20 + 60 * id,
  };
};

function useEdgeService() {
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (edges) {
      edges.forEach((edge) => {
        updateEdge(edge, false);
      });
    }
  }, [edges]);

  const getEdges = () => {
    axios.get(`${baseUrl}/edges`).then(({ data }) => {
      setEdges(
        data.map((edge) => {
          return { ...edge, id: edge._id };
        })
      );
    });
  };

  const updateEdge = (edge, withUpdate = true) => {
    axios.put(`${baseUrl}/edges/${edge._id}`, edge).then(({ data }) => {
      if (withUpdate) getEdges();
    });
  };

  const addEdge = (params) => {
    axios.post(`${baseUrl}/edges`, params).then(({ data }) => {
      getEdges();
    });
  };

  const deleteEdge = (edge) => {
    axios.delete(`${baseUrl}/edges/${edge._id}`).then(() => {
      getEdges();
    });
  };

  return { edges, setEdges, getEdges, addEdge, updateEdge, deleteEdge };
}

export default useEdgeService;
