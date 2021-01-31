import { Component, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'sm-report-b';

  tasks;
  responsible;

  spinnerEnabled = false;
  keys: string[];
  dataSheet = new BehaviorSubject(null);
  @ViewChild('inputFile') inputFile: ElementRef;
  isExcelFile: boolean;

  showData(value,key) {
    let array = this.dataSheet.getValue();
    let filtered = array.filter(x=>x[key] === value);
    console.log(filtered);
  }

  onTaskClick(value) {
    let array = this.dataSheet.getValue();
    this.responsible = array.filter(x=>x['TASK'] === value);
    console.log(this.responsible);
    
  }

  filterByKey=(array, key)=>{
    return array.map(x => x[key])
  }

  onChange(evt) {
    let data, header;
    const target: DataTransfer = <DataTransfer>evt.target;
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }
    if (this.isExcelFile) {
      this.spinnerEnabled = true;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        data = XLSX.utils.sheet_to_json(ws);
      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.spinnerEnabled = false;
        this.keys = Object.keys(data[0]);
        this.dataSheet.next(data);
        this.tasks =[...new Set( this.filterByKey(data,'TASK'))];
   
   
      };
    } else {
      this.inputFile.nativeElement.value = '';
    }
  }

  removeData() {
    this.inputFile.nativeElement.value = '';
    this.dataSheet.next(null);
    this.keys = null;
  }
}
