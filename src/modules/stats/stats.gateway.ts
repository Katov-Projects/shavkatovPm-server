import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';
import { StatsService } from "./stats.service";
import { Protected } from "src/decoratores";
import { Socket } from 'socket.io';
import { IBlogStats } from "./interface";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class StatsGataway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly service: StatsService) {}

  async handleDisconnect(client: Socket) {
    await this.service.handleDisconnect(client);
  }

  @SubscribeMessage('homeSection')
  @Protected(false)
  async hearingEvents(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    return await this.service.homeSection(data, this.server, client);
  }

  @SubscribeMessage("blogStats")
  @Protected(false)
  async blogStats(
    @MessageBody() data: IBlogStats,
    @ConnectedSocket() client: Socket,
  ) {
    return await this.service.blogStats(data, client);
  }
}