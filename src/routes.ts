import express from 'express';

import DataStreamsController from './controllers/DataStreamsController';
import MeasurementUnitsController from './controllers/MeasurementUnitsController';
import SensorDataController from './controllers/SensorDataController';
import SensorDevicesController from './controllers/SensorDevicesController';
import UserController from './controllers/UsersController';


const sensorDevicesController = new SensorDevicesController();
const dataStreamsController = new DataStreamsController();
const measurementUnitsController = new MeasurementUnitsController();
const sensorDataController = new SensorDataController();
const usersController = new UserController();


const routes = express.Router();

routes.post("/users", usersController.create);
routes.post('/:userId/devices', sensorDevicesController.create);
routes.post('/munits', measurementUnitsController.create);
routes.post('/:deviceKey/streams', dataStreamsController.create);
routes.post('/:streamKey/data', sensorDataController.create);

routes.get('/munits', measurementUnitsController.showAll);
routes.get('/:userId/devices', sensorDevicesController.showUserDevices);
routes.get('/devices/:key', sensorDevicesController.get);
routes.get('/streams/:key', dataStreamsController.showStream);


export default routes;