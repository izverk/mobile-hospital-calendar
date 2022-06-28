import {
	daysListContainerSelector,
	dayTemplateSelector,
	dayElementSelector,
} from '../utils/constants.js';

// ==================== ВЫБОР ЭЛМЕНТОВ DOM =====================

// Контейнер сетки календаря
const daysListContainer = document.querySelector(daysListContainerSelector);

// Элемент шаблона одной ячейки (дня) календаря из шаблона
const dayTemplateElement = document.querySelector(dayTemplateSelector);

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
const getDaysArray = (
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

	console.log('🚀 ~ file: index.js ~ line 93 ~ daysArray', daysArray);

	const addedDaysToStart =
		firstWeekDayOfMonth === 0 ? 6 : firstWeekDayOfMonth - 1;

	console.log(
		'🚀 ~ file: index.js ~ line 97 ~ addedDaysToStart',
		addedDaysToStart
	);

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
			console.log('🚀 ~ file: index.js ~ line 113 ~ daysArray', daysArray);
		}
	}

	const addedDaysToEnd = lastWeekDayOfMonth === 0 ? 0 : 7 - lastWeekDayOfMonth;
	console.log(
		'🚀 ~ file: index.js ~ line 105 ~ addedDaysToEnd',
		addedDaysToEnd
	);

	if (addedDaysToEnd) {
		const dateObj = new Date(currentYear, currentMonth + 1);
		for (let i = 0; i < addedDaysToEnd; i++) {
			daysArray.push(dateObj.getDate(dateObj.setDate(1 + i)));
		}
	}

	return daysArray;
};

// Функция получения массива html-элементов - ячеек сетки календаря из массива дней
const getDaysElementsArr = (daysArray) => {
	return daysArray.map((i) => {
		const dayElement = dayTemplateElement.content
			.querySelector(dayElementSelector)
			.cloneNode(true);
		dayElement.prepend(String(i));
		return dayElement;
	});
};

// Функция-отрисовщик сетки календаря
const renderDates = (container, contentArr) => {
	container.append(...contentArr);
	// daysElementsArr.forEach((item) => {
	// 	daysListContainer.append(item);
	// });
};

// ==================== ОСНОВНОЙ АЛГОРИТМ =====================

// Получаем данные о текущем дне
const {
	currentDateObj,
	currentYear,
	currentMonth,
	currentDate,
	currentWeekDay,
} = getCurrentDayData();

// Получаем данные о последнем числе текущего месяца
const lastDateOfMonth = getLastDateOfMonth(currentYear, currentMonth);

// Получаем данные о первом и последнем днях недели в текущем мессяце
const { firstWeekDayOfMonth, lastWeekDayOfMonth } = getFirstAndLastDaysOfMonth(
	currentYear,
	currentMonth
);

// Получаем массив дней для отрисовки
const daysArray = getDaysArray(
	currentYear,
	currentMonth,
	firstWeekDayOfMonth,
	lastWeekDayOfMonth,
	lastDateOfMonth
);

console.log(daysArray);

//
const daysElementsArr = getDaysElementsArr(daysArray);

console.log(daysElementsArr);

// Отрисовываем сетку дней календаря
renderDates(daysListContainer, daysElementsArr);
