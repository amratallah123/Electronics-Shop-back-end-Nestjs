import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common'
import { Authorize } from 'src/auth/helpers/auth.guard'
import { CurrentUser } from 'src/auth/helpers/current-user.decorator'
import { User } from 'src/users/entities/user.entity'
import { CommentsService } from './comments.service'
import { CommentDto } from './dto/create-comment.dto'

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Authorize()
  @Post(':id')
  create(
    @Param('id', ParseUUIDPipe) productId: string,
    @Body() commentDto: CommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.create(user.id, productId, commentDto)
  }

  @Authorize()
  @Get(':id')
  findComment(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.findComment(id)
  }

  @Authorize()
  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() commentDto: CommentDto,
  ) {
    return this.commentsService.update(id, user.id, commentDto)
  }

  @Authorize()
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.commentsService.remove(id, user)
  }
}
