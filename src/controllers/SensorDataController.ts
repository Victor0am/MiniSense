import { Request, Response } from 'express';
import connection from '../database/connections';
import { DataStream } from './DataStreamsController';

interface Data {
    data_key: string;
    value: number;
}
interface SensorData {
    data_key: string;
    value: number;
    unit_symbol: number;
}

class SensorDataController {


    async create(req: Request, res: Response) {
        const { data_key, value } = <Data>req.body;
        if (!data_key || !value) return res.status(400).send('Faltam parametros');
        let existentStream = await connection<DataStream>('dataStreams').where('key', data_key).first();
        if (existentStream?.key !== data_key) return res.status(404).send('DataStream não encontrado');
        if (existentStream?.enabled === false) return res.status(412).send('DataStream desabilitado para coleta de dados');
        await connection('sensorData').insert({ data_key, value, unit_symbol: existentStream.unit_symbol });
    }

}

export default SensorDataController;