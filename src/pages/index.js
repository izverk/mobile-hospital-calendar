import {
	daysListContainerSelector,
	dayTemplateSelector,
	dayElementSelector,
	prevMonthBtnSelector,
	nextMonthBtnSelector,
	currentYearElementSelector,
	currentYearElementSelectorForMobile,
	currentMonthElementSelector,
	monthsArr,
	timePeriodsForDisplay,
	currentPeriodElementSelector,
	changePeriodBtnSelector,
	calendarGridContainerSelector,
	todayBtnSelector,
} from '../utils/constants.js';

// ==================== ВЫБОР ЭЛМЕНТОВ DOM =====================

// Контейнер сетки календаря
const daysListContainer = document.querySelector(daysListContainerSelector);
// Элемент шаблона одной ячейки (дня) календаря из шаблона
const dayTemplateElement = document.querySelector(dayTemplateSelector);
// Элемент кнопки переключения месяца на предыдущий
const prevMonthBtnElement = document.querySelector(prevMonthBtnSelector);
// Элемент кнопки переключения месяца на следующий
const nextMonthBtnElement = document.querySelector(nextMonthBtnSelector);
// Элементы, отображающие текущий год
const currentYearElement = document.querySelector(currentYearElementSelector);
const currentYearElementForMobile = document.querySelector(
	currentYearElementSelectorForMobile
);
//  Элемент, отображающий текущий месяц
const currentMonthElement = document.querySelector(currentMonthElementSelector);
// Элемент, отображающий выбранный пользователем период времени
const currentPeriodElement = document.querySelector(
	currentPeriodElementSelector
);
// Элемент кнопки смены отображаемого периода (месяц/неделя)
const changePeriodBtnElement = document.querySelector(changePeriodBtnSelector);

// Контейнер сетки календаря
const calendarGridContainer = document.querySelector(
	calendarGridContainerSelector
);
// Элемент кнопки "Сегодня"
const todayBtnElement = document.querySelector(todayBtnSelector);

// ==================== ОБЪЯВЛЕНИЯ ФУНКЦИЙ =====================

// Функция получения значений текущего года, месяца, даты и дня недели
const getCurrentDayData = () => {
	const currentDateObj = new Date();
	return {
		currentDateObj: currentDateObj,
		currentYear: currentDateObj.getFullYear(),
		currentMonth: currentDateObj.getMonth(),
		currentDate: currentDateObj.getDate(),
		currentWeekDay: currentDateObj.getDay(),
	};
};

// Функция получения последнего числа в месяце
const getLastDateOfMonth = (year, month) => {
	const date = new Date(year, month + 1, 0);
	return date.getDate();
};

// Функция получения первого и последнего дня недели в месяце
const getFirstAndLastDaysOfMonth = (year, month) => {
	// первый день месяца
	let dateObj = new Date(year, month, 1);
	const firstWeekDayOfMonth = dateObj.getDay();
	// последний день месяца
	const lastDateOfMonth = getLastDateOfMonth(year, month);
	dateObj = new Date(year, month, lastDateOfMonth);
	const lastWeekDayOfMonth = dateObj.getDay();

	return { firstWeekDayOfMonth, lastWeekDayOfMonth };
};

// Функия получения строкового представления текущей даты (например: "11.04")
const getCurrentDateString = () => {
	let dateObj = new Date();
	const currentDateStringISO = dateObj.toISOString();
	const currentDateString = currentDateStringISO[8] + currentDateStringISO[9];
	const currentMonthString = currentDateStringISO[5] + currentDateStringISO[6];
	return currentDateString + '.' + currentMonthString;
};

// Функия получения строкового представления текущей недели (например: "11.04-17.04")
const getCurrentWeekString = () => {
	let dateObj = new Date();
	const currentDate = dateObj.getDate();

	const currentWeekDay = dateObj.getDay();

	const weekStartDate =
		currentDate - (currentWeekDay === 0 ? 6 : currentWeekDay - 1);
	const weekStartDateObj = new Date();
	weekStartDateObj.setDate(weekStartDate);
	const weekStartStringISO = weekStartDateObj.toISOString();
	const weekStartStringDate = weekStartStringISO[8] + weekStartStringISO[9];
	const weekStartStringMonth = weekStartStringISO[5] + weekStartStringISO[6];
	const weekStartString = weekStartStringDate + '.' + weekStartStringMonth;

	const weekEndDate =
		currentDate + (currentWeekDay === 0 ? 0 : 7 - currentWeekDay);
	const weekEndDateObj = new Date();
	weekEndDateObj.setDate(weekEndDate);
	const weekEndStringISO = weekEndDateObj.toISOString();
	const weekEndStringDate = weekEndStringISO[8] + weekEndStringISO[9];
	const weekEndStringMonth = weekEndStringISO[5] + weekEndStringISO[6];
	const weekEndString = weekEndStringDate + '.' + weekEndStringMonth;

	return weekStartString + '\u2013' + weekEndString;
};

// Функция получения массива чисел календаря для текущего месяца с добавками чисел в начале и в конце массива от предыдущего и последующего месяцев
const getDaysArrayData = (
	currentYear,
	currentMonth,
	firstWeekDayOfMonth,
	lastWeekDayOfMonth,
	lastDateOfMonth
) => {
	const daysArray = [];
	for (let i = 0; i < lastDateOfMonth; i++) {
		daysArray[i] = i + 1;
	}
	const addedDaysToStart =
		firstWeekDayOfMonth === 0 ? 6 : firstWeekDayOfMonth - 1;
	if (addedDaysToStart) {
		const dateObj = new Date(currentYear, currentMonth - 1);
		const lastDateOfPrevMonth = getLastDateOfMonth(
			dateObj.getFullYear(),
			dateObj.getMonth()
		);
		for (let i = 0; i < addedDaysToStart; i++) {
			daysArray.unshift(
				dateObj.getDate(dateObj.setDate(lastDateOfPrevMonth - i))
			);
		}
	}
	const addedDaysToEnd = lastWeekDayOfMonth === 0 ? 0 : 7 - lastWeekDayOfMonth;
	if (addedDaysToEnd) {
		const dateObj = new Date(currentYear, currentMonth + 1);
		for (let i = 0; i < addedDaysToEnd; i++) {
			daysArray.push(dateObj.getDate(dateObj.setDate(1 + i)));
		}
	}
	return { daysArray, addedDaysToStart, addedDaysToEnd };
};

// Функция получения массива html-элементов - ячеек сетки календаря из массива дней
const getDaysElementsArr = (daysArray, addedDaysToStart, addedDaysToEnd) => {
	return daysArray.map((item, itemIndex) => {
		const dayElement = dayTemplateElement.content
			.querySelector(dayElementSelector)
			.cloneNode(true);
		dayElement.prepend(String(item));
		// добавляем обводку для текущей даты (при условии, что отображаемые месяц и год являются актуальными)
		if (
			item === new Date().getDate() &&
			currentMonth === new Date().getMonth() &&
			currentYear === new Date().getFullYear()
		) {
			dayElement.classList.add('calendar-day_type_current');
		}
		// добавляем подсветку для кликнутой даты
		dayElement.addEventListener('click', (e) => {
			if (pressedDayElement) {
				// если ранее уже кликали дату, то с неё подсветку убираем
				pressedDayElement.classList.remove('calendar-day_type_pressed');
			}
			// назначаем новую кликнутую дату и добавляем подсветку
			pressedDayElement = e.currentTarget;
			pressedDayElement.classList.add('calendar-day_type_pressed');
		});
		// добавляем тусклый цвет для дат соседних месяцев и убираем для них обводку текущей даты, если вдруг дата совпала с текущей
		if (
			itemIndex < addedDaysToStart ||
			itemIndex > daysArray.length - 1 - addedDaysToEnd
		) {
			dayElement.classList.add('calendar-day_type_dim');
			dayElement.classList.remove('calendar-day_type_current');
		}
		return dayElement;
	});
};

// Функция обновления глобальных переменных, используемых для отрисовки сетки календаря
const updateCalendarVariables = (currentYear, currentMonth) => {
	// обновляем данные о последнем числе текущего месяца
	lastDateOfMonth = getLastDateOfMonth(currentYear, currentMonth);
	// обновляем данные о первом и последнем днях недели в текущем мессяце
	let tempObj = getFirstAndLastDaysOfMonth(currentYear, currentMonth);
	firstWeekDayOfMonth = tempObj.firstWeekDayOfMonth;
	lastWeekDayOfMonth = tempObj.lastWeekDayOfMonth;
	// обновляем массив дней для отрисовки, а также количество добавленных к нему дней от соседних месяцев слева и справа
	tempObj = getDaysArrayData(
		currentYear,
		currentMonth,
		firstWeekDayOfMonth,
		lastWeekDayOfMonth,
		lastDateOfMonth
	);
	daysArray = tempObj.daysArray;
	addedDaysToStart = tempObj.addedDaysToStart;
	addedDaysToEnd = tempObj.addedDaysToEnd;
	// обновляем массив html-элементов для отрисовки
	daysElementsArr = getDaysElementsArr(
		daysArray,
		addedDaysToStart,
		addedDaysToEnd
	);
};

// Функция-отрисовщик сетки календаря
const renderDays = (container, contentArr) => {
	container.append(...contentArr);
	// daysElementsArr.forEach((item) => {
	// 	daysListContainer.append(item);
	// });
};

// Функция-отрисовщик текущего года в шапке календаря
const renderCurrentYear = (currentYear) => {
	currentYearElement.textContent = currentYear;
	currentYearElementForMobile.textContent = currentYear;
};

// Функция-отрисовщик текущуго месяца
const renderCurrentMonth = (currentMonth) => {
	currentMonthElement.textContent = monthsArr[currentMonth];
};

// Функция-отрисовщик выбранного периода
const renderCurrentPeriod = (currentPeriod) => {
	let content;
	switch (currentPeriod) {
		case timePeriodsForDisplay.day:
			content = getCurrentDateString();
			break;
		case timePeriodsForDisplay.week:
			content = getCurrentWeekString();
			break;
		case timePeriodsForDisplay.month:
			content = '';
	}
	currentPeriodElement.textContent = content;
};
// Функция-отрисовщик текста кнопки выбора периода
const renderChangePeriodBtnTextContent = (currentPeriod) => {
	let content;
	switch (currentPeriod) {
		case timePeriodsForDisplay.day:
			content = 'Месяц';
			break;
		case timePeriodsForDisplay.week:
			content = 'Месяц';
			break;
		case timePeriodsForDisplay.month:
			content = 'Неделя';
	}
	changePeriodBtnElement.textContent = content;
};

// ================================ ОСНОВНОЙ АЛГОРИТМ ===============================

// ------------------------ Глобальные переменные ---------------------

// Текущий отображаемый период (сегодняшнее число, текущая неделя, текущий месяц)
let currentPeriod = timePeriodsForDisplay.month;
// Нажатая (кликнутая) пользователем дата (html-элемент)
let pressedDayElement = undefined;
// Текщий год и месяц
let { currentDateObj, currentYear, currentMonth, currentDate } =
	getCurrentDayData();
// Последнее число текущего месяца
let lastDateOfMonth = getLastDateOfMonth(currentYear, currentMonth);
// Первый и последний дни недели текущего мессяца
let { firstWeekDayOfMonth, lastWeekDayOfMonth } = getFirstAndLastDaysOfMonth(
	currentYear,
	currentMonth
);
// Текущий массив дней для отрисовки и добавки дней от соседних месяцев слева и справа
let { daysArray, addedDaysToStart, addedDaysToEnd } = getDaysArrayData(
	currentYear,
	currentMonth,
	firstWeekDayOfMonth,
	lastWeekDayOfMonth,
	lastDateOfMonth
);
// Текущий массив html-элементов для отрисовки
let daysElementsArr = getDaysElementsArr(
	daysArray,
	addedDaysToStart,
	addedDaysToEnd
);

// ---------------------------- Первичная отрисовка элементов ------------------------------

// Отрисовываем сетку дней календаря
renderDays(daysListContainer, daysElementsArr);

// Отрисовываем текущий год
renderCurrentYear(currentYear);

// Отрисовываем текущий месяц
renderCurrentMonth(currentMonth);

// Отрисовываем выбранный период
renderCurrentPeriod(currentPeriod);

// Отрисовываем текст кнопки смены выбранного периода
renderChangePeriodBtnTextContent(currentPeriod);

// ------------------------------ Обработчики событий --------------------------------

// Переключение месяца на предыдущий
prevMonthBtnElement.addEventListener('mouseup', (e) => {
	const date = new Date(currentYear, currentMonth);
	currentMonth = date.getMonth(date.setMonth(currentMonth - 1));
	currentYear = date.getFullYear();
	updateCalendarVariables(currentYear, currentMonth);
	daysListContainer.innerHTML = '';
	renderDays(daysListContainer, daysElementsArr);
	renderCurrentYear(currentYear);
	renderCurrentMonth(currentMonth);
	renderCurrentPeriod(currentPeriod);
});

// Переключение месяца на следующий
nextMonthBtnElement.addEventListener('mouseup', (e) => {
	const date = new Date(currentYear, currentMonth);
	currentMonth = date.getMonth(date.setMonth(currentMonth + 1));
	currentYear = date.getFullYear();
	updateCalendarVariables(currentYear, currentMonth);
	daysListContainer.innerHTML = '';
	renderDays(daysListContainer, daysElementsArr);
	renderCurrentYear(currentYear);
	renderCurrentMonth(currentMonth);
	renderCurrentPeriod(currentPeriod);
});

// Переключение отображаемого периода (месяц/неделя)
changePeriodBtnElement.addEventListener('mouseup', (e) => {
	// меняем значение глобальной переменной отображаемого периода в зависимости от её текущего значения
	// был месяц - станет неделя
	if (currentPeriod === timePeriodsForDisplay.month) {
		currentPeriod = timePeriodsForDisplay.week;
		// убираем сетку календаря
		calendarGridContainer.classList.add('calendar-grid_invisible');
	}
	// был день или неделя - станет месяц
	else if (
		currentPeriod === timePeriodsForDisplay.week ||
		currentPeriod === timePeriodsForDisplay.day
	) {
		currentPeriod = timePeriodsForDisplay.month;
		// показываем сетку календаря
		calendarGridContainer.classList.remove('calendar-grid_invisible');
	}
	// заново рендерим элементы при новом значении отображаемого периода
	renderCurrentPeriod(currentPeriod);
	renderChangePeriodBtnTextContent(currentPeriod);
});

// Переключение отображаемого периода (кнопка "Сегодня")
todayBtnElement.addEventListener('mouseup', (e) => {
	// меняем значение глобальной переменной отображаемого периода в зависимости от её текущего значения
	// был месяц или неделя - станет текущий день
	if (
		currentPeriod === timePeriodsForDisplay.week ||
		currentPeriod === timePeriodsForDisplay.month
	) {
		currentPeriod = timePeriodsForDisplay.day;
		// убираем сетку календаря
		calendarGridContainer.classList.add('calendar-grid_invisible');
	}
	// заново рендерим элементы при новом значении отображаемого периода
	renderCurrentPeriod(currentPeriod);
	renderChangePeriodBtnTextContent(currentPeriod);
});
