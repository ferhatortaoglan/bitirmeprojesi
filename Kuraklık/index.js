$(() => {
    const msInDay = 1000 * 60 * 60 * 24;
    const zoomLevels = ['month', 'year', 'decade', 'century'];
    const weekDays = [
      { id: 0, text: 'Pazar' },
      { id: 1, text: 'Pazartesi' },
      { id: 2, text: 'Salı' },
      { id: 3, text: 'Çarşamba' },
      { id: 4, text: 'Perşembe' },
      { id: 5, text: 'Cuma' },
      { id: 6, text: 'Cumartesi' },
    ];
    const weekNumberRules = ['Otomatik', 'İlk Gün', 'İlk Dört Gün', 'Tüm Hafta'];
    const date = new Date().getTime();
  
    const calendar = $('#calendar').dxCalendar({
      value: new Date(),
      disabled: false,
      firstDayOfWeek: 0,
      showWeekNumbers: false,
      weekNumberRule: 'Otomatik',
      zoomLevel: zoomLevels[0],
      onValueChanged(data) {
        selectedDate.option('value', data.value);
      },
      onOptionChanged(data) {
        if (data.name === 'zoomLevel') {
          zoomLevel.option('value', data.value);
        }
      },
    }).dxCalendar('instance');
  
    $('#min-date').dxCheckBox({
      text: 'Set minimum date',
      onValueChanged(data) {
        const minDate = new Date(date - msInDay * 3);
  
        calendar.option('min', data.value ? minDate : null);
        selectedDate.option('min', data.value ? minDate : null);
      },
    });
  
    $('#max-date').dxCheckBox({
      text: 'Set maximum date',
      onValueChanged(data) {
        const maxDate = new Date(date + msInDay * 3);
  
        calendar.option('max', data.value ? maxDate : null);
        selectedDate.option('max', data.value ? maxDate : null);
      },
    });
  
    $('#disable-dates').dxCheckBox({
      text: 'Disable weekends',
      onValueChanged(data) {
        if (data.value) {
          calendar.option('disabledDates', (d) => d.view === 'month' && isWeekend(d.date));
        } else {
          calendar.option('disabledDates', null);
        }
      },
    });
  
    $('#week-numbers').dxCheckBox({
      text: 'Show week numbers',
      onValueChanged(data) {
        calendar.option('showWeekNumbers', data.value);
      },
    });
  
    $('#disabled').dxCheckBox({
      text: 'Disable the calendar',
      onValueChanged(data) {
        calendar.option('disabled', data.value);
      },
    });
  
    $('#custom-cell').dxCheckBox({
      text: 'Use custom cell template',
      value: false,
      onValueChanged(data) {
        calendar.option('cellTemplate', data.value ? getCellTemplate : 'cell');
      },
    });
  
    const zoomLevel = $('#zoom-level').dxSelectBox({
      dataSource: zoomLevels,
      value: zoomLevels[0],
      onValueChanged(data) {
        calendar.option('zoomLevel', data.value);
      },
    }).dxSelectBox('instance');
  
    const selectedDate = $('#selected-date').dxDateBox({
      value: new Date(),
      onValueChanged(data) {
        calendar.option('value', data.value);
      },
    }).dxDateBox('instance');
  
    $('#first-day-of-week').dxSelectBox({
      dataSource: weekDays,
      value: 0,
      valueExpr: 'id',
      displayExpr: 'text',
      onValueChanged(data) {
        calendar.option('firstDayOfWeek', data.value);
      },
    });
  
    $('#week-number-rule').dxSelectBox({
      dataSource: weekNumberRules,
      value: weekNumberRules[0],
      onValueChanged(data) {
        calendar.option('weekNumberRule', data.value);
      },
    });
  
    const holidays = [[1, 0], [4, 6], [25, 11]];
  
    function isWeekend(d) {
      const day = d.getDay();
  
      return day === 0 || day === 6;
    }
  
    function getCellTemplate(data) {
      let cssClass = '';
  
      if (data.view === 'month') {
        if (!data.date) {
          cssClass = 'week-number';
        } else {
          if (isWeekend(data.date)) { cssClass = 'weekend'; }
  
          $.each(holidays, (_, item) => {
            if (data.date.getDate() === item[0] && data.date.getMonth() === item[1]) {
              cssClass = 'holiday';
              return false;
            }
            return true;
          });
        }
      }
  
      return `<span class='${cssClass}'>${data.text}</span>`;
    }
  });

  $(() => {
    const treeListData = $.map(tasks, (task) => {
      task.Task_Assigned_Employee = null;
      $.each(employees, (_, employee) => {
        if (employee.ID === task.Task_Assigned_Employee_ID) {
          task.Task_Assigned_Employee = employee;
        }
      });
      return task;
    });
  
    $('#tasks').dxTreeList({
      dataSource: treeListData,
      keyExpr: 'Task_ID',
      parentIdExpr: 'Task_Parent_ID',
      columnAutoWidth: true,
      wordWrapEnabled: true,
      showBorders: true,
      expandedRowKeys: [1, 2],
      selectedRowKeys: [1, 29, 42],
      searchPanel: {
        visible: true,
        width: 250,
      },
      headerFilter: {
        visible: true,
      },
      selection: {
        mode: 'multiple',
      },
      columnChooser: {
        enabled: true,
      },
      columns: [{
        dataField: 'Task_Subject',
        width: 300,
      }, {
        dataField: 'Task_Assigned_Employee_ID',
        caption: 'Assigned',
        allowSorting: false,
        minWidth: 200,
        cellTemplate(container, options) {
          const currentEmployee = options.data.Task_Assigned_Employee;
          if (currentEmployee) {
            container
              .append($('<div>', { class: 'img', style: `background-image:url(${currentEmployee.Picture});` }))
              .append('\n')
              .append($('<span>', { class: 'name', text: currentEmployee.Name }));
          }
        },
        lookup: {
          dataSource: employees,
          valueExpr: 'ID',
          displayExpr: 'Name',
        },
      }, {
        dataField: 'Task_Status',
        caption: 'Status',
        minWidth: 100,
        lookup: {
          dataSource: [
            'Not Started',
            'Need Assistance',
            'In Progress',
            'Deferred',
            'Completed',
          ],
        },
      }, {
        dataField: 'Task_Priority',
        caption: 'Priority',
        lookup: {
          dataSource: priorities,
          valueExpr: 'id',
          displayExpr: 'value',
        },
        visible: false,
      }, {
        dataField: 'Task_Completion',
        caption: '% Completed',
        customizeText(cellInfo) {
          return `${cellInfo.valueText}%`;
        },
        visible: false,
      }, {
        dataField: 'Task_Start_Date',
        caption: 'Start Date',
        dataType: 'date',
      }, {
        dataField: 'Task_Due_Date',
        caption: 'Due Date',
        dataType: 'date',
      }],
    });
  });
  