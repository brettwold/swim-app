import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Record }         from '../models/record';
import { SwimData }       from '../providers/swimdata';
import { RecordsService } from '../providers/records.service';

@Component({
  selector: 'app-records',
  templateUrl: 'records.page.html',
  styleUrls: ['records.page.scss']
})
export class RecordsPage {

  records: Array<Record>;
  genders: Map<string, any>;
  course_types: any[];
  record_groups: Map<string, any>;
  clubs: Map<string, any>;

  filters: any;

  constructor(public router: Router, private recordsService: RecordsService, public swimData: SwimData) {
      this.clubs = swimData.clubs;
      this.genders = swimData.genders;
      this.course_types = swimData.course_types;
      this.record_groups = swimData.record_groups;

      this.filters = recordsService.getFilters();

      recordsService.getRecords().subscribe((records) => {
        this.records = records;
      });
  }

  public saveFilters() {
    this.recordsService.setFilters(this.filters);
  }

  refresh() {
    this.recordsService.clearCacheAndRefresh();
  }
}
