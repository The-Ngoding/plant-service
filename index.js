const express = require('express');
const PlantsModel = require('./models/plant_model');
const app = express();
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
// Custom logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const logEntry = {
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
    body: req.body,
    headers: req.headers,
  };
  // Logging request information
  console.log('Incoming Request:', logEntry);

  // Store the original res.end() function
  const originalEnd = res.end;

  // Override the res.end() function to log the response
  res.end = function (chunk, encoding) {
    const end = Date.now();
    const responseTime = end - start;
    const logResponse = {
      status: res.statusCode,
      headers: res.getHeaders(),
      responseTime: responseTime + 'ms',
      body: chunk.toString(),
    };

    // Logging response information
    console.log('Outgoing Response:', logResponse);

    // Call the original res.end() function to finish the response
    originalEnd.call(this, chunk, encoding);
  };

  // Continue the request-response cycle
  next();
});


//verify tokenfrom user service
app.get('/verify', async (req, res) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Authentication failed. Token missing.' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Authentication failed. Invalid token.' });
    }
    res.json({ message: 'Token verified' });
  });
});
// Middleware for parsing JSON data
app.use(express.json());
// Middleware for JWT authentication
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed. Token missing.' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Authentication failed. Invalid token.' });
    }
    req.user = user;
    next();
  });
};
// Create a new plant
app.post('/plants',authenticateJWT, async (req, res) => {
  try {
    // Generate uuid first and then pass it to createPlant
    const id = uuid.v4();
    req.body.uuid = id;
    const newPlant = await PlantsModel.createPlant(req.body);
    res.json(newPlant);
  } catch (error) {
    console.error('Error creating plant:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all plants
app.get('/plants', async (req, res) => {
  try {
    const plants = await PlantsModel.getAllPlants();
    const sanitizePlants = plants.map((plant) => {
        const { id, ...rest } = plant;
        return rest;
        });
    res.json(sanitizePlants);
  } catch (error) {
    console.error('Error fetching plants:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get a specific plant by ID
app.get('/plants/:id',authenticateJWT, async (req, res) => {
  const plantId = req.params.id;
  try {
    const plant = await PlantsModel.getPlantById(plantId);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    res.json(plant);
  } catch (error) {
    console.error('Error fetching plant:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update a plant
app.put('/plants/:id',authenticateJWT, async (req, res) => {
  const plantId = req.params.id;
  try {
    const updatedPlant = await PlantsModel.updatePlant(plantId, req.body);
    res.json(updatedPlant);
  } catch (error) {
    console.error('Error updating plant:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a plant
app.delete('/plants/:id',authenticateJWT, async (req, res) => {
  const plantId = req.params.id;
  try {
    const deletedPlant = await PlantsModel.deletePlant(plantId);
    if (deletedPlant === 0) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    res.json({ message: 'Plant deleted successfully' });
  } catch (error) {
    console.error('Error deleting plant:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Plants service listening on port${process.env.PORT}`);
});
