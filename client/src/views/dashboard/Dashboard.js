import { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
  useNodesState,
  applyEdgeChanges,
  applyNodeChanges,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  updateEdge,
} from 'react-flow-renderer';
import { Button } from 'reactstrap';
import useRoomService from '../../services/useRoomService';
import EditRoomModal from './EditRoomModal';
import EditEdgeModal from './EditEdgeModal';
import useEdgeService from '../../services/useEdgeService';

const Dashboard = () => {
  const { rooms, setRooms, getRooms, addRoom, updateRoom } = useRoomService();
  const { edges, setEdges, getEdges, addEdge, updateEdge } = useEdgeService();

  const [roomToEdit, setRoomToEdit] = useState();
  const [edgeToEdit, setEdgeToEdit] = useState();

  useEffect(() => {
    getRooms();
    getEdges();
  }, []);

  // const [nodes, setNodes] = useState(initialNodes);
  // const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onNodesChange = useCallback(
    (changes) => setRooms((nds) => applyNodeChanges(changes, nds)),
    [setRooms]
  );

  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((nds) => {
        console.log({ changes, nds });
        applyEdgeChanges(changes, nds);
      }),
    [setEdges]
  );

  const onConnect = (params) =>
    setEdges((els) => {
      console.log({ params, els });
      params.label = 'Double Click to Set Entity';
      return addEdge(params);
    });

  const onNodeDoubleClick = (event, node) => {
    console.log({ node });
    setRoomToEdit(node);
  };

  const onEdgeDoubleClick = (event, node) => {
    console.log({ node });
    setEdgeToEdit(node);
  };

  return (
    <>
      <EditEdgeModal
        isOpen={!!edgeToEdit}
        setIsOpen={setEdgeToEdit}
        room={roomToEdit}
        updateEdge={(edge) => {
          const roomToReplace = rooms.find((r) => r.id === room.id);
          const mutatableArray = [...rooms];
          const index = rooms.indexOf(roomToReplace);
          if (roomToReplace) {
            mutatableArray.splice(index, 1, room);
            setRooms(mutatableArray);
          }
        }}
      />
      <EditRoomModal
        isOpen={!!roomToEdit}
        setIsOpen={setRoomToEdit}
        room={roomToEdit}
        updateRoom={(room) => {
          const roomToReplace = rooms.find((r) => r.id === room.id);
          const mutatableArray = [...rooms];
          const index = rooms.indexOf(roomToReplace);
          if (roomToReplace) {
            mutatableArray.splice(index, 1, room);
            setRooms(mutatableArray);
          }
        }}
      />
      <div>
        <Button
          color="primary"
          onClick={() => {
            addRoom();
          }}
        >
          Add Room
        </Button>
      </div>
      <div style={{ height: '600px' }}>
        <ReactFlow
          nodesConnectable
          elementsSelectable
          nodesDraggable
          nodes={rooms}
          edges={edges}
          defaultZoom={1}
          minZoom={0.2}
          maxZoom={4}
          zoomOnPinch
          connectionMode="loose"
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDoubleClick={onNodeDoubleClick}
          onEdgeUpdate={console.log}
          onConnect={onConnect}
          onEdgeDoubleClick={onEdgeDoubleClick}
        >
          <Background variant="dots" gap={12} size={0.4} />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
};

export default Dashboard;
