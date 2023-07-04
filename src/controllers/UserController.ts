import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export class UserController {
    async index(_request: Request, response: Response) {
        const users = await prisma.user.findMany();
        return response.json(users);
    }
    
    async store(request: Request, response: Response) {
        const { name, email, password } = request.body;

        const userExists = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (userExists) {
            return response.status(400).json({ error: 'User exists' });
        }

        const hash_password = await hash(password, 8);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hash_password,
            },
        });

        return response.json({Message: 'User created successfully'});
    }

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const { name, email, password } = request.body;

        const user = await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: {
                name,
                email,
                password,
            },
        });

        return response.json(user);
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;

        await prisma.user.delete({
            where: {
                id: Number(id),
            },
        });

        return response.json({Message: 'User deleted successfully'});
    }
}