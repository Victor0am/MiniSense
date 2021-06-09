import express from 'express';

import DataStreamsController from './controllers/DataStreamsController';
import MeasurementUnitsController from './controllers/MeasurementUnitsController';
import SensorDataController from './controllers/SensorDataController';
import SensorDevicesController from './controllers/SensorDevicesController';
import UsersController from './controllers/UsersController';



const routes = express.Router();


export default routes;