import { Request, Response } from 'express';
import connection from '../database/connections';
import { DataStream } from './DataStreamsController';

interface Data {
    timestamp: number;
    value: number;
}
interface SensorData {
    streamId: string;
    value: number;
    unitId: number;
}

class SensorDataController {


    async create(req: Request, res: Response) {
        const streamKey = <string>req.params.streamKey;
        const { timestamp, value } = <Data>req.body;
        if (!timestamp || !value) return res.status(400).send('Faltam parametros');
        let existentStream = await connection<DataStream>('dataStreams').where('key', streamKey).first();
        if (existentStream?.key !== streamKey) return res.status(404).send('DataStream não encontrado');
        if (existentStream?.enabled === false) return res.status(412).send('DataStream desabilitado para coleta de dados');
        const streamData = await connection('sensorData').insert({ timestamp, value, unitId: existentStream.unitId, dataId: existentStream.oid });
        await connection('dataStreams').where('key', streamKey).increment('measurementCounts', 1);
        return res.json({id:streamData[0], timestamp, value, unitId: existentStream.unitId})
    }

}

export default SensorDataController;