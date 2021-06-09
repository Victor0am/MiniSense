import {Request, Response} from 'express';
import {User} from './UsersController'
import connection from '../database/connections';

export interface SensorDevice{
    key: string;
    user_email: string;
    label: string;
    description: string;
}
export interface UserDevice{
    key: string;
    label: string;
    description: string;
}

class SensorDevicesController {

    async group(req: Request, res: Response){
        const email = <string>req.body;
        if(!email) return res.status(400);
        let existent_user = <User>{};
        existent_user = await connection('users').where('email', email).first();
        if(existent_user.email !== email) return res.status(404).send("Usuário não encontrado.");
        let sensorDevicesList =<UserDevice[]>[];
        sensorDevicesList = await connection<UserDevice>('sensorDevices').distinct().where('user_email', email);
        return res.json(sensorDevicesList);
    }

    async get(req: Request, res: Response){
        const key = <string>req.body;
        if(!key) return res.status(400);
        let existent =  <SensorDevice>{};
        existent = await connection('sensorDevices').where('key', key).first() ;
        if(existent.key !== key) return res.status(404).send('Dispositivo não encontrado');
        return res.json({
            key: key,
            user_email: existent.user_email,
            label: existent.label,
            description: existent.description
        });
    }


    async create(req: Request, res: Response){
        const { key, user_email, label, description } = <SensorDevice>req.body;
        if(!key || !user_email || !label || !description) return res.status(400).send("Dados faltando.");
        const user = await connection('users').where('email', user_email).first();
        if(!user) return res.status(404).send('Email não cadastrado');
        const device = {key, user_email, label, description};
        await connection('sensorDevices').insert(device);
        return res.send('Cadastro de dispositivo bem sucedido');
    }

    async remove (req: Request, res: Response){
        const key = <string>req.body;
        if(!key) return res.status(400);
        let existent =  <SensorDevice>{};
        existent = await connection('sensorDevices').where('key', key).first() ;
        if(existent.key !== key) return res.status(404).send('Dispositivo não encontrado');
        await connection('sensorDevices').where('key', key).delete();
        return res.send('Dispositivo deletado com sucesso');
    }

}

export default SensorDevicesController;