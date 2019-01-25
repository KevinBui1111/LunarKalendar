"use strict";

var cur_date, today;
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
  show_day_info(+today);
});

function load_curr_month(date) {
  let day = new Date(date);
  day.setHours(0, 0, 0, 0); // remove time
  day.setDate(1); // set first date of month

  let cur_month = day.getMonth();
  day.setDate(day.getDate() -
    (get_day_week_nth(day) == 1 ? 7 : get_day_week_nth(day) - 1)
  );

  $('.kalendar .ka-row').remove();
  for (let i = 0; i < 6; ++i) {
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
  }

  $('.kal-body .kal-week').remove();
  $('#titleCal').html(cur_date.format('MM/yyyy'));
}
function load_next_month(n) {
  cur_date.setMonth(cur_date.getMonth() + n);
  load_curr_month(cur_date);
}
//---------------------
function get_day_week_nth(date) {
  return date.getDay() == 0 ? 7 : date.getDay();

}
function show_day_info(d) {
  let day = new Date(d)
    , [dd, mm, yy] = [day.getDate(), day.getMonth() + 1, day.getFullYear()]
    , lunar = getLunarDate(dd, mm, yy)
    , nhuan = lunar.leap == 1 ? ' (nhuận)' : ''
    , canchi = getCanChi(lunar)
    , giodaungay = getCanHour0(lunar.jd) + " " + CHI[0]
    , tiet = TIETKHI[getSunLongitude(lunar.jd + 1, 7)]
    , giohoangdao = getGioHoangDao(lunar.jd)

    , dom = document.getElementById('day-info-temp').innerHTML.format(
      `${dd} / ${('00' + mm).slice(-2)} / ${yy}`
      , `${lunar.day} / ${('00' + lunar.month).slice(-2)}${nhuan} / ${lunar.year}`
      , canchi[0], canchi[1] + nhuan, canchi[2]
      , giodaungay, tiet, giohoangdao
    );
  document.getElementById('day-info').innerHTML = dom;
}
//---------------------
String.prototype.format = function () {
  let s = this;
  for (let i = 0; i < arguments.length; ++i) {
    let reg = new RegExp("\\(p" + i + "\\)", "g");
    s = s.replace(reg, arguments[i]);
  }

  return s;
}