import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

const prisma = new PrismaClient();

export class AuthController {
    
    async authenticate(request: Request, response: Response) {
        const { email, password } = request.body;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return response.status(400).json({ error: 'User not found' });
        }

        const isValuePassword = await compare(password, user.password);

        if (!isValuePassword) {
            return response.status(400).json({ error: 'Password invalid' });
        }

        const token = sign({id: user.id}, "secret", {expiresIn: "1d"});

        const { id } = user;

        return response.json({user: {id, email}, token});
    }
}