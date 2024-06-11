import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests

import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';
import Footer from '../Components/Footer';
import Editor from '../Components/Editor';

import '../App.css';

function Offplan() {
  const navigate = useNavigate();
  

  // Initialize state for form fields
  const [formData, setFormData] = useState({
  
    title: '',
    description: '',
    images: [],
    size: '',
    approve: '0',
    date: '12-05-24',
//     propertyType: '',
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
                    <h1 className="h3 mb-0 text-white text-center pt-3">Property Information</h1>
                  
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className='row'>
                    <h3 className="pt-3">Property Basic Information</h3>
                    <div className="form-groups col-md-5">
                      <label htmlFor="title">Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="title"
                        name="title"
                        placeholder="Add your title"
                        value={formData.title}
                        onChange={handleChange}
                      />
                      <div className="pt-4">
                  
                        <div className="row ">
                          <div className="col-md-2">QR Code</div>
                          <div className="col-md-10">
                            <input
                              type="file"
                              className="form-control form-select-sm"
                              name="qr"
                              accept="image/*"
                              multiple
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        
                        <div className="row pt-3">
                          <div className="col-md-2">Logo</div>
                          <div className="col-md-10">
                            <input
                              type="file"
                              className="form-control form-select-sm"
                              name="qr"
                              accept="image/*"
                              multiple
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-md-1'></div>
                    <div className="form-group col-md-5">

                      <label htmlFor="slug">Slug</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="slug"
                        name="slug"
                    
                        placeholder="Slug"
                        value={formData.slug}
                        onChange={handleChange}
                      />
                      <input
                        type="text"
                        className="form-control form-control-sm mt-4"
                        id="price"
                        name="price"
                
                        placeholder="Add your Price"
                        value={formData.price}
                        onChange={handleChange}
                      />
                          <div className='row'>
                        <div className='col-md-6'>
                          <div className="pt-4">
                            <select
                              className="form-select form-select-sm"
                              aria-label=".form-select-sm example"
                              style={{ width: 220 }}
                              name="bedrooms"
                              value={formData.bedrooms}
                              onChange={handleChange}
                            >
                              <option value="" selected>Community</option>
                              <option value="1BR">1BR</option>
                              <option value="2BR">2BR</option>
                            </select>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className="pt-4">
                            <select
                              className="form-select form-select-sm"
                              aria-label=".form-select-sm example"
                              style={{ width: 225 }}
                              name="bathroom"
                              value={formData.bathroom}
                              onChange={handleChange}
                            >
                              <option value="" selected>Property Type</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                            </select>
                          </div>
                        </div>
                      </div>
                  
                    </div>
                  </div>
                  <div className='row mt-4'>
                    <h3 className="pt-3">Property Details</h3>
                    <div className="form-groups col-md-6">
                      <div className='row'>
                        <div className='col-md-5'>
                          <div className="pt-4">
                          <label htmlFor="area">Start Size</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="area"
                        name="area"
                     
                        placeholder="Size"
                        value={formData.area}
                        onChange={handleChange}
                      />
                          </div>
                        </div>
                        <div className='col-md-5'>
                          <div className="pt-4">
                          <label htmlFor="area">End Size</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="area"
                        name="area"
                    
                        placeholder="Size"
                        value={formData.area}
                        onChange={handleChange}
                      />
                          </div>
                        </div>
                      </div>
                      <div className="row pt-4">
                        <div className="col-md-3">Feature image</div>
                        <div className="col-md-9">
                          <input
                            type="file"
                            className="form-control form-select-sm"
                            name="feature_image"
                            accept="image/*"
                            style={{ width: 338 }}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="row pt-4">
                        <div className="col-md-3">Gallery images</div>
                        <div className="col-md-9">
                          <input
                            type="file"
                            className="form-control form-select-sm"
                            name="images"
                            accept="image/*"
                            multiple
                            style={{ width: 338 }}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-md-6 pt-4">
                    <div className='row'>
                        <div className='col-md-5'>
                          <div >
                          <label htmlFor="area">Possession</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="area"
                        name="area"
                     
                        placeholder="Possession"
                        value={formData.area}
                        onChange={handleChange}
                      />
                          </div>
                        </div>
                        <div className='col-md-5'>
                          <div >
                          <label htmlFor="area">Builder Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="area"
                        name="area"
                    
                        placeholder="Builder"
                        value={formData.area}
                        onChange={handleChange}
                      />
                          </div>
                        </div>
                        <div className="row pt-4">
                        <div className="col-md-3">Above image</div>
                        <div className="col-md-9">
                          <input
                            type="file"
                            className="form-control form-select-sm"
                            name="feature_image"
                            accept="image/*"
                            style={{ width: 338 }}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="row pt-4">
                        <div className="col-md-3">Below images</div>
                        <div className="col-md-9">
                          <input
                            type="file"
                            className="form-control form-select-sm"
                            name="images"
                            accept="image/*"
                            multiple
                            style={{ width: 338 }}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      </div>

                   
                    </div>
                    <div className='col-md-11'>
                    <textarea
                        className="form-control form-control-sm mt-4"
                        id="description"
                        name="description"
                      
                        placeholder="Top Description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                      </div>
                  </div>
                  
                  <div className='row pt-5'>
                    <h3 className="pt-3">Property Amenities </h3>
                    <div className='col-md-6 pt-4'>
                      <div className='row'>
                        <div className="form-group col-md-10">
                          <label htmlFor="log">Amenities Title</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="log"
                            name="log"
                            placeholder="Amenities"
                            value={formData.log}
                            onChange={handleChange}
                          />
    <div className='pt-4'>
    <div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1"/>
  <label class="form-check-label" for="inlineCheckbox1">1</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2"/>
  <label class="form-check-label" for="inlineCheckbox2">2</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="option3" />
  <label class="form-check-label" for="inlineCheckbox3">3 </label>
</div>
    </div>
                        </div>
                  
   
                        
                      </div>
                    </div>
                    <div className='col-md-6 pt-4'>
                      <textarea
                        className="form-control form-control-sm mt-4"
                        id="location"
                        name="location"
                        style={{ width: 500 }}
                        placeholder="Amenities Description"
                        value={formData.location}
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
                          {/* <label htmlFor="log"></label> */}
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="log"
                            name="log"
                            placeholder="Location time"
                            value={formData.log}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-5">
                          {/* <label htmlFor="lat">Lat</label> */}
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="lat"
                            name="lat"
                            placeholder="Location name"
                            value={formData.lat}
                            onChange={handleChange}
                          />
                        </div>
                        <div className='col-md-10'>
                      <input
                            type="text"
                            className="form-control form-control-sm"
                            id="lat"
                            name="lat"
                            placeholder="Exect location"
                            value={formData.lat}
                            onChange={handleChange}
                          />
                          </div>
                      </div>
                 
                    </div>
                    <div className='col-md-5 pt-4'>
                    <label htmlFor="log">Location Title</label>
                          <input
                            type="text"
                            className="form-control form-control-sm "
                            id="log"
                            name="log"
                            placeholder="Location"
                            value={formData.log}
                            onChange={handleChange}
                          />   
                      <textarea
                        className="form-control form-control-sm mt-4"
                        id="location"
                        name="location"
                        style={{ width: 500 }}
                        placeholder="Location Description"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className='mt-4 col-md-11'>
                    <h3 className='pt-2 pb-2'>Description</h3>
                    <Editor
                      content={formData.editor}
                      onChange={handleEditorChange}
                    />
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

export default Offplan;
