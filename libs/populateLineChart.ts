import {arrayRotate, extDayjs, getLastFourCalenderWeeks} from './utils';

export default function mapChartData(_savedLessons) {
  const today = extDayjs();
  // data aggregation with correct answers in one week|month| year
  let weekData = {};
  let monthData = {};
  let yearData = {};

  _savedLessons.forEach((lesson) => {
    const lessonDate = extDayjs(lesson.date);
    if (today.diff(lessonDate, 'day') < 7) {
      weekData[lessonDate.day()] =
        lesson.countCorrectAnswers + (weekData[lessonDate.day()] || 0);
    }

    if (today.diff(lessonDate, 'day') < 35) {
      monthData[lessonDate.week()] =
        lesson.countCorrectAnswers + (monthData[lessonDate.week()] || 0);
    }

    if (today.diff(lessonDate, 'day') < 365) {
      yearData[lessonDate.month() + 1] =
        lesson.countCorrectAnswers + (yearData[lessonDate.month() + 1] || 0);
    }
  });
  // processing and preparing data for display in line chart with last 7 days|5weeks|12months
  let _weekData = [];
  let _monthData = [];
  let _yearData = [];

  const weekDays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  weekDays.forEach((day, index) => {
    _weekData.push({x: day, y: weekData[index] ?? 0});
  });
  _weekData = arrayRotate(_weekData, today.day() - 6);

  const lastFourCalWeeks = getLastFourCalenderWeeks();
  lastFourCalWeeks.forEach((calWeek) => {
    _monthData.push({x: 'W' + calWeek, y: monthData[calWeek] ?? 0});
  });

  const months = [
    'Ja',
    'F',
    'M',
    'A',
    'M',
    'Ju',
    'Jul',
    'A',
    'S',
    'O',
    'N',
    'D',
  ];
  months.forEach((month, index) => {
    _yearData.push({x: month, y: yearData[index + 1] ?? 0});
  });
  _yearData = arrayRotate(_yearData, today.month() - 11);

  return {
    _weekData,
    _monthData,
    _yearData,
  };
}
