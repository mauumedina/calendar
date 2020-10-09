import { Component, OnInit, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { __decorate } from 'tslib';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {
  months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  _dateSelected = new Date();
  title = this.months[this._dateSelected.getMonth()] + ', ' + this._dateSelected.getFullYear();
  numbersInMonth = [];
  _reminders = []
  reminders = [];
  _subtitle = {text:'Todos los campos son obligatorios', type:"info"};
  inputTitle: string;
  inputDate: Date;
  inputPlace: string;
  private urlapi
    = 'https://api.exchangeratesapi.io/latest';
  public currentEuroMXN: number;
  constructor(private httpClient: HttpClient) {
    this._reminders = [{_id: 0, title:"Cita con el dentista", date: new Date(), place: "Tlalnepantla de baz"},
    {_id: 1, title:"Auto; Ir al taller", date: new Date(), place: "Taller de Jaime"}];
    this.setNewDateValue(this._dateSelected);
  }
  
  ngOnInit(): void {
    this.getCurrentEuroRates();
  }

  _handleNextMonth = () =>{
    this.numbersInMonth =  new Array();
    this._dateSelected = new Date(this._dateSelected.getFullYear(), this._dateSelected.getMonth() + 1, this._dateSelected.getDate());
    this.setNewDateValue(this._dateSelected);
    this.title = this.months[this._dateSelected.getMonth()] + ', ' + this._dateSelected.getFullYear();
  }

  _handlePreviousMonth = () =>{
    this.numbersInMonth =  new Array();
    this._dateSelected = new Date(this._dateSelected.getFullYear(), this._dateSelected.getMonth() - 1, this._dateSelected.getDate());
    this.setNewDateValue(this._dateSelected);
    this.title = this.months[this._dateSelected.getMonth()] + ', ' + this._dateSelected.getFullYear();
  }

  _handleOnClick = (_selected) =>{
    if(!_selected.isOther && this.numbersInMonth.findIndex(e => e.type == 3) >= 0){
      this.numbersInMonth[this.numbersInMonth.findIndex(e => e.type == 3)].type = 1;
    }
    if(!_selected.isOther){
      this.numbersInMonth[this.numbersInMonth.findIndex(e => e.day == _selected.day)].type = 3;
      this._dateSelected = new Date(this._dateSelected.getFullYear(), this._dateSelected.getMonth(), _selected.day);
      this._loadDayReminders();
    }
  }

  setNewDateValue = (_dateSelected) => {
    var daysInMonth = this.getDaysInMonth(_dateSelected.getMonth(), _dateSelected.getFullYear());
    var numbersIn = Array(daysInMonth).fill(daysInMonth).map((x,i)=>i+1);
    for (let i = _dateSelected.getDay(); i > 1; i--) {
      this.numbersInMonth.push({type: 0, day: new Date(_dateSelected.getFullYear(), _dateSelected.getMonth(), _dateSelected.getDate() - _dateSelected.getDate() + 1 - i).getDate(), isOther: true, rmnd: []});
    }
    numbersIn.map((x,i) =>{ 
      let rmnd = [];
      this._reminders.map((value,index)=>{
        var dt = new Date(value.date);
        if(x == dt.getDate() && this._dateSelected.getMonth() == dt.getMonth() && this._dateSelected.getFullYear() == dt.getFullYear()){
          rmnd.push(value)
        }
      })

      if(x == this._dateSelected.getDate() && this._dateSelected.getMonth() == new Date().getMonth()){
        this.numbersInMonth.push({type: 3, day: x, isOther: false, rmnd: rmnd})
      }else{
        this.numbersInMonth.push({type: 1, day: x, isOther: false, rmnd: rmnd})
      }});

      const lastDay = new Date(this._dateSelected.getFullYear(), this._dateSelected.getMonth() , this.numbersInMonth[this.numbersInMonth.length - 1].day).getDay();
      if(lastDay < 6){
        let nDay = 1;
        for (let i = lastDay; i < 6 ; i++) {
          this.numbersInMonth.push({type: 0, day: nDay, isOther: true, rmnd: []});
          nDay ++;
        }
      }
      this._loadDayReminders();
  }

  _loadDayReminders = () =>{
    this.reminders = new Array();
    this._reminders.map((value,index)=>{
      var dt = new Date(value.date);
      if(dt.toLocaleDateString() == this._dateSelected.toLocaleDateString()){
        this.reminders.push(value)
        }
    })
  }

  _addReminder = () =>{
    if(this.inputTitle && this.inputDate && this.inputPlace){
      this._reminders.push({_id:  this._reminders.length + 1, title:this.inputTitle, date: this.inputDate, place: this.inputPlace});
      this.numbersInMonth =  new Array();
      this._dateSelected = new Date(this._dateSelected.getFullYear(), this._dateSelected.getMonth(), this._dateSelected.getDate());
      this.setNewDateValue(this._dateSelected);
      this.inputTitle = "";
      this.inputDate = new Date();
      this.inputPlace = "";
    }else{
      this._subtitle = {text:'No se permiten campos vacíos!', type:"error"};
      setTimeout(() =>{
        this._subtitle =  {text:'Todos los campos son obligatorios', type:"info"};
      }, 3000);
    }
  }
  

  onChange(event: any,){
    var dt =  new Date(event.target.value);
    dt =  new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()+1);
    this.inputDate = dt
  }

  onKey(event: any, type: string) {
    if(type == 'title'){
      this.inputTitle = event.target.value;
    }else if(type == 'date'){
      console.log(event.target.value)
      this.inputDate = event.target.value;
    }else if(type == 'place'){
      this.inputPlace = event.target.value;
    }
  }

  getChildObjDelete(elem): void{
    const index = this._reminders.findIndex(e=> e._id == elem._id);
     if (index > -1) {
      this.numbersInMonth =  new Array();
      this._reminders.splice(index, 1);
      this.setNewDateValue(this._dateSelected);
    }
  }

  getChildObjUpdate(elem):void{
  
  }

  getCurrentEuroRates = () => {
    const currencies = 'USD,MXN';
    const url = `${this.urlapi}?symbols=${currencies}`;
    this.httpClient
      .get(url)
      .subscribe(apiData => (this.currentEuroMXN = apiData['rates']['MXN']));
  }

  getDaysInMonth = (month:number,year:number)=> { return new Date(year, month + 1, 0).getDate()}

}

