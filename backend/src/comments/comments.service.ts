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

  async create(
    createCommentDto: CreateCommentDto,
    user_id: number
  ): Promise<Comment> {
    const now = Date.now();
    return this.db.insert({
      query: "content, user_id, event_id, created_at, updated_at",
      where: `'${createCommentDto.content}', ${user_id}, ${createCommentDto.event_id}, ${now}, ${now}`,
    });
  }

  async findAll(): Promise<Comment[]> {
    return this.db.queryAll({
      query: "*",
      where: "ORDER BY created_at DESC",
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  async remove(id: number): Promise<Comment> {
    return this.db.delete({
      query: "",
      where: "id = " + id,
    });
  }
}
