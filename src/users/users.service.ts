import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users = [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
    }
  ]

  create(createUserDto: CreateUserDto) {
    const usersByHighestId = [...this.users].sort((a, b) => b.id - a.id)
    const newUser = {
      id: usersByHighestId[0].id + 1,
      ...createUserDto
    }
    this.users.push(newUser)
    return newUser
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find(user => user.id === id)
    if (!user) throw new UnprocessableEntityException(`User not found with ID: ${id}`)
    return user
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    this.users = this.users.map(user => {
      if (user.id === id) {
        return { ...user, ...updateUserDto }
      }
      return user
    })

    return this.findOne(id)
  }

  remove(id: number) {
    const removeUser = this.findOne(id)
    this.users = this.users.filter(user => user.id !== id)
    return removeUser
  }
}
