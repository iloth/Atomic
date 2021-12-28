export interface ElementHelperOptions {
  id: string;
  classList: string[];
}

export class ElementHelper {
  public static Create(tag: string, options: ElementHelperOptions, ...childElements: HTMLElement[]) {
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