import { PrismaService } from "src/prisma.service";
import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import * as path from 'path';
import { Dvd, Prisma } from "@prisma/client";



@Injectable()
export class DvdService {

    constructor(private prisma: PrismaService) {}

    async getAllDvD(): Promise<any[]> { 
        return this.prisma.dvd.findMany({
            select: {
                id: true,
                title: true,
                img_url: true,
                description: true,
                status: {
                    select: {
                        status_name: true
                    }
                }
            }
        });
    }
    

    async getDvD(id: number): Promise<any> { 
        return this.prisma.dvd.findUnique({
            where: { id: Number(id) },
            select: {
              id: true,
              title: true,
              img_url: true,
              description: true,
              status: {
                select: {
                  status_name: true
                }
              }
            }
          });
    }


    async createDvD(data: Dvd): Promise<Dvd>{
        
        return this.prisma.dvd.create({
            data,
          });
    }

    
    

    async updateDvD(id: number, data: Prisma.DvdUpdateInput): Promise<Dvd> {
        const getDvd = await this.prisma.dvd.findUnique({ where: { id: Number(id) } });
        if (data.img_url && getDvd?.img_url !== data.img_url) {
            const imagePath = path.join(__dirname, "../../assets/", getDvd.img_url);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error(`Failed to delete image at ${imagePath}:`, err);
                } else {
                    console.log(`Successfully deleted image at ${imagePath}`);
                }
            });
        }

        return this.prisma.dvd.update({
            where: { id: Number(id) },
            data: {
                title: data.title,
                img_url: data.img_url,
                description: data.description,
            },
        });
    }
    async updateDvDStatus(id: number, data: { status_id: number }): Promise<Dvd | null> {
        try {
            return await this.prisma.dvd.update({
                where: { id: Number(id) },
                data: {
                    status_id: data.status_id,
                },
            });
        } catch (error) {
            console.error("Error updating DVD status:", error);
            return null; // Handle errors and return null if update fails
        }
    }

    async deleteDvD(id: number): Promise<Dvd> {
        const getDvd = await this.prisma.dvd.findUnique({ where: { id: Number(id) } });
        if (getDvd?.img_url) {
            const imagePath = path.join(__dirname, "../../assets/", getDvd.img_url);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error(`Failed to delete image at ${imagePath}:`, err);
                } else {
                    console.log(`Successfully deleted image at ${imagePath}`);
                }
            });
        }
        return this.prisma.dvd.delete({
            where: { id: Number(id) },
        });
    }
}