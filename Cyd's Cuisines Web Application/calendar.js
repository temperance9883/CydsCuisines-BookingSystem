document.addEventListener('DOMContentLoaded',function () 
{
    const monthYear = document.getElementById('month-year');
    const daysContainer = document.getElementById('days');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    const months =['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];

    let currentDate = new Date();
    let today = new Date();

    // Load events from localStorage or initialize an empty object
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};

    function renderCalendar(date) 
    {
      const year = date.getFullYear();
      const month =date.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const lastDay = new Date(year, month + 1, 0).getDate();
      
      monthYear.textContent = `${months[month]} ${year}`;
      daysContainer.innerHTML = '';

        //Previous month's dates
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for(let i = firstDay; i > 0; i--)
        {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = prevMonthLastDay - i + 1;
            dayDiv.classList.add('fade');
            daysContainer.appendChild(dayDiv);
        }

      //Current month's dates
      for (let i = 1; i <= lastDay; i++)
      {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = i;
        dayDiv.classList.add('day');
        const eventKey = `${year} - ${month + 1}-${i}`; //Unique key for the event
        if(i === today.getDate() && month === today.getMonth() && year=== today.getFullYear())
        {
            dayDiv.classList.add('today');
        }
        

      // Display event if it exists
      if (events[eventKey]) 
        {
        const eventLabel = document.createElement('span');
        eventLabel.textContent = events[eventKey];
        eventLabel.classList.add('event');
        dayDiv.appendChild(eventLabel);
        }

    // Add click event to add/remove events
    dayDiv.addEventListener('click', function () {
        const eventText = prompt("Enter event for this day (leave blank to remove):");
        if (eventText) {
            events[eventKey] = eventText;  // Add event
        } else {
            delete events[eventKey];  // Remove event
        }
        localStorage.setItem('calendarEvents', JSON.stringify(events)); // Save events
        renderCalendar(currentDate);  // Re-render calendar to reflect the change
    });
    
    daysContainer.appendChild(dayDiv);
      }

    //Next month's dates
    const nextMonthStartDate = 7 - new Date(year,month + 1, 0).getDate() - 1;
    for (let i = 1; i <= nextMonthStartDate; i++)
    {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = i
        dayDiv.classList.add('fade');
        daysContainer.appendChild(dayDiv);
    }

    }

    prevButton.addEventListener('click',function()
    {
        currentDate.setMonth(currentDate.getMonth()-1);
        renderCalendar(currentDate);
    });


    nextButton.addEventListener('click',function()
    {
        currentDate.setMonth(currentDate.getMonth()+1);
        renderCalendar(currentDate);
    });

    renderCalendar(currentDate);
});