// Sidebar.js

import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
          <div>
             

{/* <!-- Sidebar --> */}
<ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
{/* 
  <!-- Sidebar - Brand --> */}
  <a class="sidebar-brand d-flex align-items-center justify-content-center" href={"Dashboard"}>
    
    <div class="sidebar-brand-icon ">
    {/* <img class="img-profile rounded" src={"02.jpg"} style={{height:70}}/> */}
    </div>
  </a>
  {/* <hr class="sidebar-divider my-0"/>
  <hr class="sidebar-divider"/> */}

{/* 
  
  <!-- Nav Item - Pages Collapse Menu --> */}
  <li class="nav-item">
    <a class="nav-link" href={"Dashboard"}>
     <i class="fas fa-fw fa-cog"></i>
      <span >Dashboard </span></a>
  </li>
  
  <li class="nav-item">
    <a class="nav-link collapsed" href="users.html" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
      <i class="fas fa-fw fa-cog"></i>
      <span>Add Propertys</span>
    </a>
    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
      <div class="bg-white py-2 collapse-inner rounded">
        
      <Link to="/AddProperty" className="collapse-item">Add Rent/Buy</Link>
        <Link to="/AddOffplan" className="collapse-item">Add offplan</Link>
       
        
        
        
      </div>
    </div>
  </li>
  <li class="nav-item">
    <a class="nav-link collapsed" href="users.html" data-toggle="collapse" data-target="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
      <i class="fas fa-fw fa-cog"></i>
      <span>Hotspot</span>
    </a>
    <div id="collapseFour" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
      <div class="bg-white py-2 collapse-inner rounded">
        
        <a class="collapse-item" href={"Hotspot"}>Add Hotspot</a>
        <a class="collapse-item" href={"Allhotspots"}>All Hotspots</a>
        <a class="collapse-item" href={"Requests"}>Hotspot Requests</a>
        <a class="collapse-item" href={"Rejected"}>Rejected Hotspots</a>
       
        
        
        
      </div>
    </div>
  </li>
  <li class="nav-item">
 
  <Link to="/Addevents" className="nav-link">
  <i class="fas fa-fw fa-cog"></i>Add Events</Link>
    {/* <a class="nav-link" href={"Edit"}>
     <i class="fas fa-fw fa-cog"></i>
      <span >Add Events</span></a> */}
  </li>
   
  
  <li class="nav-item" >
    <a class="nav-link" href={"Enquiry"}>
     <i class="fas fa-fw fa-cog"></i>
      <span >Enquiry</span></a>
  </li>

  <li class="nav-item" >
    <a class="nav-link" href={"Opop"}>
     <i class="fas fa-fw fa-cog"></i>
      <span >Location</span></a>
  </li>
  

  
  <li class="nav-item" >
    <a class="nav-link" href={"Change"}>
     <i class="fas fa-fw fa-cog"></i>
      <span >Change password</span></a>
  </li>
 
{/* 
  <!-- Nav Item - Utilities Collapse Menu --> */}
  

  {/* <!-- Divider --> */}
  

  
 

 {/*  <!-- Sidebar Toggler (Sidebar) --> */}
 
</ul>
        </div>
    );
}

export default Sidebar;
