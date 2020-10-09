import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.css']
})
export class RemindersComponent implements OnInit {
  @Input() _dateSelected: Date;
  @Input() reminders = [];
  @Output()
  notifyDelete: EventEmitter<Array<Object>> = new EventEmitter<Array<Object>>();
  notifyUpdate: EventEmitter<Array<Object>> = new EventEmitter<Array<Object>>();
  constructor() { }

  ngOnInit(): void {
  }

  _deleteReminder(e): void {
    this.notifyDelete.emit(e);
  }

  _updateReminder(e): void {
    this.notifyUpdate.emit(e);
  }



}
