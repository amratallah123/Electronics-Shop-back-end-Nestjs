import { Max, IsNotEmpty ,Min} from 'class-validator';

export class RateDto {
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    rate: number
}
