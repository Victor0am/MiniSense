import {Request, Response} from 'express';
import connection from '../database/connections';
import {UserDevice} from './SensorDevicesController'

export interface User {
    email: string;
    username: string;
}

class UserController {


    async update(req:Request, res:Response){
        const {email, username} = <User>req.body;
        if(!username || !email) return res.status(400).send('Está faltando algum dos dados...');
        const existent = await connection('users').where('email', email).first();
        if(existent.email !== email) return res.status(409).send(`Usuário cadastrado com email ${email} não existe`);
        await connection('users').where('email', email).update('username', username);
        return res.send('Usuário atualizado com sucesso!');
    }

    async index(req:Request, res: Response){
        const email = <string>req.body;
        if(!email) return res.status(400);
        let existent = <User>{};
        existent = await connection('users').where('email', email).first();
        if(existent.email !== email) return res.status(404).send('Email não cadastrado.');
        return res.json({email, username: existent.username})
    }


    async create (req: Request, res: Response){
        const { email, username } = <User> req.body;
        if(!username || !email) return res.status(400).send('Está faltando algum dos dados...');
        const existent = await connection('users').where('email', email).first();
        if(existent) return res.status(409).send(`Usuário cadastrado com email ${email} já existe`);
        await connection('users').insert({email, username});
        return res.send('Usuário criado com sucesso!');
    }

    async remove(req:Request, res:Response){
        const email = <string>req.body;
        if(!email) return res.status(400);
        let existent = <User>{};
        existent = await connection('users').where('email', email).first();
        if(existent.email !== email) return res.status(404).send('Email não cadastrado.');
        await connection('users').where('email', email).delete(); //deleta o usuário mas deixa as coisas relacionadas a ele no banco
        const sensorDevicesList = await connection<UserDevice[]>('sensorDevices').where('user_email', existent.email);
        await connection('sensorDevices').where('user_email', existent.email).delete();//deleta os dispositivos
        
        return res.send('Usuário deletado com sucesso!')
    }
}

export default UserController;