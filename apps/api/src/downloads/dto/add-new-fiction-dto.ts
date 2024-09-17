import { IsArray, ArrayNotEmpty, IsNumber, ArrayMinSize } from 'class-validator';

export class AddNewFictionDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true }) // Проверка, что каждый элемент массива является числом
    server: number[];
}