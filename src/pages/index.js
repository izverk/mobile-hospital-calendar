import {
	daysListContainerSelector,
	dayTemplateSelector,
	dayElementSelector,
} from '../utils/constants.js';

// ==================== ВЫБОР ЭЛМЕНТОВ DOM =====================

// Контейнер сетки календаря
const daysListContainer = document.querySelector(daysListContainerSelector);

// Элемент шаблона карточки дня
const dayTemplateElement = document.querySelector(dayTemplateSelector);

// ==================== ОСНОВНОЙ АЛГОРИТМ =====================

// Функция получения шаблона разметки для карточки дня
const getDayElement = (dayTemplateElement, dayElementSelector) => {
	const dayElement = dayTemplateElement.content
		.querySelector(dayElementSelector)
		.cloneNode(true);
	console.log(
		'🚀 ~ file: index.js ~ line 25 ~ getDayElement ~ dayElement',
		dayElement
	);

	return dayElement;
};

// Функция рендеринга сетки календарных дней
const daysRender = (container, dayTemplateElement, dayElementSelector) => {
	const elementsArray = [...Array(35)].map((item, index) => {
		const dayElement = getDayElement(dayTemplateElement, dayElementSelector);
		dayElement.key = index;
		return dayElement;
	});

	console.log(
		'🚀 ~ file: index.js ~ line 36 ~ elementsArray ~ elementsArray',
		elementsArray
	);
	elementsArray.forEach((item) => {
		container.append(item);
	});
};

// // Получаем елемент "календарный день"
// const dayElement = getDayElement();

// Рендерим сетку календарных дней
daysRender(daysListContainer, dayTemplateElement, dayElementSelector);
