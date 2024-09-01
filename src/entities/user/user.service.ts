import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm'
import { genSalt, hash, compare } from 'bcrypt'

import { User } from "./user.entity";
import { error } from "console";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    public async createUser (userData: any) {
        const salt = await genSalt(10)

        const hashedPassword = await hash(userData.password, salt)

        const newUser = this.userRepository.create({
            ...userData,
            password: hashedPassword,
        })
        return await this.userRepository.save(newUser)
    }

    public async getUserData (userData: any) {
        const data = await this.userRepository.findOne({ where: {login: userData.login} })

        if (compare(data.password, userData.password)) {
            const user = {
                login: data.login,
                email: data.email,
                password: data.password
            }
            return user
        }else {
            return {error: 'error'}
        }
    }

    public async checkAuthMe (token: string) {
        const userToken = token
        console.log(userToken)
        userToken.slice(0, userToken.lastIndexOf('.'))
        console.log(userToken)
        return token
    }
}