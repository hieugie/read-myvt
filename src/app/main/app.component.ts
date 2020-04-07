import { Component } from '@angular/core';
import {MyvtService} from './bao-cao.service';
import {Login} from '../model/login';
import {Status} from '../model/status';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  displayedColumns: string[] = ['username', 'password', 'message'];
  dataSource: Login[];
  dataSourceClone: Login[];
  statuss: Status[];
  status: any;
  isCheck: boolean;
  constructor(private myvtService: MyvtService) {
    this.statuss = [];
    this.statuss.push({value: -4, text: 'Lỗi đổi pass'});
    this.statuss.push({value: 1, text: 'Sai TK hoặc MK'});
    this.statuss.push({value: 0, text: 'Đăng nhập thành công'});
    this.status = 0;

    this.readFile();
  }

  readFile() {
    this.myvtService.getAssetFile().subscribe(res => {
      this.dataSource = res;
      // res.forEach(item => {
      //   this.checkLogin(item);
      // })
      this.dataSourceClone = null;
      this.isCheck = false;
    });
  }

  checkLogin(item) {
    this.myvtService.checkLogin(item).subscribe(res => {
      console.log(res);
      if (res.body.errorCode !== '0') {
        if (res.body.errorCode === '2' || res.body.errorCode === 2 || res.body.errorCode === '1' || res.body.errorCode === 1) {
          item.status = 2;
        } else if (res.body.errorCode === '-4') {
          item.status = -4;
        } else if (res.body.errorCode === 5 || res.body.errorCode === '1') {
          item.status = 5;
        }
        item.message = res.body.message;
      } else if (res.body.data.data.user_type.user_type_name === 'D-com/Dbiz/V-tracking') {
        item.status = 0;
        item.message = 'Đăng nhập thành công';
      }
      this.filterResult();
    });
  }

  checkLoginAll() {
    this.dataSourceClone = null;
    this.isCheck = true;

    let i = 0;
    this.loop(i);
  }

  loop(i) {
    setTimeout(() => {
      console.log(i);
      this.checkLogin(this.dataSource[i]);
      i++;
      if (i < this.dataSource.length) {
        this.loop(i);
      }
    }, 15000);
    // this.dataSource.forEach(item => {
    //   this.checkLogin(item);
    // });
  }

  filterResult() {
    if (!this.dataSourceClone) {
      this.dataSourceClone = this.dataSource;
    } else {
      this.dataSource = this.dataSourceClone;
    }
    if (this.status === null) {
      this.dataSource = this.dataSourceClone;
    } else {
      const filter = this.dataSource.filter(item => item.status === this.status);
      this.dataSource = filter;
    }
  }
}
