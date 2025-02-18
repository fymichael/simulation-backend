
import { Module } from '@nestjs/common';
import { UserService } from '../../service/auth/user.service';

@Module({
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
