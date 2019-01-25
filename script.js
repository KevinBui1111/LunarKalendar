"use strict";

var cur_date, today, first_day;
let task;
const TIME_WEEK = 1000 * 60 * 60 * 24 * 7
  , TIME_DAY = 1000 * 60 * 60 * 24
  , TIME_HOUR = 1000 * 60 * 60
  , FORMAT_DATE = 'dd/MM/yyyy'
  ;
let 
  DAY_OFF = []
  ;

$(document).ready(function () {
  cur_date = new Date;
  cur_date.setHours(0, 0, 0, 0);
  today = new Date(cur_date)
  load_curr_month(cur_date);
});

String.prototype.format = function () {
  let s = this;
  for (let i = 0; i < arguments.length; i++) {
    let reg = new RegExp("\\(p" + i + "\\)", "g");
    s = s.replace(reg, arguments[i]);
  }

  return s;
}

function load_curr_month(date) {
  let day = new Date(date);
  day.setHours(0, 0, 0, 0); // remove time
  day.setDate(1); // set first date of month

  let cur_month = day.getMonth();
  day.setDate(day.getDate() -
    (get_day_week_nth(day) == 1 ? 7 : get_day_week_nth(day) - 1)
  );

  first_day = new Date(day);

  let dom = '';
  $('.kalendar .ka-row').remove();
  for (let i = 0; i < 6; ++i) {
    //dom += '<div class="row kal-week">';
    for (let d = 0; d < 7; ++d) {
      // check the day is weekend
      if (day.getDay() == 6 || day.getDay() == 0) {// sat or sun
        DAY_OFF.push(+day);
      }

      let td = $('#day_temp .ka-week th:eq(' + d + '),#day_temp .ka-back td:eq(' + d + ')');

      if (day.getMonth() == cur_month)
        td.removeClass('otherMonth');
      else
        td.addClass('otherMonth');

      if (+day == +today)
        td.eq(0).addClass('ka-today');
      else
        td.eq(0).removeClass('ka-today');

      td.data('date', +day);
      td.find('.dayNumber').html(day.getDate());

      td = $('#day_temp .ka-week th:eq(' + d + '),#day_temp .ka-back td:eq(' + d + ')');
      let lunarDate = getLunarDate(day.getDate(), day.getMonth() + 1, day.getFullYear());
      let lunar = lunarDate.day
      if (day.getDate() == 1 || lunarDate.day == 1 || i + d == 0)
        lunar = lunarDate.day + "/" + lunarDate.month;
      td.find('.lunardayNumber').html(lunar);

      day.setDate(day.getDate() + 1);
    }
    $('.kalendar').append($('#day_temp').children().clone());
    //dom += '</div>';
  }

  $('.kal-body .kal-week').remove();
  $('.kal-body').append(dom);
  $('#titleCal').html(cur_date.format('MM/yyyy'));
}
function load_prev_month() {
  cur_date.setMonth(cur_date.getMonth() - 1);
  load_curr_month(cur_date);
}
function load_next_month() {
  cur_date.setMonth(cur_date.getMonth() + 1);
  load_curr_month(cur_date);
}
function load_prev_year() {
  cur_date.setMonth(cur_date.getMonth() - 12);
  load_curr_month(cur_date);
}
function load_next_year() {
  cur_date.setMonth(cur_date.getMonth() + 12);
  load_curr_month(cur_date);
}
//---------------------
function get_week_start(date) {
  date = new Date(date);
  return +date -
    (get_day_week_nth(date) - 1) * TIME_DAY;
}

function get_day_week_nth(date) {
  return date.getDay() == 0 ? 7 : date.getDay();

}
function toggle_show_lunar_day(e) {
  if (e.checked)
    [...document.getElementsByClassName('lunardayNumber')].forEach(d => d.classList.remove('hidden'));
  else
    [...document.getElementsByClassName('lunardayNumber')].forEach(d => d.classList.add('hidden'));
}