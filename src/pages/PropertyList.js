
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate, useHistory } from 'react-router-dom';
import { Route, Link, Routes } from 'react-router-dom';
import { fetch } from 'whatwg-fetch';
import { Form, Button, Navbar, Nav, Container, Carousel, Table } from 'react-bootstrap';
import Sidebar from '../Components/Sidebar'
import Navbarfg from '../Components/Navbar'
import Footer from '../Components/Footer'
import '../App.css';


function PropertyList() {
          return (
                    <div  >
                              {/* <!-- Page Wrapper --> */}
                              <div id="wrapper" >
                                        <Sidebar />
                                        {/* <!-- Sidebar --> */}
                                        <div id="content-wrapper" class="d-flex flex-column">
                                                  <div id="content">
                                                            <Navbarfg />
                                                            {/*  <!-- Begin Page Content --> */}
                                                            <div class="container-fluid">
                                                                      {/*  <!-- Page Heading --> */}
                                                                      <div class="d-sm-flex align-items-center justify-content-between mb-4">

                                                                                <h1 class="h3 mb-0 text-gray-800">All Pros</h1>

                                                                      </div>
                                                                      <table id="example" class="table table-striped table-bordered table-responsive" >
                                                                                <thead>
                                                                                          <tr>
                                                                                                    <th class="bl5">PNAME</th>  <th class="bl5">Description</th><th class="bl5">Published By</th> <th class="bl5">Title</th><th class="bl5">categories</th><th class="bl5">Phone</th><th class="bl5">Address</th> <th class="bl5">Images</th>  <th class="bl5">action</th>
                                                                                          </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                          <td>ert</td>
                                                                                          <td>dftfygjhbngcbgjuttgnv fhvn fdgn hgcnv fhcgnv xcnb xfcgbb dxfcg</td>
                                                                                          <td>rsgd rgfcxfb rg rtfgbcvbrdgfvb</td>
                                                                                          <td>sfdg dfg srdfg rdfgb rdfgbv refg</td>
                                                                                          <td>zdgxfhchmn  xfcghv ffcghvn fdghcb rdgv srdgf fdgcb retfg zxc</td>
                                                                                          <td>
                                                                                                   fg</td>
                                                                                          <td>esgb</td>
                                                                                          <td>sdhg</td>
                                                                                          <td>sdf</td>



                                                                                </tbody>
                                                                      </table>
                                                            </div>
                                                  </div> <Footer />
                                        </div>
                                        <a class="scroll-to-top rounded" href="#page-top">
                                                  <i class="fas fa-angle-up"></i>
                                        </a>
                              </div>
                    </div>
          );

}
export default PropertyList;
