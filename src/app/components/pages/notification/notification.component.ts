import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(
    private notificationService: NotificationService,
    private message: ToastService
  ) { }

  ngOnInit(): void {
    // this.notificationService.readNotification().subscribe();
    this.getAllNotification();
  }

  //Get all notificatin list
  notification: any = {
    list: [],
    count: 0,
    page: 1,
    load:true,
    clearLoad:false
  }
  getAllNotification() {
    this.notificationService.allNotification({
      page: this.notification.page,
      limit: 10
    }).subscribe({
      next: (res: any) => {
        this.notification.list = res?.data?.list;
        this.notification.count = res?.data?.count;
        this.notification.load = false
      }
    })
  }

  //Clear all notification
  clearAllNotification() {
    this.notification.clearLoad = true;
    this.notificationService.clearNotification().subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.notification.list = [];
          this.notification.count = 0;
          this.message.success(res['message']);
          this.notification.clearLoad = false;
        } else {
          this.message.error(res['message']);
          this.notification.clearLoad = false;
        }
      },
      error: (err) => {
        this.message.error(err.error.message);
        this.notification.clearLoad = false;
      }
    })
  }
}
