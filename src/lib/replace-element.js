/**
 * @description Replaces a child node with a new child node
 * @param {HTMLElement} $parent Parent to replace children in
 * @param {HTMLElement} $newChild New child to add to the DOM
 * @param {HTMLElement} $oldChild Old child to remove from the DOM
 */

export default ($parent, $newChild, $oldChild) => {
	if (typeof $oldChild !== HTMLElement || typeof $newChild !== HTMLElement) {
		throw new Error('Both oldChild and newChild should be of type HTMLElement')
	}

	$parent.replaceChild($newChild, $oldChild)
}
