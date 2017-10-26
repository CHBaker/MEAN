import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.model';
import 'rxjs/Rx';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient) {}

    signup(user: User) {
        const body = JSON.stringify(user);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/user',
            body, { responseType: 'json', observe: 'response', headers: headers })
            .catch((error) => Observable.throw(error.json()));
    }

    signin(user: User) {
        const body = JSON.stringify(user);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/user/signin',
            body, { responseType: 'json', headers: headers })
            .catch((error) => Observable.throw(error.json()));
    }

    logout() {
        localStorage.clear();
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }
}