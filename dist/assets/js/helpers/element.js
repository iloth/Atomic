export class ElementHelper {
    static Create(tag, options, ...childElements) {
        const element = document.createElement(tag);
        if (options) {
            if (options.id) {
                element.id = options.id;
            }
            if (options.classList) {
                element.classList.add(...options.classList);
            }
        }
        if (childElements) {
            childElements.forEach((childElement) => {
                element.appendChild(childElement);
            });
        }
        return element;
    }
}
