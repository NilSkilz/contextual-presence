import { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
} from 'react-flow-renderer';
import { Button } from 'reactstrap';
import useRoomService from '../../services/useRoomService';
import RoomModal from '../modals/RoomModal';
import EditEdgeModal from '../modals/EdgeModal';
import useEdgeService from '../../services/useEdgeService';
import ButtonEdge from './Components/ButtonEdge';
import RoomNode from './Components/RoomNode';

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
    (changes) => setEdges((nds) => applyEdgeChanges(changes, nds)),
    [setEdges]
  );

  const onConnect = (params) =>
    setEdges((eds) => {
      // const label = 'Double Click to Set Entity';
      const type = 'buttonEdge';
      return addEdge({ ...params, type }, eds);
    });

  const onNodeDoubleClick = (event, node) => {
    setRoomToEdit(rooms.find((r) => r._id === node._id));
  };

  const onEdgeClick = (event, edge) => {
    // For some reason the label disapears??!
    console.log(edges);
    setEdgeToEdit(edges.find((e) => e._id === edge.id));
  };

  return (
    <>
      <EditEdgeModal
        isOpen={!!edgeToEdit}
        setIsOpen={setEdgeToEdit}
        edge={edgeToEdit}
        updateEdge={(edge) => {
          const edgeToReplace = edges.find((e) => e._id === edge._id);
          const mutatableArray = [...edges];
          const index = edges.indexOf(edgeToReplace);
          if (edgeToReplace) {
            mutatableArray.splice(index, 1, edge);
            setEdges(mutatableArray);
          }
        }}
      />
      <RoomModal
        isOpen={!!roomToEdit}
        setIsOpen={setRoomToEdit}
        room={roomToEdit}
        updateRoom={(room) => {
          const roomToReplace = rooms.find((r) => r._id === room._id);
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
            console.log('Add Room')
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
          nodes={[
            ...rooms.map((room) => {
              return {
                ...room,
                data: {
                  label: <RoomNode room={room} />,
                },
              };
            }),
          ]}
          edges={edges}
          defaultZoom={1}
          minZoom={0.2}
          maxZoom={4}
          zoomOnPinch
          connectionMode="loose"
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDoubleClick={onNodeDoubleClick}
          // onEdgeUpdate={console.log}
          onEdgeClick={onEdgeClick}
          edgeTypes={{
            buttonEdge: ButtonEdge,
          }}
          onConnect={onConnect}
        >
          <Background variant="dots" gap={12} size={0.4} />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
};

export default Dashboard;
