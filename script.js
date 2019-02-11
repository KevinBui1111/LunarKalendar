"use strict";

let cur_date
  , DAY_OFF = []
  ;

$(document).ready(function () {
  // add anniversary
  EVENTS.push.apply(EVENTS, [
    { lunar: 1, dd:  7, mm:  1, info: "Giỗ ông nội (1988)" }
  , { lunar: 1, dd: 16, mm:  1, info: "Giỗ bà nội (1992)" }
  , { lunar: 1, dd: 13, mm:  3, info: "Giỗ cậu 2 (bên ngoại)" }
  , { lunar: 1, dd:  6, mm:  4, info: "Giỗ bác Hồng" }
  , { lunar: 1, dd: 23, mm:  5, info: "Giỗ ông ngoại" }
  , { lunar: 1, dd: 27, mm:  9, info: "Giỗ mẹ" }
  , { lunar: 1, dd: 22, mm: 11, info: "Giỗ bác Tô" }
  , { lunar: 1, dd: 26, mm: 11, info: "Giỗ bác Chừng" }
  ]);
  cur_date = new Date;
  cur_date.setHours(0, 0, 0, 0);
  load_curr_month(cur_date);
  show_day_info(cur_date);

  $(".kalendar").on('click', '.ka-day', function () {
    $('.ka-day.selected').removeClass('selected');
    this.classList.add('selected');
    show_day_info(this.date);
  });

  var hammertime = new Hammer(document, { inputClass: Hammer.TouchInput });
  hammertime.on('swipeleft', () => load_next_month(1));
  hammertime.on('swiperight', () => load_next_month(-1));
});

function load_curr_month(date) {
  let day = new Date(date)
    , today = new Date;
  today.setHours(0, 0, 0, 0); // remove time
  day.setHours(0, 0, 0, 0); // remove time
  day.setDate(1); // set first date of month

  let cur_month = day.getMonth();
  day.setDate(day.getDate() -
    (get_day_week_nth(day) == 1 ? 7 : get_day_week_nth(day) - 1)
  );

  $('.kalendar .ka-row').remove();
  for (let i = 0; i < 6; ++i) {
    let row_dom = $('#day_temp').children().clone();
    for (let d = 0; d < 7; ++d) {
      // check the day is weekend
      if (day.getDay() == 6 || day.getDay() == 0) {// sat or sun
        DAY_OFF.push(+day);
      }

      let td = row_dom.find('.ka-week th:eq(' + d + '), .ka-back td:eq(' + d + ')');

      if (day.getMonth() == cur_month)
        td.eq(1).removeClass('otherMonth');
      else
        td.eq(1).addClass('otherMonth');

      if (+day == +today)
        td.eq(0).addClass('ka-today');
      else
        td.eq(0).removeClass('ka-today');

      if (is_holiday(day))
        td.eq(0).addClass('holiday');
      else
        td.eq(0).removeClass('holiday');

      td[0].date = new Date(day);
      td.find('.dayNumber').html(day.getDate());

      let lunarDate = getLunarDate(day.getDate(), day.getMonth() + 1, day.getFullYear());
      let lunar = lunarDate.day
      if (day.getDate() == 1 || lunarDate.day == 1 || i + d == 0)
        lunar = lunarDate.day + "/" + lunarDate.month;
      td.find('.lunardayNumber').html(lunar);

      day.setDate(day.getDate() + 1);
    }
    $('.kalendar').append(row_dom);
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
    , holiday = is_holiday(d)

    , dom = document.getElementById('day-info-temp').innerHTML.format(
      `${day.format('dd / MM / yyyy')}`
      , `${lunar.day.pad(2)} / ${lunar.month.pad(2)}${nhuan} / ${lunar.year}`
      , canchi[0], canchi[1], canchi[2]
      , giodaungay, tiet, giohoangdao
      , holiday ? holiday.info : ''
    );
  document.getElementById('day-info').innerHTML = dom;
}
function is_holiday(d) {
  let [dd, mm, yy] = [d.getDate(), d.getMonth() + 1, d.getFullYear()]
    , lunar = getLunarDate(dd, mm, yy)
    ;
  return EVENTS.find(e =>
    (e.lunar == 1 && e.dd == lunar.day && e.mm == lunar.month) ||
    (e.lunar == 0 && e.dd == dd && e.mm == mm)
  );
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
Number.prototype.pad = function (width, z) {
  z = z || '0';
  let n = this + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}