import { Form, Button, Container, Nav } from 'react-bootstrap';
import React, { Component, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Route, Link, Router, Routes, Navigate, useLocation } from 'react-router-dom';
import { fetch } from 'whatwg-fetch';
import Admin from './pages/Admin';
import PropertyList from './pages/PropertyList';
import AddProperty from './pages/AddProperty';
import AddOffplan from './pages/AddOffplan';
import Addevents from './pages/Addevents';

import './App.css';

function Home() {


  return (


    <div>



      <Routes >
        <Route exact path="/" element={<Admin />}></Route>
        <Route exact path="/PropertyList" element={<PropertyList />}></Route>
        <Route exact path="/AddProperty" element={<AddProperty />}></Route>
        <Route exact path="/AddOffplan" element={<AddOffplan />}></Route>
        <Route exact path="/Addevents" element={<Addevents />}></Route>
      </Routes>

    </div>



  );

}

export default Home;
