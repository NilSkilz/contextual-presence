import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilLayers,
  cilSofa,
  cilGroup,
  cilBolt,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [

  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Data Stores',
  },
  {
    component: CNavItem,
    name: 'Floors',
    to: '/floors',
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  },{
    component: CNavItem,
    name: 'Rooms',
    to: '/rooms',
    icon: <CIcon icon={cilSofa} customClassName="nav-icon" />,
  },{
    component: CNavItem,
    name: 'Devices',
    to: '/devices',
    icon: <CIcon icon={cilBolt} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
  }
]

export default _nav
