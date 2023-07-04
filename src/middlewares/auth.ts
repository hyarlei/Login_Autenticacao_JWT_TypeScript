import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
require('dotenv').config();

type TokenPayload = {
    id: string;
    iat: number;
    exp: number;
}

export function AuthMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
){
    const {authorization} = request.headers;

    if(!authorization){
        return response.status(401).json({error: 'Token not provided'});
    }

    const [, token] = authorization.split(' ');

    try {
        const decoded = verify(token, 'secret');
        const {id} = decoded as TokenPayload;

        request.userId = id;
        next();
    } catch (error) {
        return response.status(401).json({error: 'Token invalid'});
    }
}