/**
 * @description Removes all childnodes inside of a parent node
 * @param {HTMLElement} $parent Parent node to remove all childs from
 */

export default ($parent) => {
	while ($parent.firstChild) {
		$parent.removeChild($parent.firstChild)
	}
}
