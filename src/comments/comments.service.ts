import { Injectable, ForbiddenException } from '@nestjs/common'
import { CommentDto } from './dto/create-comment.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Comment } from './entities/comment.entity'
import { User } from 'src/users/entities/user.entity'

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentssRepository: Repository<Comment>,
  ) {}

  async create(
    userId: string,
    productId: string,
    commentDto: CommentDto,
  ): Promise<Comment> {
    let newComment = this.commentssRepository.create({
      comment: commentDto.comment,
      userId,
      productId,
    })

    return await this.commentssRepository.save(newComment)
  }

  async findComment(id: string): Promise<Comment> {
    let comment = await this.commentssRepository.findOne(id)
    if (comment) {
      return comment
    }
  }

  async update(
    id: string,
    userId: string,
    commentDto: CommentDto,
  ): Promise<void> {
    let comment = await this.commentssRepository.findOneOrFail(id)
    if (comment && comment.userId === userId) {
      this.commentssRepository.update(comment.id, {
        comment: commentDto.comment,
      })
    } else {
      throw new ForbiddenException()
    }
  }

  async remove(id: string, currentUser: User): Promise<string> {
    let comment = await this.commentssRepository.findOneOrFail(id)
    if (
      comment &&
      (comment.userId === currentUser.id ||
        currentUser.role === 'admin' ||
        currentUser.role === 'editor')
    ) {
      await this.commentssRepository.delete(id)
      return `deleted successfully`
    }
  }
}
