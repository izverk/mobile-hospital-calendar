// Селектор контейнера, в который динамически вставляется сетка календарных дней (чисел календаря)
const daysListContainerSelector = '.calendar-grid__days-list';
// Селектор элемента шаблона карточки календарного дня
const dayTemplateSelector = '.calendar-day-template';
// Селектор элемента карточки календарного дня
const dayElementSelector = '.calendar-day';
// Селектор кнопки переключения месяца на предыдущий
const prevMonthBtnSelector = '.calendar-header__change-month-btn';
// Селектор кнопки переключения месяца на предыдущий
const nextMonthBtnSelector = '.calendar-header__change-month-btn_type_next';
// Селектор элемента с текущим годом
const currentYearElementSelector = '.calendar-header__year-row';
// Селектор элемента с текущим месяцем
const currentMonthElementSelector = '.calendar-header__month';
// Массив названий месяцев
const monthsArr = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь',
];

export {
	daysListContainerSelector,
	dayTemplateSelector,
	dayElementSelector,
	prevMonthBtnSelector,
	nextMonthBtnSelector,
	currentYearElementSelector,
	currentMonthElementSelector,
	monthsArr,
};
