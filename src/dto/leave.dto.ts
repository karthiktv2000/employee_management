import { IsDate, IsEmail } from "class-validator"

export class leaveDto {
    email: string;

    // @IsDate({
    //     message: 'Type in the correct date format --> yyyy/mm/dd'
    // })
    leave_date: string;

    status: string;
}