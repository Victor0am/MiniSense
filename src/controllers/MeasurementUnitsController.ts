import { Request, Response } from 'express';
import connection from '../database/connections';

interface MeasurementUnit {
    symbol: string;
    description: string;
}
interface BDMeasurementUnit {
    id: number;
    symbol: string;
    description: string;
}

class MeasurementUnitsController {

    async showAll(req: Request, res: Response) {
        const unitsList = await connection<BDMeasurementUnit[]>('measurementUnits').orderBy('id');
        return res.json(unitsList);
    }

    async index(req: Request, res: Response) {
        const symbol = <string>req.body;
        if (!symbol) return res.status(400).send('Faltam informações');
        let existent = <BDMeasurementUnit>{};
        existent = await connection('measurementUnits').where('symbol', symbol).first();
        if (existent.symbol !== symbol) return res.status(404).send('Unidade não encontrada');
        return res.json(existent);
    }

    async updateDescription(req: Request, res: Response) {
        const { symbol, description } = <MeasurementUnit>req.body;
        if (!symbol || !description) return res.status(400).send('Faltam informações');
        let existent = <BDMeasurementUnit>{};
        existent = await connection('measurementUnits').where('symbol', symbol).first();
        if (existent.symbol !== symbol) return res.status(404).send('Unidade não encontrada');
        await connection('measurementUnits').where('symbol', symbol).update('description', description);
        return res.send('Descrição atualizada com sucesso');
    }

    async create(req: Request, res: Response) {
        const { symbol, description } = <MeasurementUnit>req.body;
        if (!symbol || !description) return res.status(400).send('Faltam informações');
        let existent = <MeasurementUnit>{};
        existent = await connection('measurementUnits').where('symbol', symbol).first();
        if (existent?.symbol === symbol) return res.status(409).send('Unidade já cadastrada!');
        const createdUnit = await connection('measurementUnits').insert({ symbol, description });
        return res.json({id: createdUnit[0], symbol, description});
    }

    async remove(req: Request, res: Response) {
        const id = <number>req.body;
        if (!id) return res.status(400);
        let existent = <BDMeasurementUnit>{};
        existent = await connection('measurementUnits').where('id', id).first();
        if (existent.id !== id) return res.status(409).send('Unidade não cadastrada!');
        await connection('measurementUnits').where('symbol').delete();
        return res.send('Unidade removida com sucesso');
    }

}

export default MeasurementUnitsController;