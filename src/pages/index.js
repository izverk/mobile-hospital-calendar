import {
	daysListContainerSelector,
	dayTemplateSelector,
	dayElementSelector,
	prevMonthBtnSelector,
	nextMonthBtnSelector,
	currentYearElementSelector,
	currentMonthElementSelector,
	monthsArr,
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
// Элемент, отображающий текущий год
const currentYearElement = document.querySelector(currentYearElementSelector);
//  Элемент, отображающий текущий месяц
const currentMonthElement = document.querySelector(currentMonthElementSelector);

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

// Функция определения високосного года
const isLeapYear = (year) => {
	if (
		(!(year % 4) && !(year % 100) && !(year % 400)) ||
		(!(year % 4) && year % 100)
	) {
		return true;
	}
	return false;
};

// Функция получения последнего числа в месяце
const getLastDateOfMonth = (year, month) => {
	month = String(month);
	// количество дней в каждом месяце года (кроме февраля)
	const daysAmount = {
		0: 31,
		2: 31,
		3: 30,
		4: 31,
		5: 30,
		6: 31,
		7: 31,
		8: 30,
		9: 31,
		10: 30,
		11: 31,
	};
	// если месяц - не февраль, возвращаем количество дней из объекта выше
	if (!(month === '1')) {
		return daysAmount[month];
	}
	// если месяц - февраль, возвращаем: для високосного года - 29 дней, для обычного - 28 дней
	if (isLeapYear(year)) {
		return 29;
	}
	return 28;
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
		// добавляем обводку для текущей даты
		if (item === new Date().getDate()) {
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
};

// Функция-отрисовщик текущуго месяца
const renderCurrentMonth = (currentMonth) => {
	currentMonthElement.textContent = monthsArr[currentMonth];
};
// Функция-отрисовщик выбранного периода
// ...

// ================================ ОСНОВНОЙ АЛГОРИТМ ===============================

// ------------------------ Глобальные переменные ---------------------

// Нажатая (кликнутая) пользователем дата (html-элемент)
let pressedDayElement = undefined;
// Текщий год и месяц
let { currentYear, currentMonth } = getCurrentDayData();
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
// ...

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
});
