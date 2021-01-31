import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import * as jsonata from 'jsonata';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'sm-report-a';

  _jsonData = {
    example: [{ value: 10 }, { value: 5 }, { value: 15 }],
  };

  _expression = jsonata('example.value');

  name = 'This is XLSX TO JSON CONVERTER';
  willDownload = false;

  constructor() {
    console.log(this._expression.evaluate(this._jsonData));
  }

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString = JSON.stringify(jsonData);
      document.getElementById('output').innerHTML = dataString
        .slice(0, 300000)
        .concat('...');
      this.setDownload(dataString);

      // check data
      // console.log(dataString);

      // try jsonata
      console.log(jsonata('india.State').evaluate(dataString));
    };
    reader.readAsBinaryString(file);
  }

  setDownload(data) {
    this.willDownload = true;
    setTimeout(() => {
      const el = document.querySelector('#download');
      el.setAttribute(
        'href',
        `data:text/json;charset=utf-8,${encodeURIComponent(data)}`
      );
      el.setAttribute('download', 'xlsxtojson.json');
    }, 1000);
  }

  ngOnInit() {}
}
