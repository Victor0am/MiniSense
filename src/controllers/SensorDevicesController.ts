import { Request, Response } from 'express';
import { BDUser } from './UsersController'
import connection from '../database/connections';
import keyGen from '../utils/keyGen';

export interface SensorDevice {
    id: number;
    key: string;
    label: string;
    description: string;
}
interface DeviceData{
    label: string;
    description: string;
}
interface Stream{
    id:number;
    key:string;
    label:string;
    unitId:number;
    deviceId:number;
    measurementsCount:number;
}
export interface UserDevice {
    id: number;
    key: string;
    label: string;
    description: string;
    streams?: Stream[]|MeasuredStream[];
}
interface Measurement{
    timestamp: Date;
    value:number;
}

interface MeasuredStream{
    oid:number;
    key:string;
    label:string;
    unitId:number;
    deviceId:number;
    measurementsCount:number;
    measurements?: Measurement[];
}

class SensorDevicesController {



    async showUserDevices(req:Request, res: Response){
        const userId = <string>req.params.userId;
        if (!userId) return res.status(400);
        let existentUser = <BDUser>{};
        existentUser = await connection('users').where('id', userId).first();
        if (existentUser === undefined) return res.status(404).send("Usuário não encontrado.");
        let existentUserDevicesList = <UserDevice[]>[];
        existentUserDevicesList = await connection('sensorDevices').where('userId', userId).orderBy('id');
        for(let i = 0; i < existentUserDevicesList.length; i++ ){
            let deviceStreams = <Stream[]>[];
            deviceStreams = await connection('dataStreams').where('deviceId', existentUserDevicesList[i].id).orderBy('oid');
            existentUserDevicesList[i].streams = deviceStreams;
        }
        return res.json(existentUserDevicesList);
    }

    async group(req: Request, res: Response) {
        const email = <string>req.body;
        if (!email) return res.status(400);
        let existentUser = <BDUser>{};
        existentUser = await connection('users').where('email', email).first();
        if (existentUser.email !== email) return res.status(404).send("Usuário não encontrado.");
        let sensorDevicesList = <UserDevice[]>[];
        sensorDevicesList = await connection<UserDevice>('sensorDevices').distinct().where('userId', existentUser.id);
        return res.json(sensorDevicesList);
    }

    async get(req: Request, res: Response) {
        const key = <string>req.params.key;
        if (!key) return res.status(400);
        const sensorDevice = await connection<UserDevice>('sensorDevices').where('key', key).first();
        if (sensorDevice?.key !== key) return res.status(404).send('Dispositivo não encontrado');
        const deviceStreams = await connection<MeasuredStream>('dataStreams').where('deviceId', sensorDevice.id).orderBy('oid');
        if(deviceStreams !== undefined){
            console.log(deviceStreams.length);
            for(let i = 0; i < deviceStreams.length; i++ ){
                const id = deviceStreams[i].oid;
                console.log('id: '+ id);
                const streamMeasurements = await connection<Measurement>('sensorData').where('dataId', id).orderBy('id', "desc").limit(5);
                deviceStreams[i].measurements = streamMeasurements;
            }
        }
        sensorDevice.streams = deviceStreams;
        res.json(sensorDevice);
    }


    async create(req: Request, res: Response) {
        const userId = <string>req.params.userId;
        const { label, description } = <DeviceData>req.body;
        const key = keyGen();
        if (!userId || !label || !description) return res.status(400).send("Dados faltando.");
        const user = await connection('users').where('id', userId).first();
        if (!user) return res.status(404).send('Usuario não cadastrado');
        const device = { userId, key, label, description };
        const insertedDevice = await connection<SensorDevice>('sensorDevices').insert(device);
        return res.json({id:insertedDevice[0], key, label, description});
    }

    async remove(req: Request, res: Response) {
        const key = <string>req.body;
        if (!key) return res.status(400);
        let existent = <SensorDevice>{};
        existent = await connection('sensorDevices').where('key', key).first();
        if (existent.key !== key) return res.status(404).send('Dispositivo não encontrado');
        await connection('sensorDevices').where('key', key).delete();
        return res.send('Dispositivo deletado com sucesso');
    }

}

export default SensorDevicesController;