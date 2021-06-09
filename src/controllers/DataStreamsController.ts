import {Request, Response} from 'express';
import connection from '../database/connections';
import {SensorDevice} from './SensorDevicesController'

export interface DataStream{
    key: string;
    device_key: string;
    label: string;
    enabled?: boolean;
    unit_symbol: string;
}
interface DeviceData{
    key:string;
    label:string;
    enabled:boolean;
    unit_symbol:string;
}

class DataStreamsController {

    async changeEnabled(req:Request, res: Response){
        const key = <string>req.body;
        if(!key) return res.status(400);
        let existent = await connection<DataStream>('dataStreams').where('key', key).first();
        if(existent?.key !== key) return res.status(404).send('Chave não encontrada');
        await connection('dataStreams').where('key', key).update('enabled', !existent.enabled);
        return res.send('Habilitação mudada');
    }

    async showDevices(req:Request, res:Response){
        const device_key = <string>req.body;
        if(!device_key) return res.status(400);
        let existent = await connection<SensorDevice>('sensorDevices').where('key', device_key).first();
        if(existent?.key !== device_key) return res.status(404).send('Chave não encontrada');
        let devicesList = await connection<DeviceData[]>('dataStreams').distinct().where('device_key', device_key);
        return res.json(devicesList);

    }

    async delete(req:Request, res: Response){
        const key = <string>req.body;
        if(!key) return res.status(400);
        let existent = <DataStream>{};
        existent = await connection('dataStreams').where('key', key).first();
        if(existent.key !== key) return res.status(409).send(`O DataStream com a chave ${key} não está registrado`);
        await connection('dataStreams').where('key', key).delete();
        return res.send('DataStrem deletado com sucesso');
    }

    async create(req: Request, res: Response){
        let {key, device_key, label, enabled, unit_symbol} = <DataStream>req.body;
        if(!key || !device_key || !label || unit_symbol) return res.status(400).send('Estão faltando dados');
        if(enabled === undefined) enabled = false;
        let existent = <DataStream>{};
        existent = await connection('dataStreams').where('key', key).first();
        if(existent.key=== key) return res.status(409).send(`O DataStream com a chave ${key} já está registrado`);
        await connection('dataStreams').insert({key, device_key, label, enabled, unit_symbol});
        return res.send('DataStream cadastrado com sucesso');
    }
}

export default DataStreamsController;