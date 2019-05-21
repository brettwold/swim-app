import { Injectable }     from '@angular/core';
import { Platform, LoadingController }       from '@ionic/angular';
import { Storage }        from '@ionic/storage';
import { HTTP, HTTPResponse }      from '@ionic-native/http/ngx';
import { Observable, Subject }     from 'rxjs';

import { EnvService }     from './env.service';
import { SwimData }       from './swimdata';

import { Swimmer }        from '../models/swimmer';
import { Record }        from '../models/record';
import { SwimTime }       from '../models/swimtime';
import { from }           from 'rxjs';

import * as moment from 'moment';

import * as jquery from 'jquery';

import * as google from 'googleapis';

import 'rxjs/Rx';

const jQuery: JQueryStatic = jquery;

@Injectable()
export class RecordsService {
  FILTERS_STORE :string = 'record_filters';

  private STORAGE_KEY = "records";
  private API_KEY = "AIzaSyDO_6uE_KmRlocDMkJd9Hy5tIkJDcv1bIE";

  private RECORDS_URL = "https://sheets.googleapis.com/v4/spreadsheets/1Y41OKtQlTSam1Ax_7axgJ-jR0bbTNss8zK-V9dTNWzE/values/'All Results'!A2:H?key=" + this.API_KEY;

  private records: Subject<Array<Record>>;
  private recordsCache: Array<Record>;

  private filters: any = { club: "", gender: "", age_group: "", course_type: "" };

  constructor (private storage: Storage, private platform: Platform, private http: HTTP, private env: EnvService, private swimData: SwimData, private loadingController: LoadingController) {
    this.records = new Subject();

    this.initFilters();
  }

  private initFilters() {
    this.platform.ready().then(() => {
      this.storage.get(this.FILTERS_STORE).then((val) => {
        if (val) {
          this.filters = JSON.parse(val);
        }
      });
    });
  }

  public initDbFromOnline(): Observable<Array<Record>> {
    return from(this.http.get(this.RECORDS_URL, {}, {}))
              .map(res => {
                if(res.data) {
                  var json = JSON.parse(res.data);
                  this.storage.set(this.STORAGE_KEY, json).then(data => {
                    this.recordsCache = data;
                  });
                  return this.extractRecords(json);
                } else {
                  return new Array();
                }
              });
  }

  public getRecords(): Observable<Array<Record>> {
    if (this.filters.club) {
      console.log("Getting records for selected club: " + this.filters.club)
      // TODO check for records in DB
      // if not in DB attempt to get from online
      this.refreshData();
    }
    return this.records;
  }

  public clearCacheAndRefresh() {
    this.recordsCache = null;
    this.refreshData();
  }

  public refreshData() {
    if(this.recordsCache) {
      console.log("Using cached records");
      this.records.next(this.extractRecords(this.recordsCache));
    } else {
      console.log("Getting records from online");
      this.showLoading();
      this.initDbFromOnline().subscribe((results) => {
        this.records.next(results);
        this.hideLoading();
      }, (error) => {
        this.hideLoading();
        console.log(error);
        console.log("Failed to lookup records data online");
      });
    }
  }

  private extractRecords(json: any): Array<Record> {
    var records = new Array();
    for(var idx in json.values) {
      var row = json.values[idx];
      if(row.length == 8) {
        var race_type = this.swimData.getRaceType(row[2], row[3], row[4]);
        if(race_type) {
          // club, race_type, gender, age, name, date_set, time_orig
          var record = new Record("SBOW", race_type.id, row[0], row[1], row[5], row[6], row[7]);
          if((this.filters.gender == "" || row[0] == this.filters.gender) &&
            (this.filters.age_group == "" || row[1] == this.filters.age_group) &&
            (this.filters.course_type == "" || row[2] == this.filters.course_type)) {
            records.push(record);
          }
        } else {
          console.log(`Failed to find race type for ${row[2]}, ${row[3]}, ${row[4]}`);
        }
      }
    }
    return records;
  }


  protected handleError (error: HTTPResponse) {
    let errMsg: string;
    const body = error.data || '';
    const err = body.error || JSON.stringify(body);
    errMsg = error.error;
    return Observable.throw(errMsg);
  }

  public setFilters(filters: any) {
    this.filters = filters;
    this.storage.set(this.FILTERS_STORE, JSON.stringify(this.filters)).then((val) => {
      console.log("Stored filters");
      this.refreshData();
    });
  }

  public getFilters(): any {
    return this.filters;
  }

  private hideLoading() {
    this.loadingController.dismiss();
  }

  private showLoading() {
    this.loadingController.create({
      message: 'Downloading record data...'
    }).then((res) => {
      res.present();
    });
  }
}
