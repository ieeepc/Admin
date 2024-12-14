import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './Components/NavBar/NavBar';
import SideMenu from './Components/SideMenu/SideMenu';
import AddMember from './Components/Addmembers/Addmembers';
import CreateEvent from './Components/CreateEvents/CreateEvents';
import UpcomingEvent from './Components/Upcoming/UpcomingEvent';
import ListEvents from './Components/ListEvents/Listevents';
import Listmembers from './Components/Listmembers/Listmembers';
import Feedback from './Components/Feedback/Feedback';


const MainApp = () => {
  return (
    <div>
      <NavBar />
      <SideMenu />
      <Routes>
        <Route path="/" element={<Navigate to="/feedbacks" />} />
        <Route path='/feedbacks' element={<Feedback/>}/>
        <Route path="/addmembers" element={<AddMember />} />
        <Route path="/createevents" element={<CreateEvent/>}/>
        <Route path="/upcoming" element={<UpcomingEvent/>}/>
        <Route path="/listevents" element={<ListEvents />} />
        <Route path="/listmembers" element={<Listmembers />} />
      </Routes>
    </div>
  );
};

export default MainApp;
