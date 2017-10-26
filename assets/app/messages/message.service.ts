import { EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from "./message.model";
import { Observable } from 'rxjs/Observable';

import 'rxjs/Rx';

@Injectable()
export class MessageService {
    private messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    constructor(private http: HttpClient) {}

    addMessage(message: Message) {
        const body = JSON.stringify(message)
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/message',
            body, { headers: headers, responseType: 'json', observe: 'response' })
            .map(
                (response) => {
                    const message = new Message(
                        response.obj.content, 'DAVE', response.obj._id, null
                    );
                    this.messages.push(message);
                    return message;
                }
            )
            .catch((error) => Observable.throw(error.json()));
    }

    getMessages() {
        return this.http.get('http://localhost:3000/message')
            .map((response) => {
                const messages = response.messages;
                let transformedMessages: Message[] = [];
                for (let message of messages) {
                    transformedMessages.push(new Message(message.content, 'Dave', message._id, null))
                }
                this.messages = transformedMessages;
                return transformedMessages;
            })
            .catch((error) => Observable.throw(error.json())
        );
    }

    editMessage(message: Message) {
        this.messageIsEdit.emit(message);
    }

    updateMessage(message: Message) {
        console.log('MESSAGE', message);
        const body = JSON.stringify(message)
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.patch(`http://localhost:3000/message/${message.messageId}`,
            body, { headers: headers, responseType: 'json', observe: 'response' })
            .catch((error) => Observable.throw(error.json()));
    }

    deleteMessage(message: Message) {
        this.messages.splice(this.messages.indexOf(message), 1);
        return this.http.delete(`http://localhost:3000/message/${message.messageId}`,
            { responseType: 'json', observe: 'response' })
            .catch((error) => Observable.throw(error.json()));
    }
}