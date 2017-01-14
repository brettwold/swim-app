import { MeetService }      from '../providers/meet.service';

import { DefaultSwimData }  from '../models/default.swimdata';

import { TestEnvironment }  from './testenvironment.spec';

export class MeetTestEnvironment {

  constructor(private testEnv :TestEnvironment, private meetService: MeetService) {

  }

  setupMeetAndSwimmerAndAssertAge(meetDate :string, meetType :string, swimmerDob :string, expectedAge :number) {
    this.testEnv.setupMeetAndSwimmer(meetDate, meetType, swimmerDob);

    this.assertAgeAtMeet(expectedAge);
  }

  setupMeetAndSwimmerAndAssertGroup(meetDate :string, meetType :string, swimmerDob :string, groups :Array<number>, groupId :number) {
    this.testEnv.setupMeetAndSwimmer(meetDate, meetType, swimmerDob);
    this.testEnv.setupMeetGroups(groups);
    this.testEnv.setupSwimmerDateOfBirth(swimmerDob);

    let group = this.meetService.getGroupForSwimmer(this.testEnv.getSwimmer(), this.testEnv.getMeet());
    expect(group).toBeDefined();
    expect(group).toEqual(DefaultSwimData.DATA.entry_groups[groupId]);
  }

  setupMeetWithMinimumTimesheet() {

  }

  setupMeetWithMaximumTimesheet() {

  }

  assertAgeAtMeet(expectedAge: number) {
    let age :number = this.meetService.ageAtMeet(this.testEnv.getSwimmer(), this.testEnv.getMeet());
    expect(age).toEqual(expectedAge);
  }
}
