// routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./dbconnection');
const fs = require('fs');
const { parse, format } = require('date-fns');
const bcrypt = require('bcrypt');
const sharp = require('sharp');



const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create uploads directory if not exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}




// Route to add data in events
router.post('/upload-events', upload.single('image'), (req, res) => {
  try {
    const { title, description, location, date, time } = req.body;

    // Check if all required fields are present
    if (!title || !description || !location || !date || !time || !req.file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Parse and format the date and time
    const dateTimeString = `${date} ${time}`;
    const parsedDateTime = parse(dateTimeString, 'yyyy-MM-dd HH:mm', new Date());
    const formattedDateTime = format(parsedDateTime, 'yyyy-MM-dd HH:mm:ss');

    // Handle uploaded image (file)
    const imagePath = req.file.path; // Path to the uploaded image

    // Save the data to the database
    const query = 'INSERT INTO events (title, description, location, datetime, image) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [title, description, location, formattedDateTime, imagePath], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database insertion failed' });
      }
      res.status(201).json({ message: 'Data uploaded successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Route to update event data
router.put('/update-event/:id', upload.single('image'), (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, description, location, date, time } = req.body;
    let updateFields = [];
    let queryParams = [];

    // Check if event ID is present
    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    // Prepare fields to update
    if (title) {
      updateFields.push('title = ?');
      queryParams.push(title);
    }
    if (description) {
      updateFields.push('description = ?');
      queryParams.push(description);
    }
    if (location) {
      updateFields.push('location = ?');
      queryParams.push(location);
    }
    if (date && time) {
      const dateTimeString = `${date} ${time}`;
      const parsedDateTime = parse(dateTimeString, 'yyyy-MM-dd HH:mm', new Date());
      const formattedDateTime = format(parsedDateTime, 'yyyy-MM-dd HH:mm:ss');
      updateFields.push('datetime = ?');
      queryParams.push(formattedDateTime);
    }
    if (req.file) {
      updateFields.push('image = ?');
      queryParams.push(req.file.path);
    }

    // Check if there are any fields to update
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Add the event ID to the parameters
    queryParams.push(eventId);

    // Construct the query
    const query = `UPDATE events SET ${updateFields.join(', ')} WHERE id = ?`;

    // Execute the query
    db.query(query, queryParams, (err, result) => {
      if (err) {
        console.error('Database update error:', err);
        return res.status(500).json({ error: 'Database update failed' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.status(200).json({ message: 'Event updated successfully' });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});




// add rent propertys 
router.post('/upload-rent', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'feature_image', maxCount: 1 },
  { name: 'qr', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      title, description, size, date, propertyType, price, bedrooms, features, country,
      city, location, approve, lat, log, zip, bathroom, slug, status, area, editor
    } = req.body;

    // if (!title || !description || !size || !date || !propertyType || !price || !bedrooms || !features || !country || !city || !location || approve === undefined) {
    //   return res.status(400).json({ error: 'Missing required fields' });
    // }

    const processImage = async (filePath) => {
      const buffer = await sharp(filePath)
        .webp({ quality: 80 })
        .toBuffer();

      let compressedBuffer = buffer;
      while (compressedBuffer.length > 200 * 1024) { // 200 KB
        compressedBuffer = await sharp(buffer)
          .webp({ quality: 80 })
          .toBuffer();
      }

      const compressedPath = `uploads/${path.basename(filePath, path.extname(filePath))}.webp`;
      fs.writeFileSync(compressedPath, compressedBuffer);
      return compressedPath;
    };

    const images = req.files['images'] ? await Promise.all(req.files['images'].map(async (file) => {
      return await processImage(file.path);
    })) : null;

    const featureImage = req.files['feature_image'] ? await processImage(req.files['feature_image'][0].path) : null;
    const qrImage = req.files['qr'] ? await processImage(req.files['qr'][0].path) : null;

    // Parse and format the date
    let formattedDate;
    try {
      const parsedDate = parse(date, 'dd-MM-yyyy', new Date());
      formattedDate = format(parsedDate, 'yyyy-MM-dd');
    } catch (dateError) {
      return res.status(400).json({ error: 'Invalid date format. Use dd-MM-yyyy.' });
    }

    const query = `
      INSERT INTO rent (
        title, description, images, size, date, propertyType, price, bedrooms, features, country, 
        city, location, approve, lat, log, zip, bathroom, slug, status, area, editor, feature_image, qr
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      title, description, images ? images.join(',') : null, size, formattedDate, propertyType, price, bedrooms, features, country,
      city, location, approve, lat, log, zip, bathroom, slug, status, area, editor, featureImage, qrImage
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database insertion failed' });
      }
      res.status(201).json({ message: 'Data uploaded successfully', id: result.insertId });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


// Update rent property
router.put('/update-rent/:id', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'feature_image', maxCount: 1 },
  { name: 'qr', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      title, description, size, date, propertyType, price, bedrooms, features, country,
      city, location, approve, lat, log, zip, bathroom, slug, status, area, editor
    } = req.body;

    const { id } = req.params;

    const processImage = async (filePath) => {
      const buffer = await sharp(filePath)
        .webp({ quality: 80 })
        .toBuffer();

      let compressedBuffer = buffer;
      while (compressedBuffer.length > 200 * 1024) { // 200 KB
        compressedBuffer = await sharp(buffer)
          .webp({ quality: 80 })
          .toBuffer();
      }

      const compressedPath = `uploads/${path.basename(filePath, path.extname(filePath))}.webp`;
      fs.writeFileSync(compressedPath, compressedBuffer);
      return compressedPath;
    };

    const images = req.files['images'] ? await Promise.all(req.files['images'].map(async (file) => {
      return await processImage(file.path);
    })) : null;

    const featureImage = req.files['feature_image'] ? await processImage(req.files['feature_image'][0].path) : null;
    const qrImage = req.files['qr'] ? await processImage(req.files['qr'][0].path) : null;

    // Parse and format the date
    let formattedDate;
    try {
      const parsedDate = parse(date, 'dd-MM-yyyy', new Date());
      formattedDate = format(parsedDate, 'yyyy-MM-dd');
    } catch (dateError) {
      return res.status(400).json({ error: 'Invalid date format. Use dd-MM-yyyy.' });
    }

    const query = `
      UPDATE rent SET
        title = ?, description = ?, images = ?, size = ?, date = ?, propertyType = ?, price = ?, bedrooms = ?, features = ?, country = ?, 
        city = ?, location = ?, approve = ?, lat = ?, log = ?, zip = ?, bathroom = ?, slug = ?, status = ?, area = ?, editor = ?, feature_image = ?, qr = ?
      WHERE id = ?
    `;
    const values = [
      title, description, images ? images.join(',') : null, size, formattedDate, propertyType, price, bedrooms, features, country,
      city, location, approve, lat, log, zip, bathroom, slug, status, area, editor, featureImage, qrImage, id
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database update failed' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'No record found with the given ID' });
      }
      res.status(200).json({ message: 'Data updated successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


// add offplan propertys 
router.post('/upload-offplan', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'feature_image', maxCount: 1 },
  { name: 'qr', maxCount: 1 },
  { name: 'aboveBg', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'lowerBg', maxCount: 1 },
  { name: 'floorPlanimg', maxCount: 5 },
]), async (req, res) => {
  try {
    const {
      title, description, sizeStart, sizeEnd, pos, community, floorplan, date, propertyType, price, country,
      city, exectLocation, approve, lat, log, slug, editor
    } = req.body;

    const processImage = async (filePath) => {
      const buffer = await sharp(filePath)
        .webp({ quality: 80 })
        .toBuffer();

      let compressedBuffer = buffer;
      while (compressedBuffer.length > 200 * 1024) { // 200 KB
        compressedBuffer = await sharp(buffer)
          .webp({ quality: 80 })
          .toBuffer();
      }

      const compressedPath = `uploads/${path.basename(filePath, path.extname(filePath))}.webp`;
      fs.writeFileSync(compressedPath, compressedBuffer);
      return compressedPath;
    };

    const images = req.files['images'] ? await Promise.all(req.files['images'].map(async (file) => {
      return await processImage(file.path);
    })) : null;

    const floorPlanimg = req.files['floorPlanimg'] ? await Promise.all(req.files['floorPlanimg'].map(async (file) => {
      return await processImage(file.path);
    })) : null;

    const featureImage = req.files['feature_image'] ? await processImage(req.files['feature_image'][0].path) : null;
    const aboveBg = req.files['aboveBg'] ? await processImage(req.files['aboveBg'][0].path) : null;
    const lowerBg = req.files['lowerBg'] ? await processImage(req.files['lowerBg'][0].path) : null;
    const qrImage = req.files['qr'] ? await processImage(req.files['qr'][0].path) : null;
    const logo = req.files['logo'] ? await processImage(req.files['logo'][0].path) : null;

    // Parse and format the date
    let formattedDate;
    try {
      const parsedDate = parse(date, 'dd-MM-yyyy', new Date());
      formattedDate = format(parsedDate, 'yyyy-MM-dd');
    } catch (dateError) {
      return res.status(400).json({ error: 'Invalid date format. Use dd-MM-yyyy.' });
    }

    const query = `
      INSERT INTO offplan (
        title, description, images, floorPlanimg, date, propertyType, price, community, country, aboveBg, logo, lowerBg, 
        city, approve, lat, log, slug, sizeStart, sizeEnd, pos, floorplan, exectLocation, editor, feature_image, qr
      ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      title, description, images ? images.join(',') : null, floorPlanimg ? floorPlanimg.join(',') : null, formattedDate, propertyType, price, community, country, aboveBg, logo, lowerBg,
       city, approve, lat, log, slug, sizeStart, sizeEnd, pos, floorplan, exectLocation, editor, featureImage, qrImage
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database insertion failed' });
      }
      res.status(201).json({ message: 'Data uploaded successfully', id: result.insertId });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


// Update offplan property
router.put('/update-offplan/:id', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'feature_image', maxCount: 1 },
  { name: 'qr', maxCount: 1 },
  { name: 'aboveBg', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'lowerBg', maxCount: 1 },
  { name: 'floorPlanimg', maxCount: 5 },
]), async (req, res) => {
  try {
    const {
      title, description, sizeStart, sizeEnd, pos, community, floorplan,  date, propertyType, price, country,
      city, exectLocation, approve, lat, log, slug, editor
    } = req.body;

    const { id } = req.params;

    const processImage = async (filePath) => {
      const buffer = await sharp(filePath)
        .webp({ quality: 80 })
        .toBuffer();

      let compressedBuffer = buffer;
      while (compressedBuffer.length > 200 * 1024) { // 200 KB
        compressedBuffer = await sharp(buffer)
          .webp({ quality: 80 })
          .toBuffer();
      }

      const compressedPath = `uploads/${path.basename(filePath, path.extname(filePath))}.webp`;
      fs.writeFileSync(compressedPath, compressedBuffer);
      return compressedPath;
    };

    const images = req.files['images'] ? await Promise.all(req.files['images'].map(async (file) => {
      return await processImage(file.path);
    })) : null;

    const floorPlanimg = req.files['floorPlanimg'] ? await Promise.all(req.files['floorPlanimg'].map(async (file) => {
      return await processImage(file.path);
    })) : null;

    const featureImage = req.files['feature_image'] ? await processImage(req.files['feature_image'][0].path) : null;
    const aboveBg = req.files['aboveBg'] ? await processImage(req.files['aboveBg'][0].path) : null;
    const lowerBg = req.files['lowerBg'] ? await processImage(req.files['lowerBg'][0].path) : null;
    const qrImage = req.files['qr'] ? await processImage(req.files['qr'][0].path) : null;
    const logo = req.files['logo'] ? await processImage(req.files['logo'][0].path) : null;

    // Parse and format the date
    let formattedDate;
    try {
      const parsedDate = parse(date, 'dd-MM-yyyy', new Date());
      formattedDate = format(parsedDate, 'yyyy-MM-dd');
    } catch (dateError) {
      return res.status(400).json({ error: 'Invalid date format. Use dd-MM-yyyy.' });
    }

    const query = `
      UPDATE offplan SET
        title = ?, description = ?, images = ?, floorPlanimg = ?, date = ?, propertyType = ?, price = ?, community = ?, country = ?, aboveBg = ?, logo = ?, lowerBg = ?, 
        city = ?, approve = ?, lat = ?, log = ?, slug = ?, sizeStart = ?, sizeEnd = ?, pos = ?, floorplan = ?,  exectLocation = ?, editor = ?, feature_image = ?, qr = ?
      WHERE id = ?
    `;
    const values = [
      title, description, images ? images.join(',') : null, floorPlanimg ? floorPlanimg.join(',') : null, formattedDate, propertyType, price, community, country, aboveBg, logo, lowerBg,
 city, approve, lat, log, slug, sizeStart, sizeEnd, pos, floorplan,  exectLocation, editor, featureImage, qrImage, id
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database update failed' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'No record found with the given ID' });
      }
      res.status(200).json({ message: 'Data updated successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


//route for get rent property data 
router.get('/uploads-rent', (req, res) => {
  try {
    const query = 'SELECT * FROM rent';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database retrieval failed' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

//route for get offplan property data 
router.get('/show-offplan', (req, res) => {
  try {
    const query = 'SELECT * FROM offplan';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database retrieval failed' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


//route for get rent property data fro specific id
router.get('/uploads-rent/:id', (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM rent WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database retrieval failed' });
      }
      if (!result || result.length === 0) {
        return res.status(404).json({ error: 'Data not found' });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// DELETE route to delete rent data by ID
router.delete('/delete-rent/:id', (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM rent WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database deletion failed' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Data not found' });
      }
      res.status(200).json({ message: 'Data deleted successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// DELETE route to delete data by ID in offplans
router.delete('/delete-offplans/:id', (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM offplan WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database deletion failed' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Data not found' });
      }
      res.status(200).json({ message: 'Data deleted successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


// DELETE route to delete data by ID in events
router.delete('/delete-events/:id', (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM events WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database deletion failed' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Data not found' });
      }
      res.status(200).json({ message: 'Data deleted successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// DELETE route to delete data by ID blogs
router.delete('/delete-blogs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM blogs WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database deletion failed' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Data not found' });
      }
      res.status(200).json({ message: 'Data deleted successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});



// Image upload endpoint for blogs
router.post('/upload_image', upload.single('file'), (req, res) => {
  if (req.file) {
    const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
    res.json({ link: imageUrl });
  } else {
    res.status(400).json({ error: 'Image upload failed' });
  }
});

// Serve uploaded images
router.use('/uploads', express.static('uploads'));
// API endpoint to save blog
router.post('/api/save_blog', (req, res) => {
  const content = req.body.content;
  const sql = 'INSERT INTO blogs (content) VALUES (?)';
  db.query(sql, [content], (err, result) => {
    if (err) {
      console.error('Error saving blog:', err);
      return res.status(500).send(err);
    }
    res.json({ success: true, message: 'Blog saved successfully!', id: result.insertId });
  });
});




// API endpoint to get blog by ID
router.get('/api/blog/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM blogs WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching blog:', err);
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.status(404).send({ message: 'Blog not found' });
    }
    res.json(result[0]);
  });
});



// Define the route to create a new user
router.post('/users', async (req, res) => {
  const { email, password, usertype, status = 1 } = req.body;

  if (!email || !password || !usertype) {
    return res.status(400).send({ error: 'Email, password, and usertype are required' });
  }

  try {
    // Check if the email already exists
    const checkEmailSql = 'SELECT * FROM adminlogin WHERE email = ?';
    db.query(checkEmailSql, [email], async (err, results) => {
      if (err) {
        console.error('Error checking email:', err);
        return res.status(500).send({ error: 'Database error' });
      }

      if (results.length > 0) {
        return res.status(400).send({ error: 'Email already exists' });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // If email does not exist, insert the new user with hashed password
      const insertUserSql = 'INSERT INTO adminlogin (email, password, usertype, status) VALUES (?, ?, ?, ?)';
      db.query(insertUserSql, [email, hashedPassword, usertype, status], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).send({ error: 'Database error' });
        }
        res.status(201).send({ message: 'User created', userId: result.insertId });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// Route to fetch all subadmins data
router.get('/sub-admin', (req, res) => {
  const sql = 'SELECT * FROM adminlogin';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching posts:', err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});


// Define the login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: 'Email and password are required' });
  }

  try {
    // Check if the email exists
    const checkEmailSql = 'SELECT * FROM adminlogin WHERE email = ?';
    db.query(checkEmailSql, [email], async (err, results) => {
      if (err) {
        console.error('Error checking email:', err);
        return res.status(500).send({ error: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(400).send({ error: 'Invalid email or password' });
      }

      const user = results[0];

      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send({ error: 'Invalid email or password' });
      }

      res.status(200).send({ message: 'Login successful', userId: user.id });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// api for contactus form add
router.post('/contactus', async (req, res) => {
  try {
    const { name, msg, email, phone } = req.body;
    console.log("fyf", req.body)
    if (!name || !msg || !email || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO contactus (name, msg, email, phone) VALUES (?, ?, ?, ?)';
    db.query(query, [name, msg, email, phone], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database insertion failed' });
      }
      res.status(201).json({ message: 'Contact added successfully', id: results.insertId });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Get all contacts
router.get('/contactus', async (req, res) => {
  try {
    const query = 'SELECT * FROM contactus';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


// Route to add data in career
router.post('/career', upload.single('image'), (req, res) => {
  try {
    const { name, phone, email } = req.body;

    // Check if all required fields are present
    if (!name || !phone || !req.file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }


    // Handle uploaded image (file)
    const imagePath = req.file.path; // Path to the uploaded image

    // Save the data to the database
    const query = 'INSERT INTO career (name, phone, email, cv) VALUES (?, ?, ?, ?)';
    db.query(query, [name, phone, email, imagePath], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database insertion failed' });
      }
      res.status(201).json({ message: 'Data uploaded successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Get all contacts
router.get('/career', async (req, res) => {
  try {
    const query = 'SELECT * FROM career';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


// api for contactus form add
router.post('/event-form', async (req, res) => {
  try {
    const { name, msg, email, phone,hour,minutes,time} = req.body;
    console.log("fyf", req.body)
    if (!name || !msg || !email || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO eventform (name, msg, email, phone,hour,minutes,time) VALUES (?, ?, ?, ?,?,?,?)';
    db.query(query, [name, msg, email, phone,hour,minutes,time], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database insertion failed' });
      }
      res.status(201).json({ message: 'Contact added successfully', id: results.insertId });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Get all contacts
router.get('/event-form', async (req, res) => {
  try {
    const query = 'SELECT * FROM eventform';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


module.exports = router;
