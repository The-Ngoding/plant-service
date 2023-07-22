// seeds/01_plants_seed.js

const faker = require('faker');
const { v4: uuidv4 } = require('uuid');
const Knex = require('knex');
const knexConfig = require('../knexfile');

const knex = Knex(knexConfig.development);

exports.seed = async function (knex) {
 // Deletes ALL existing entries in the plants table
 return knex('plants')
 .del()
 .then(function () {
   // Inserts 10 sample plants into the plants table
   const plants = [];
   for (let i = 0; i < 10; i++) {
     plants.push({
       uuid: faker.datatype.uuid(),
       name: faker.lorem.words(2),
       description: faker.lorem.sentence(),
       farmer_time: faker.datatype.words,
       images: faker.image.imageUrl(),
       season: faker.random.arrayElement(['dry', 'rainy']),
       created_at: new Date(),
       updated_at: new Date(),
       created_by: null,
       updated_by: null,
     });
   }

   return knex('plants').insert(plants);
 });
};