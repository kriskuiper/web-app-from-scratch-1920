export default (tag, attributes) => {
	const element = document.createElement(tag)

	if (typeof element !== HTMLElement) {
		throw new Error(`${tag} is not an existing HTML element`)
	}

	for (let [name, value] of Object.entries(attributes)) {
		if (name === 'class') {
			value.forEach(element.classList.add)
		} else {
			element.setAttribute(name, value)
		}
	}

	return element
}
