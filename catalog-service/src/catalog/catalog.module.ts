import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';


@Module({
    imports: [
    ],
    controllers: [CatalogController],
    providers: [CatalogService],
})
export class CatalogModule {}