/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';

@Injectable()
export class AppService {
 
  constructor(private readonly producerService :ProducerService){}
  async  getHello() {
  
    // Sending message by creating topic with message 
    await  this.producerService.produce({
      topic:'test',
      messages:[{
        value:'Hello world'
      }]
    })

    return 'Hello World!';
  }
}
 