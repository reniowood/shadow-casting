import { AppOptions } from "./appOptions";

export class OptionsPanel {
  private options: AppOptions;

  constructor(options: AppOptions) {
    this.options = options;
    this.createOptionsCheckboxElements();
  }

  private createOptionsCheckboxElements() {
    const rootElement = document.createElement('div');

    const showCastingLinesElement = this.createCheckboxElementWithLabelAndOnChange('showCastingLines', 'Show casting lines', (element, event) => {
      this.options.showCastingLines = element.checked;
    }, this.options.showCastingLines);
    rootElement.appendChild(showCastingLinesElement);

    const showEdgesElement = this.createCheckboxElementWithLabelAndOnChange('showEdges', 'Show edges', (element, event) => {
      this.options.showEdges = element.checked;
    }, this.options.showEdges);
    rootElement.appendChild(showEdgesElement);

    const showIntersectionPointsElement = this.createCheckboxElementWithLabelAndOnChange('showIntersectionPoints', 'Show intersection points', (element, event) => {
      this.options.showIntersectionPoints = element.checked;
    }, this.options.showIntersectionPoints);
    rootElement.appendChild(showIntersectionPointsElement);

    document.getElementById('main').appendChild(rootElement);
  }

  private createCheckboxElementWithLabelAndOnChange(name: string, label: string, onChange: (element: HTMLInputElement, event: Event) => void, checked: boolean = false): HTMLDivElement {
    const rootElement = document.createElement('div');
    rootElement.appendChild(this.createCheckboxElementWithOnChange(name, onChange, checked));
    rootElement.appendChild(this.createLabelElementFor(name, label));
    return rootElement;
  }

  private createCheckboxElementWithOnChange(name: string, onChange: (element: HTMLInputElement, event: Event) => void, checked: boolean = false): HTMLInputElement {
    const checkboxElement = document.createElement('input');
    checkboxElement.setAttribute('type', 'checkbox');
    checkboxElement.setAttribute('name', name);
    checkboxElement.onchange = (event) => {
      onChange(checkboxElement, event);
    };
    checkboxElement.checked = checked;
    return checkboxElement;
  }

  private createLabelElementFor(name: string, label: string) {
    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', name);
    labelElement.innerText = label;
    return labelElement;
  }
}