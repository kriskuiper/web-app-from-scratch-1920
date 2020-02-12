/**
 * @description Appends a childNode to an HTML element
 * @param {HTMLElement} $parent Parent node to append the child to
 * @param {HTMLElement} $child Child node to append to the parent element
 */

export default ($parent, $child) => {
	if (typeof $parent !== HTMLElement) {
		throw new Error('Parent should be of type HTMLElement')
	}

	if (typeof $child !== HTMLElement) {
		throw new Error('Child should be of type HTMLElement')
	}

	$parent.appendChild($child)
}
