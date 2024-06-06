import { PrismaService } from "src/prisma.service";
import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import * as path from 'path';
import { User, Prisma } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async getAllUser(): Promise<any[]> { 
        return this.prisma.user.findMany();
    }

   
    async getUsername(username: string): Promise<any> {
        return this.prisma.user.findFirst({
          where: { username: username },
        });
      }
    

    async getUser(id: number): Promise<any> { 
        return this.prisma.user.findUnique({
            where: { id: Number(id) },
          });
    }


    async createUser(data: User): Promise<User>{
        const hashedPassword: string = await bcrypt.hash(data.password, 10); // 10 เป็นค่าความแข็งแรงของการ hash
        return this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword, // ใช้รหัสผ่านที่ถูก hash แทนที่รหัสผ่านเดิม
            },
        });
    }

    
  
    async validateUser(username: string, password:string): Promise<any>{
        const user = await this.prisma.user.findFirst({
            where: { username: username },
        });

        if(user && await bcrypt.compare(password, user.password)){
            const {...result} = user;
            return result;
        }

        return null;
    }
    
    async login(user:any): Promise<any> {
        const payload = {username: user.username, sub: user.id};
        const accesstoken = this.jwtService.sign(payload);
        user.accesstoken = accesstoken;
        return {
            user: user,
        };
    }
    

    async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.update({
            where: { id: Number(id) },
            data: {
                fullname: data.fullname,
                username: data.username,
            },
        });
    }
   
    async deleteUser(id: number): Promise<User> {
       
        return this.prisma.user.delete({
            where: { id: Number(id) },
        });
    }
}
