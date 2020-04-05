import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Login} from '../model/login';

@Injectable({providedIn: 'root'})
export class MyvtService {
  constructor(private http: HttpClient) {
  }

  private resourceUrl = '/myviettel.php/loginV2';
  checkLogin(request: Login): Observable<any> {
    let body = new URLSearchParams();
    body.set('username', request.username);
    body.set('password', request.password);
    body.set('actionForm', 'mob');
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      observe: 'response'
    };
    // @ts-ignore
    return this.http.post(this.resourceUrl, body.toString(), options);
  }

  getAssetFile() {
    return this.http.get<any>('assets/myvt.txt',  { responseType: 'text' as 'json'}).pipe(map((res: any) => this.convertDateFromServer(res)));
  }
  private convertDateFromServer(res: any): any {
    let logins = [];
    const lines = res.split('\n');
    for(let line = 0; line < lines.length; line++){
      const data = lines[line].split('|');
      if (!data || !data[0] || !data[1]) {
        continue;
      }
      logins.push({username: data[0], password: data[1]});
    }
    return logins;
  }
}
