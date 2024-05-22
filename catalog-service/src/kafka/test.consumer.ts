/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConsumerService } from "./consumer.service";

@Injectable()
export class TestConsumer implements OnModuleInit {
    constructor(private readonly consumerService: ConsumerService) { }

    async onModuleInit() { 

        // Consume Data with Spcific topic

        await this.consumerService.consume(
            { topics: ['test'] },
            {
                eachMessage: async({ topic, partition, message })=>{
                 console.log({
                    value:message.value.toString(),
                    topic:topic.toString(),
                    partition:partition.toString(),
                 })
                }

            }
        )
    }




}