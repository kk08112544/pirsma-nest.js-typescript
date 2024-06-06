import { AuthService } from "./auth.service";
import { Response } from 'express';
import { User } from "./auth.model";
import { Get, Body, Post, Param, Delete, Put, Controller, Res, UseGuards  } from "@nestjs/common";
import { Request } from '@nestjs/common';
import { LocalAuthGuard } from "./local/local-auth.guard";

@Controller('api/auth')
export class AuthController{

    constructor(private readonly authService: AuthService){}

    @Get()
    async getAllUser(@Res() res: Response): Promise<any> {
        try {
            const User = await this.authService.getAllUser();
            return res.status(201).json(User);
        } catch (error) {
            return res.status(500).json({ error: 'Error message' });
        }
    }

    @Get(':username')
    async getUsername(@Param('username') username:string, @Res() res:Response):Promise<any>{
        try{
            const user = await this.authService.getUsername(username);
            res.status(201).json(user); 
        }catch(error){
            res.status(500).json({ error: 'Error message' });
        }
    }

    @Post('/signup')
    async createNewUser(@Body() postData: User, @Res() res: Response): Promise<any> {
      
        if (!postData.fullname || !postData.username || !postData.password) {
            return res.status(400).json({ error: 'Content is not empty' });
        }

        try {
            const data = await this.authService.createUser(postData);
            res.status(201).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Error message' });
        }
    }

    @Post('/login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() req:any) :Promise<any>{
        return this.authService.login(req.user);

    }


    @Get('/profile/:id')
    async getUser(@Param('id') id:number, @Res() res: Response):Promise<any>{
        try {
            const user = await this.authService.getUser(id);
            res.status(201).json(user); 
        } catch (error) {
            res.status(500).json({ error: 'Error message' });
        }
    }

   @Delete('/deletUser/:id')
   async deleteUser(@Param('id') id:number, @Res() res:Response): Promise<any>{
        try{
            const user = await this.authService.deleteUser(id);
            if(user){
                res.status(201).json({message:'Delete Successfully'})
            }else{
                res.status(400).json({error:'User ID not found'});
            }
        }catch(error){
            res.status(500).json({error:'Error message'});
        }
   }

   @Put('/updateProfile/:id')
   async updateUser(@Param('id') id:number, @Body() postData:User, @Res() res:Response):Promise<any>{
       if (!postData.fullname && !postData.username ) {
           return res.status(400).json({ error: 'Content is not empty' });
       } 
       try{
           const updatedUser = await this.authService.updateUser(id, postData);
           if (updatedUser) {
               res.status(201).json(updatedUser); // 201 status if update is successful
           } else {
               res.status(400).json({ error: 'User Id is not found' }); // 400 status if book is not found
           }
       }catch(error){
           res.status(500).json({ error: 'Error message' });
       }
   }

   
}