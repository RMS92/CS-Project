import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UsersService } from "../../users/users.service";
import { User } from "../../users/models/user.model";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: User, done: Function): any {
    done(null, user.id);
  }

  async deserializeUser(id: number, done: Function): Promise<any> {
    const userToDeserialize = await this.usersService.findOne(id);
    const userInfo = {
      id: userToDeserialize.id,
      pseudo: userToDeserialize.pseudo,
      role: userToDeserialize.role,
      created_at: userToDeserialize.created_at,
      updated_at: userToDeserialize.updated_at,
      avatar_id: userToDeserialize.avatar_id,
    };
    done(null, userInfo);
  }
}
