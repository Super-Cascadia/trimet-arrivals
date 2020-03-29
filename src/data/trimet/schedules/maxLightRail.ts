import {
  BLUE_LINE_NUMBER,
  GREEN_LINE_NUMBER,
  ORANGE_LINE_NUMBER,
  RED_LINE_NUMBER,
  YELLOW_LINE_NUMBER
} from "../../../api/trimet/constants";

export interface DirectionSchedule {
  id: number;
  serviceRange: string[];
  detailTimeFrames: Array<{
    frequency: number;
    timeFrame: string[];
  }>;
}

export interface DaySchedule {
  directions: DirectionSchedule[];
}

export interface LineSchedule {
  regular?: {
    monFri?: DaySchedule;
    saturday?: DaySchedule;
    sunday?: DaySchedule;
  };
  holidays?: {};
}

export interface LineScheduleInfo {
  frequentService: boolean;
  twentyFourHourService: boolean;
  schedules?: LineSchedule;
}

export interface ScheduleDictionary {
  [lineNumber: number]: LineScheduleInfo;
}

export const maxLightRail: ScheduleDictionary = {
  [BLUE_LINE_NUMBER]: {
    frequentService: true,
    schedules: {
      regular: {
        monFri: {
          directions: [
            {
              detailTimeFrames: [
                {
                  frequency: 20,
                  timeFrame: ["5:30", "10:00"]
                },
                {
                  frequency: 10,
                  timeFrame: ["10:00", "7:00"]
                },
                {
                  frequency: 20,
                  timeFrame: ["7:00", "11:30"]
                }
              ],
              id: 1,
              serviceRange: ["5:30", "11:30"]
            }
          ]
        },
        saturday: {
          directions: [
            {
              detailTimeFrames: [
                {
                  frequency: 20,
                  timeFrame: ["7:30", "10:00"]
                },
                {
                  frequency: 15,
                  timeFrame: ["10:00", "7:00"]
                },
                {
                  frequency: 20,
                  timeFrame: ["7:00", "11:30"]
                }
              ],
              id: 1,
              serviceRange: ["7:30", "11:30"]
            }
          ]
        },
        sunday: {
          directions: [
            {
              detailTimeFrames: [
                {
                  frequency: 20,
                  timeFrame: ["7:30", "10:00"]
                },
                {
                  frequency: 15,
                  timeFrame: ["10:00", "7:00"]
                },
                {
                  frequency: 20,
                  timeFrame: ["7:00", "11:30"]
                }
              ],
              id: 1,
              serviceRange: ["7:30", "11:30"]
            }
          ]
        }
      }
    },
    twentyFourHourService: false
  },
  [RED_LINE_NUMBER]: {
    frequentService: false,
    schedules: {},
    twentyFourHourService: false
  },
  [GREEN_LINE_NUMBER]: {
    frequentService: false,
    schedules: {},
    twentyFourHourService: false
  },
  [YELLOW_LINE_NUMBER]: {
    frequentService: false,
    schedules: {},
    twentyFourHourService: false
  },
  [ORANGE_LINE_NUMBER]: {
    frequentService: false,
    schedules: {},
    twentyFourHourService: false
  }
};
