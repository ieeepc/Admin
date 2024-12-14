import React, { useEffect, useState } from 'react'
import './SideMenu.css'
import { Link, useLocation } from 'react-router-dom'

const SideMenu = () => {
  const location = useLocation();
  const getMenuFromPath = (pathname) => {
    if (pathname === "/addmembers") return "addmembers";
    if (pathname === "/feedbacks") return "feedbacks";
    if (pathname === "/createevents") return "createevents";
    if (pathname === "/upcoming") return "upcoming";
    if (pathname === "/listevents") return "listevents";
    if (pathname === "/listmembers") return "listmembers";
  };
  const [menu, setMenu] = useState(getMenuFromPath(location.pathname));

  useEffect(() => {
    setMenu(getMenuFromPath(location.pathname));
  }, [location.pathname]);
  const onActiveStyle ={
    backgroundColor:" rgb(236, 236, 236)"
  }
  return (
    <div className='sidemenu'>
      <Link to={'/feedbacks'}><button className='Feedbacks menu' style={menu === "feedbacks" ? onActiveStyle : {}}>Feedbacks</button></Link>
      <Link to={'/addmembers'}><button className='Add-members menu' style={menu === "addmembers" ? onActiveStyle : {}}>Add Members</button></Link>
      <Link to={'/createevents'}><button className='Create-events menu' style={menu === "createevents" ? onActiveStyle : {}}>Add Events</button></Link>
      <Link to={'/upcoming'}><button className='Upcoming-event menu' style={menu === "upcoming" ? onActiveStyle : {}}>Upcoming Event</button></Link>
      <Link to={'/listmembers'}><button className='List-members menu' style={menu === "listmembers" ? onActiveStyle : {}}>List Members</button></Link>
      <Link to={'/listevents'}><button className='List-events menu' style={menu === "listevents" ? onActiveStyle : {}}>List Events</button></Link>
    </div>
  )
}

export default SideMenu
