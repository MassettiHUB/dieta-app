import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('profile')
    async createProfile(@Body() profileData: any) {
        return this.userService.createProfile(profileData);
    }
}
