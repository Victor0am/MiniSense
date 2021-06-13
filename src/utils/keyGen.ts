import {createHmac, randomBytes} from 'crypto';

const secret = 'MiniSense';


export default function keyGen(){
    const key = randomBytes(16).toString('hex');
    return key;
}