export default (parent, child) => {
	if (typeof parent !== HTMLElement) {
		throw new Error('Parent should be of type HTMLElement')
	}

	if (typeof child !== HTMLElement) {
		throw new Error('Child should be of type HTMLElement')
	}

	parent.appendChild(child)
}
