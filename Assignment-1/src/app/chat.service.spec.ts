import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChatService } from './chat.service';
import { io } from 'socket.io-client';
import { Observable, of } from 'rxjs';

describe('ChatService', () => {
  let chatService: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatService],
    });
    chatService = TestBed.inject(ChatService);
  });

  it('should be created', () => {
    expect(chatService).toBeTruthy();
  });

  it('should send and receive messages', fakeAsync(() => {
    const mockMessage = 'Hello, world!';
    const spy = spyOn(io.prototype, 'emit'); // Spy on the emit method

    chatService.sendMessage(mockMessage);
    tick();

    expect(spy).toHaveBeenCalledWith('newMessage', mockMessage);

    let receivedMessage: any;
    chatService.getMessages().subscribe((message) => {
      receivedMessage = message;
    });

    chatService.sendMessage(mockMessage);
    tick();

    expect(receivedMessage).toEqual(mockMessage);
  }));
});
