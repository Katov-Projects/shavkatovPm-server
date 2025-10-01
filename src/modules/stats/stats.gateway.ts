import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';
import { StatsService } from "./stats.service";
import { Protected } from "src/decoratores";
import { Socket } from "socket.io-client";


@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class StatsGataway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly service: StatsService) {}

  handleConnection(client: Socket) {
    console.log(`🔌 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('events')
  @Protected(false)
  async hearingEvents(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    return await this.service.statisticEvent(data, this.server, client);
  }
}