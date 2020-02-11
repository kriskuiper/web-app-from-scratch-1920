export default (parentElement) => {
	while (parentElement.firstChild) {
		parentElement.removeChild(parentElement.firstChild)
	}
}
