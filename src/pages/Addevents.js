import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests

import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';
import Footer from '../Components/Footer';
import Editor from '../Components/Editor';

import '../App.css';

function Admin() {
  const navigate = useNavigate();
  

  // Initialize state for form fields
  const [formData, setFormData] = useState({
  
    title: '',
    description: '',
    images: [],
    size: '',
    approve: '0',
    date: '12-05-24',
    propertyType: '',
    price: '',
    bedrooms: '',
    features: '',
    city: '',
    country: '',
    location: '',
    feature_image: null,
    log: '',
    lat: '',
    qr: null,
    bathroom: '',
    slug: '',
    status: '',
    area: '',
    editor: ''
  });

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    if (type === 'file') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };

  const handleEditorChange = (content) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      editor: content
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'images' || key === 'qr') {
        for (let i = 0; i < formData[key].length; i++) {
          data.append(key, formData[key][i]);
        }
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post('http://localhost:4000/api/upload-rent', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Form submitted successfully!', response.data);
      // navigate('/success'); // Redirect to a success page after submission
    } catch (error) {
      console.error('There was an error submitting the form!', error.response ? error.response.data : error.message);
    }
  };

  console.log("bf0",formData)
  return (
    <div>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Navbarfg />
            <div className="container-fluid scrollable-content">
              <div className="container-fluid">
                <div className="mb-4">
                  <div className='propertys-div'>
                    <h1 className="h3 mb-0 text-white text-center pt-3">Events Information</h1>
                  
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className='row'>
                    <h3 className="pt-3">Event Basic Information</h3>
                    <div className="form-groups col-md-6">
                      <label htmlFor="title">Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="title"
                        name="title"
                        style={{ width: 515 }}
                        placeholder="Add your title"
                        value={formData.title}
                        onChange={handleChange}
                      />
                      <div className="">
                      <div className='row'>
                        <div className='col-md-5'>
                          <div className="pt-4">
                          <input
                        type="date"
                        className="form-control form-control-sm"
                        id="slug"
                        name="slug"
                       
                        placeholder="Slug"
                        value={formData.slug}
                        onChange={handleChange}
                      />
                          </div>
                        </div>
                        <div className='col-md-5'>
                          <div className="pt-4">
                          <input
                        type="time"
                        className="form-control form-control-sm"
                        id="slug"
                        name="slug"
                       
                        placeholder="Slug"
                        value={formData.slug}
                        onChange={handleChange}
                      />
                          </div>
                        </div>
                      </div>
                        <div className="row pt-4">
                          <div className="col-md-2">Image</div>
                          <div className="col-md-10">
                            <input
                              type="file"
                              className="form-control form-select-sm"
                              name="qr"
                              accept="image/*"
                              multiple
                              style={{ width: 390 }}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="slug">Slug</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="slug"
                        name="slug"
                        style={{ width: 500 }}
                        placeholder="Slug"
                        value={formData.slug}
                        onChange={handleChange}
                      />
                        <textarea
                        className="form-control form-control-sm mt-4"
                        id="description"
                        name="description"
                        style={{ width: 500 }}
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    
                    </div>
                  </div>
             
                  <div className='row pt-5'>
                    <h3 className="pt-3">Property Location</h3>
                    <div className='col-md-6 pt-4'>
                      <div className='row'>
                        <div className="form-group col-md-5">
                          <label htmlFor="log">Long</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="log"
                            name="log"
                            placeholder="Long"
                            value={formData.log}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-5">
                          <label htmlFor="lat">Lat</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="lat"
                            name="lat"
                            placeholder="Lat"
                            value={formData.lat}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className='row'>
                        <div className="form-group col-md-5">
                          <label htmlFor="log">Country</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="log"
                            name="log"
                            placeholder="Long"
                            value={formData.log}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-5">
                          <label htmlFor="lat">City</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="lat"
                            name="lat"
                            placeholder="Lat"
                            value={formData.lat}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 pt-4'>
                      <textarea
                        className="form-control form-control-sm mt-4"
                        id="location"
                        name="location"
                        style={{ width: 500 }}
                        placeholder="Location Description"
                        value={formData.location}
                        onChange={handleChange}
                      />

<textarea
                        className="form-control form-control-sm mt-4"
                        id="location"
                        name="location"
                        style={{ width: 500 }}
                        placeholder="Venue Details"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                 
                  <div className='row pt-5'>
                    <h3 className="pt-3">Organisers </h3>
                    <div className='col-md-6 pt-4 text-center'>
                    
                    <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"/>
  <label class="form-check-label" for="inlineRadio1">jasbir siingh sachdeva
  </label>
</div>


                    </div>
                    <div className='col-md-6 pt-4 text-center'>
                    <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"/>
  <label class="form-check-label" for="inlineRadio2">Sathbir Siingh Sachdeva</label>
</div>
                   
                    </div>
                  </div>
                  <div className='px-4'>
                    <button type="submit" className="btn btn-dark mt-3 px-5 mb-3">Submit</button>
                  </div>
                </form>
              </div>
            </div>
            <Footer />
          </div>
        </div>
        <a className="scroll-to-top rounded" href="#page-top">
          <i className="fas fa-angle-up"></i>
        </a>
      </div>
    </div>
  );
}

export default Admin;
