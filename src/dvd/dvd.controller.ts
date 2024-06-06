import { DvdService } from "./dvd.service";
import { Response } from 'express';
import { Dvd } from "./dvd.model";
import { Get, Body, Post, Param, Delete, Put, Controller, Res } from "@nestjs/common";

@Controller('api/dvd')
export class DvdController{

    constructor(private readonly dvdService: DvdService){}

    @Get()
    async getAllDvds(@Res() res: Response): Promise<any> {
        try {
            const Dvd = await this.dvdService.getAllDvD();
            return res.status(201).json(Dvd);
        } catch (error) {
            return res.status(500).json({ error: 'Error message' });
        }
    }

    @Post('/createNewDvd')
    async postDvd(@Body() postData: Dvd, @Res() res: Response): Promise<any> {
      
        if (!postData.title || !postData.img_url || !postData.description || !postData.status_id) {
            return res.status(400).json({ error: 'Content is not empty' });
        }

        try {
            const data = await this.dvdService.createDvD(postData);
            res.status(201).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Error message' });
        }
    }

    @Get(':id')
    async getDvd(@Param('id') id:number, @Res() res: Response):Promise<any>{
        try {
            const dvd = await this.dvdService.getDvD(id);
            if (dvd) {
                res.status(201).json(dvd); 
            } else {
                res.status(400).json({ error: 'DvD Id is not found' }); 
            }
        } catch (error) {
            res.status(500).json({ error: 'Error message' });
        }
    }

   @Delete(':id')
   async deleteDvd(@Param('id') id:number, @Res() res:Response): Promise<any>{
        try{
            const dvd = await this.dvdService.deleteDvD(id);
            if(dvd){
                res.status(201).json({message:'Delete Successfully'})
            }else{
                res.status(400).json({error:'DvD ID not found'});
            }
        }catch(error){
            res.status(500).json({error:'Error message'});
        }
   }

    @Put(':id')
    async updateDvd(@Param('id') id:number, @Body() postData:Dvd, @Res() res:Response):Promise<any>{
        if (!postData.title && !postData.description && !postData.img_url) {
            return res.status(400).json({ error: 'Content is not empty' });
        } 
        try{
            const updatedDvd = await this.dvdService.updateDvD(id, postData);
            if (updatedDvd) {
                res.status(201).json(updatedDvd); // 201 status if update is successful
            } else {
                res.status(400).json({ error: 'DvD Id is not found' }); // 400 status if book is not found
            }
        }catch(error){
            res.status(500).json({ error: 'Error message' });
        }
    }

    @Put('status/:id')
    async updateStatusDvd(@Param('id') id: number, @Body() postStatus: { status_id: number }, @Res() res: Response): Promise<any> {
        if (!postStatus.status_id) {
            return res.status(400).json({ error: 'Content is not empty' });
        }
        try {
            const updatedDvd = await this.dvdService.updateDvDStatus(id, postStatus);
            if (updatedDvd) {
                res.status(201).json(updatedDvd); // 201 status if update is successful
            } else {
                res.status(400).json({ error: 'DvD Id is not found' }); // 400 status if book is not found
            }
        } catch (error) {
            console.error("Error in updateStatusDvd controller:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}