import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, User, UserDto } from '../interfaces/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => this.excludePassword(user));
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return this.excludePassword(user);
  }

  async findByEmail(email: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    
    return this.excludePassword(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    // Check if email is already taken
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    
    if (existingUser) {
      throw new ConflictException('Email is already taken');
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
    
    return this.excludePassword(newUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // If updating email, check if it's already taken
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      
      if (existingUser) {
        throw new ConflictException('Email is already taken');
      }
    }
    
    // If updating password, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    
    return this.excludePassword(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    await this.prisma.user.delete({
      where: { id },
    });
  }
  
  private excludePassword(user: User): UserDto {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
} 