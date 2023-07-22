// models/plantsModel.js
const knex = require('knex')(require('../knexfile').development);

const PlantsModel = {
  getAllPlants() {
    return knex('plants');
  },

  getPlantById(id) {
    return knex('plants').where('id', id).first();
  },

  createPlant(plant) {
    return knex('plants').insert(plant);
  },

  updatePlant(id, updatedPlant) {
    return knex('plants').where('id', id).update(updatedPlant);
  },

  deletePlant(id) {
    return knex('plants').where('id', id).del();
  },
};

module.exports = PlantsModel;
