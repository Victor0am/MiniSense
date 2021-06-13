import { Request, Response } from 'express';
import connection from '../database/connections';
import { SensorDevice } from './SensorDevicesController'
import keyGen from '../utils/keyGen';

export interface DataStream {
    oid:number;
    key: string;
    label: string;
    unitId:number;
    deviceId: number;
    enabled?: boolean;
    measurementCount: number;
    measurements?: Measurement[]; 
}
interface Measurement{
    timestamp: Date;
    value: number;
}
interface DeviceData {
    key: string;
    label: string;
    enabled: boolean;
    unit_symbol: string;
}
interface StreamRequest {
    label: string;
    unitId: number;
}
class DataStreamsController {


    async showStream(req:Request, res: Response){
        const key = <string>req.params.key;
        if (!key) return res.status(400);
        let dataStream = await connection<DataStream>('dataStreams').where('key', key).first();
        console.log(dataStream);
        console.log(key);
        if (dataStream?.key !== key) return res.status(404).send('Chave não encontrada');
        let measurements = await connection<Measurement>('sensorData').where('dataId', dataStream.oid).orderBy('id', "desc");
        dataStream.measurements = measurements;
        return res.json(dataStream);
    }

    async changeEnabled(req: Request, res: Response) {
        const key = <string>req.params.key;
        if (!key) return res.status(400);
        let dataStream = await connection<DataStream>('dataStreams').where('key', key).first();
        if (dataStream?.key !== key) return res.status(404).send('Chave não encontrada');
        await connection('dataStreams').where('key', key).update('enabled', !dataStream.enabled);
        return res.send('Habilitação mudada');
    }

    async showDevices(req: Request, res: Response) {
        const deviceId = <string>req.body;
        if (!deviceId) return res.status(400);
        let existent = await connection<SensorDevice>('sensorDevices').where('key', deviceId).first();
        if (existent?.key !== deviceId) return res.status(404).send('Chave não encontrada');
        let devicesList = await connection<DeviceData[]>('dataStreams').distinct().where('deviceId', deviceId);
        return res.json(devicesList);

    }

    async delete(req: Request, res: Response) {
        const key = <string>req.body;
        if (!key) return res.status(400);
        let existent = <DataStream>{};
        existent = await connection('dataStreams').where('key', key).first();
        if (existent.key !== key) return res.status(409).send(`O DataStream com a chave ${key} não está registrado`);
        await connection('dataStreams').where('key', key).delete();
        return res.send('DataStrem deletado com sucesso');
    }

    async create(req: Request, res: Response) {
        const deviceKey = <string>req.params.deviceKey;
        let { label, unitId } = <DataStream>req.body;
        if (!deviceKey || !label || !unitId) return res.status(400).send('Estão faltando dados');
        const enabled = true;
        const key = keyGen();
        const existingDevice = await connection<SensorDevice>('sensorDevices').where('key', deviceKey).first();
        if(existingDevice?.key !== deviceKey) return res.status(404).send('Dispositivo não encontrado.');
        const createdStream = await connection('dataStreams').insert({ key, deviceId: existingDevice.id, label, enabled, unitId });
        return res.json({ id:createdStream[0], key, label, unitId, deviceId:existingDevice.id, measurementCount:0 });
    }
}

export default DataStreamsController;