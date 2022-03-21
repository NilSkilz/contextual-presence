import React from 'react';
import Dashboard from './views/dashboard/Dashboard';

const Rooms = React.lazy(() => import('./views/rooms'));
const Devices = React.lazy(() => import('./views/devices'));
const Floors = React.lazy(() => import('./views/floors'));
const Users = React.lazy(() => import('./views/users'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/rooms', name: 'Rooms', element: Rooms, exact: true },
  { path: '/users', name: 'Users', element: Users, exact: true },
  { path: '/floors', name: 'Floors', element: Floors, exact: true },
  { path: '/devices', name: 'Devices', element: Devices, exact: true },
];

export default routes;
