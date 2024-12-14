import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './Components/NavBar/NavBar';
import './App.css';
import SideMenu from './Components/SideMenu/SideMenu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Components/Login/Login';
import { useEffect, useState } from 'react';
import React from 'react';
import AddMember from './Components/Addmembers/Addmembers';
import CreateEvent from './Components/CreateEvents/CreateEvents';
import UpcomingEvent from './Components/Upcoming/UpcomingEvent';
import ListEvents from './Components/ListEvents/Listevents';
import Listmembers from './Components/Listmembers/Listmembers';
import Feedback from './Components/Feedback/Feedback';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(()=>{
    localStorage.getItem('auth-token')?setLoggedIn(true):setLoggedIn(false);
  },[])
  return (
    <BrowserRouter>
          <NavBar />
          {
            loggedIn&&<SideMenu/>
          }
        <Routes>
          <Route path='/login' element={<Login/>}/>
        <Route path='/feedbacks' element={loggedIn && <Feedback/>}/>
        <Route path="/addmembers" element={loggedIn&&<AddMember />} />
        <Route path="/createevents" element={loggedIn && <CreateEvent/>}/>
        <Route path="/upcoming" element={loggedIn && <UpcomingEvent/>}/>
        <Route path="/listevents" element={loggedIn&&<ListEvents />} />
        <Route path="/listmembers" element={loggedIn&&<Listmembers />} />
      </Routes>
      <ToastContainer/>
    </BrowserRouter>
  );
}

export default App;
