import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/:id")
  async getUser(id: string) {
    return this.usersService.user({ id: id });
  }
}
