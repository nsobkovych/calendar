;

let Calendar = (function() {
  'use strict';

  const monthsNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
  
  const shortMonthsNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  let next,
      prev,
      month,
      table;
  
  const calendar = document.querySelector('.calendar');
  
  let currentDate;
   
  /**
   * Initializes the module.
   * @returns void
   */
  let init = function () {
    currentDate = setCurrentDate(new Date());
    
    renderCalendarTitle();
    
    next = document.querySelector('.next');
    prev = document.querySelector('.prev');
    month = document.querySelector('.month');
    
    renderCalendarHeadings();
    
    table = document.querySelector('.calendar-inner');
    
    renderCalendar(currentDate);
  };
  
  //--------------------------------------------------------------
  // Helpers
  //--------------------------------------------------------------
  
  /**
   * Returns the next month and year.
   * @returns {Object}
   */
  function getNextMonth(currentDate) {
    let month = currentDate.month + 1;
    let year;
    
    if (month === 12) {
      year = currentDate.year + 1;
      month = 0;
    } else {
      year = currentDate.year;
    }
    
    return {
      month,
      year
    }
  }

  /**
   * Returns the previous month and year.
   * @returns {Object}
   */
  function getPrevMonth(currentDate) {
    let month = currentDate.month - 1;
    let year;
    
    if (month < 0) {
      year = currentDate.year - 1;
      month = 11;
    } else {
      year = currentDate.year;
    }

    return {
      month,
      year
    }
  }
     
  //--------------------------------------------------------------
  // Utilities
  //--------------------------------------------------------------

  /**
   * Sets the current date.
   * @returns {Object} date
   */
  function setCurrentDate(dateNow) {
    let date = {};
    
    date.day = dateNow.getDay();
    date.date = dateNow.getDate();
    date.month = dateNow.getMonth();
    date.year = dateNow.getFullYear();
    
    return date;
  }
  
  /**
   * Renders the Calendar.
   * @returns void
   */
  function renderCalendar(currentDate) {
    let currentTbody = document.querySelector('tbody');
    
    if (currentTbody) {
      currentTbody.parentNode.removeChild(currentTbody);
    }

    let {month: nextMonth, year: nextYear} = getNextMonth(currentDate);
    let nextMonthName = document.createTextNode(`${shortMonthsNames[nextMonth]} `);
    next.insertBefore(nextMonthName, next.firstChild);

    let {month: prevMonth, year: prevYear} = getPrevMonth(currentDate);
    let prevMonthName = document.createTextNode(` ${shortMonthsNames[prevMonth]}`);
    prev.appendChild(prevMonthName);

    let monthName = document.createTextNode(`${monthsNames[currentDate.month]} ${currentDate.year}`);
    month.appendChild(monthName);
    
    renderCalendarBody(currentDate, [prevMonth, prevYear, nextMonth, nextYear]);
  }
  
  /**
   * Renders the Calendar title.
   * @returns void
   */
  function renderCalendarTitle() {
    let fragment = document.createDocumentFragment();
    let header = document.createElement('header');
    
    let prevBtn = document.createElement('button');
    prevBtn.classList.add('prev');
    
    let prevIcon = document.createElement('i');
    prevIcon.classList.add('fa');
    prevIcon.classList.add('fa-chevron-left');
    prevIcon.setAttribute('aria-hidden', true);
    prevBtn.appendChild(prevIcon);
    fragment.appendChild(prevBtn);
    
    let span = document.createElement('span');
    span.classList.add('month');
    fragment.appendChild(span);
    
    let nextBtn = document.createElement('button');
    nextBtn.classList.add('next');
    
    let nextIcon = document.createElement('i');
    nextIcon.classList.add('fa');
    nextIcon.classList.add('fa-chevron-right');
    nextIcon.setAttribute('aria-hidden', true);
    nextBtn.appendChild(nextIcon);
    fragment.appendChild(nextBtn);
    
    header.appendChild(fragment);
    header.classList.add('calendar-header');
    
    calendar.appendChild(header);
  }
  
  /**
   * Renders the Calendar headings.
   * @returns void
   */
  function renderCalendarHeadings() {
    let fragment = document.createDocumentFragment();
    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tr = document.createElement('tr');
    
    weekdays.forEach(day => {
      let th = document.createElement('th');
      let thInner = document.createTextNode(day);
      th.appendChild(thInner);
      fragment.appendChild(th);
    });
    
    thead.appendChild(fragment);
    table.appendChild(thead);
    table.classList.add('calendar-inner');
    calendar.appendChild(table);
  }

  /**
   * Renders the Calendar for current month.
   * @returns void
   */
  function renderCalendarBody(currentDate, [prevMonth, prevYear, nextMonth, nextYear]) {
    let daysInCurrentMonth = new Date(currentDate.year, currentDate.month + 1, 0).getDate();
    let daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
    let daysInNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
    
    let fragment = document.createDocumentFragment();
    let table = document.querySelector('.calendar-inner');
    let tbody = document.createElement('tbody');
    let tr = document.createElement('tr');
    let numberTR = 0;
    let maxNumberTR = 6;
    
    let firstDay = new Date(currentDate.year, currentDate.month, 1).getDay();
    let dateNextMonth = new Date(nextYear, nextMonth);
    
    for (let i = firstDay; i > 0; i--) {
      let td = document.createElement('td');
      let tdInner = document.createTextNode(daysInPrevMonth - i + 1);
      td.appendChild(tdInner);
      td.classList.add('non-active-prev');
      tr.appendChild(td);
    }
    
    let date = new Date(currentDate.year, currentDate.month);
    
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      
      let td = document.createElement('td');
      let tdInner = document.createTextNode(i);
      td.appendChild(tdInner);
      tr.appendChild(td);
      
      if (i === currentDate.date && date.getMonth() === new Date().getMonth() 
          && date.getFullYear() === new Date().getFullYear()) {
        td.classList.add('current');
      }
      
      if (date.getDay() % 7 === 6) {
        fragment.appendChild(tr);
        numberTR++;
        tr = document.createElement('tr');
      }
      
      date.setDate(i + 1);
    }
    
    let lastDay = new Date(currentDate.year, currentDate.month, daysInCurrentMonth)
                  .getDay();
    
    if (lastDay < 6) {
      for (let i = lastDay; i < weekdays.length - 1; i++) {
        createNextMonthDate(tr, dateNextMonth);
      }
      numberTR++;
    }
    
    fragment.appendChild(tr);
    
    if (numberTR < maxNumberTR) {
      let tr = document.createElement('tr');
      
      for (let i = 0; i < weekdays.length; i++) {
        createNextMonthDate(tr, dateNextMonth);
      }
      
      fragment.appendChild(tr);
    }
    
    tbody.appendChild(fragment);
    table.appendChild(tbody);
    
    /**
     * Creates the date of next month.
     * @returns void
     */
    function createNextMonthDate(tr, dateNextMonth) {
      let td = document.createElement('td');
      let tdInner = document.createTextNode(dateNextMonth.getDate());
      td.appendChild(tdInner);
      td.classList.add('non-active-next');
      tr.appendChild(td);
      dateNextMonth.setDate(dateNextMonth.getDate() + 1);
    }
    
  }
  
  //--------------------------------------------------------------
  // Event Handlers
  //--------------------------------------------------------------
  
  /**
   * Renders the month data.
   * @returns void
   */
  let showMonthData = function (getMonthData) {
    let data = getMonthData(currentDate);

    ({month: currentDate.month, year: currentDate.year} = data);

    prev.removeChild(prev.lastChild);
    next.removeChild(next.firstChild);
    month.removeChild(month.firstChild);

    renderCalendar(currentDate);
  };
  
  /**
   * Renders the previous month.
   * @returns void
   */
  let showPrevMonth = function () {
    showMonthData(getPrevMonth);
  };

  /**
   * Renders the next month.
   * @returns void
   */
  let showNextMonth = function () {
    showMonthData(getNextMonth);
  };

  /**
   * Handles the click on the date of the month.
   * @returns void
   */
  let onDateClick = function() {
    
    let handle = function (e) {
      
      if (e.which === 1 && e.target.nodeName === 'TD') {
        let tds = document.getElementsByTagName('td');
        
        Array.prototype.forEach.call(tds, td => {
          if (td.classList.contains('highlight')) {
            td.classList.remove('highlight');
          }
        });
        
        e.target.classList.add('highlight');
        
        if (e.target.classList.contains('non-active-prev')) {
          let dateClick = e.target.textContent;
          showPrevMonth();
          highlight(tds, dateClick)
        }

        if (e.target.classList.contains('non-active-next')) {
          let dateClick = e.target.textContent;
          showNextMonth();
          highlight(tds, dateClick)
        }
        
      }

      /**
       * Highlights the date of the month.
       * @returns void
       */
      function highlight(tds, dateClick) {
        Array.prototype.forEach.call(tds, td => {
          if (!td.hasAttribute('class')) {
            if (td.textContent === dateClick) {
              td.classList.add('highlight');
            }
          }
        });
      }
      
    };
    
    table.addEventListener('click', handle);
  };
  
  /**
   * Binds the event handlers.
   * @returns void
   */
  let bindEvents = function () {
    prev.addEventListener('click', showPrevMonth);
    next.addEventListener('click', showNextMonth);
    onDateClick();
  };
  
  return {
    init,
    bindEvents
  }
})();