import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { AuthenticatedGuard } from "../auth/guards/authenticated-auth.guard";
import { Comment } from "./models/comment.model";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req
  ): Promise<Comment> {
    const user_id = req.user.id;
    return this.commentsService.create(createCommentDto, +user_id);
  }

  @Get()
  async findAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(":id")
  @UseGuards(AuthenticatedGuard)
  async remove(@Param("id") id: string, @Req() req) {
    const authId = req.user.id;
    return this.commentsService.remove(+id, authId);
  }
}
