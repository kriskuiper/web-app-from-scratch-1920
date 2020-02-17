import addAttributes from './add-attributes'

/**
 * @description Creates an HTML element from a given tag
 * @param {string} tag Type of HTML element to create
 * @param {Object} attributes Key-value pairs of attributes to add
 */

export default (tag, attributes) => {
	const $element = document.createElement(tag)

	if (typeof $element !== HTMLElement) {
		throw new Error(`${tag} is not an existing HTML element`)
	}

	addAttributes($element, attributes)

	return $element
}
