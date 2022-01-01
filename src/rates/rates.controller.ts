import { Controller, Body, Patch, Post, Param, ParseUUIDPipe } from '@nestjs/common'
import { RatesService } from './rates.service'
import { RateDto } from './dto/rate.dto'
import { Authorize } from 'src/auth/helpers/auth.guard'
import { User } from 'src/users/entities/user.entity'
import { CurrentUser } from 'src/auth/helpers/current-user.decorator'

@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) { }

  @Authorize()
  @Post(':id')
  create(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() rateDto: RateDto,
  ) {
    return this.ratesService.create(id, user, rateDto)
  }

  @Authorize()
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() rateDto: RateDto,
  ) {
    return this.ratesService.update(id, user, rateDto)
  }
}
