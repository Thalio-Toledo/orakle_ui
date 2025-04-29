export class RegisterDTO
{
    name = ''
    email =''
    password ='' 
}

export class LoginRequestDTO
{
    email =''
    password ='' 
}

export class LoginResponseDto
{
    ownerId =''
    email =''
    token =''
}