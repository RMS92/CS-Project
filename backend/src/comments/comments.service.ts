import { Injectable } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { DatabaseTable } from "../database/database.decorator";
import { DatabaseService } from "../database/database.service";
import { Comment } from "./models/comment.model";

@Injectable()
export class CommentsService {
  @DatabaseTable("comment")
  private readonly db: DatabaseService<Comment>;

  securityLevel: number = 3;

  // DONE
  async create(
    createCommentDto: CreateCommentDto,
    user_id: number
  ): Promise<Comment> {
    const now = Date.now();
    if (this.securityLevel === 1) {
      return this.db.insert({
        query: "content, user_id, event_id, created_at, updated_at",
        where: `'${createCommentDto.content}', ${user_id}, ${createCommentDto.event_id}, ${now}, ${now}`,
      });
    } else {
      const where = `$${1}, $${2}, $${3}, $${4}, $${5}`;
      return this.db.preparedInsert({
        query: "content, user_id, event_id, created_at, updated_at",
        where,
        variables: [
          createCommentDto.content,
          user_id,
          createCommentDto.event_id,
          now,
          now,
        ],
      });
    }
  }

  // DONE
  async findAll(): Promise<Comment[]> {
    if (this.securityLevel === 1) {
      return this.db.queryAll({
        query: "*",
        where: "ORDER BY created_at DESC",
      });
    } else {
      return this.db.preparedQueryAll({
        query: "*",
        where: "ORDER BY created_at ASC",
        variables: [],
      });
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  async remove(id: number): Promise<Comment> {
    if (this.securityLevel === 1) {
      return this.db.delete({
        query: "",
        where: "id = " + id,
      });
    } else {
      const where = "id = $1";
      return this.db.preparedDelete({
        query: "",
        where,
        variables: [id],
      });
    }
  }
}
