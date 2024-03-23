import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get("/:id")
  async getUser(id: string) {
    return this.usersService.user({ id: id });
  }
}
