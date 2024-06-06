import { Module } from "@nestjs/common";
import { DvdController } from "./dvd.controller";
import { DvdService } from "./dvd.service";
import { PrismaService } from "src/prisma.service";


@Module({
    controllers: [DvdController],
    providers:[DvdService, PrismaService]
})

export class DvdModule{}