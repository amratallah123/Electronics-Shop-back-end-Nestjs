import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MaxLength } from 'class-validator'

export class CommentDto {
    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(500)
    comment: string
}
