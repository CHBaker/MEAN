import { ErrorService } from './../errors/error.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.model';
import 'rxjs/Rx';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient,
                private errorService: ErrorService) {}

    signup(user: User) {
        const body = JSON.stringify(user);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/user',
            body, { responseType: 'json', observe: 'response', headers: headers })
            .catch((error) => {
                this.errorService.errorOccured.emit(error);
                return Observable.throw(error);
            }
        );
    }

    signin(user: User) {
        const body = JSON.stringify(user);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/user/signin',
            body, { responseType: 'json', headers: headers })
            .catch((error) => {
                this.errorService.errorOccured.emit(error);
                return Observable.throw(error);
            }
        );
    }

    logout() {
        localStorage.clear();
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }
}