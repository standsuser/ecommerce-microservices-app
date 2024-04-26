/* eslint-disable prettier/prettier */
// import { Module } from '@nestjs/common';
// import { AccountController } from './account.controller';
// import { AccountService } from './account.service';
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { AuthGuard } from 'src/guards/auth.guard';
// import { RolesGuard } from 'src/guards/roles.guard';
// import { Roles } from 'src/decorators/role.decorator';
// import { User } from 'src/decorators/user.decorator';

// @Module({
//   imports: [
//     ClientsModule.register([
//       {
//         name:'ACC_SERVICE',
//         transport:Transport.KAFKA,
//         options:{
//           client:{
//             clientId:'auth',
//             brokers:['localhost:9092']
//           },
//           consumer:{
//             groupId:'account-consumer',
//           }
//         }
//       }
//     ])
//   ],
//   controllers: [AccountController],
//   providers: [AccountService,AuthGuard,RolesGuard],
//   //exports: [RolesGuard,AccountService, User],
// })
// export class AccountModule {}
import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/role.decorator';
import { User } from 'src/decorators/user.decorator';

@Module({
  imports: [
    ClientsModule.register([
      {
        name:'ACC_SERVICE',
        transport:Transport.KAFKA,
        options:{
          client:{
            clientId:'auth',
            brokers:['localhost:9092']
          },
          consumer:{
            groupId:'account-consumer',
          }
        }
      }
    ])
  ],
  controllers: [AccountController],
  providers: [AccountService, AuthGuard, RolesGuard],
  //exports: [RolesGuard,AccountService, User],
})
export class AccountModule {}
