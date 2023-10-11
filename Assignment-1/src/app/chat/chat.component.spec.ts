import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { ChatService } from '../chat.service';
import { of } from 'rxjs';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let chatService: ChatService;

  beforeEach(() => {
    const chatServiceSpy = jasmine.createSpyObj('ChatService', ['getMessages', 'sendMessage']);

    TestBed.configureTestingModule({
      declarations: [ChatComponent],
      providers: [{ provide: ChatService, useValue: chatServiceSpy }]
    });

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    chatService = TestBed.inject(ChatService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call sendMessage when sendMessage is called with a non-empty message', () => {
    const messageToSend = 'Test message to send';
    component.message = messageToSend;

    component.sendMessage();

    expect(chatService.sendMessage).toHaveBeenCalledWith(messageToSend);
    expect(component.message).toEqual('');
  });

  it('should not call sendMessage when sendMessage is called with an empty message', () => {
    component.message = '';

    component.sendMessage();

    expect(chatService.sendMessage).not.toHaveBeenCalled();
  });
});
