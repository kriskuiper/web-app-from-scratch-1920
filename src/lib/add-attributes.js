/**
 * @description Adds attributes to an HTML element
 * @param {HTMLElement} $element Element to add attributes to
 * @param {Object} attributes Attributes to add to the HTML element
 */

export default ($element, attributes) => {
	for (let [name, value] of Object.entries(attributes)) {
		if (name === 'class') {
			value.forEach($element.classList.add)
		} else {
			$element.setAttribute(name, value)
		}
	}
}
