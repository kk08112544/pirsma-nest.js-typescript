import { Prisma } from "@prisma/client";

export class Dvd implements Prisma.DvdCreateInput {
    id: number
    title: string;
    img_url: string;
    description: string; // Make description required
    status_id: number;
    status: Prisma.StatusCreateNestedOneWithoutDvdInput;
}