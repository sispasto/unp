class AcercaDeComponent extends HTMLElement {
  constructor() {
    super();
    // Shadow DOM deshabilitado por compatibilidad con estilos globales
  }

  async connectedCallback() {
    const containerSelector = this.getAttribute('container');
    const container = document.querySelector(containerSelector);

    if (!container) {
      console.error(`Contenedor no encontrado: ${containerSelector}`);
      return;
    }

    try {
      const response = await fetch('view/acercade.html');
      const htmlText = await response.text();

      const template = document.createElement('template');
      template.innerHTML = htmlText;

      // Extraer scripts
      const scripts = template.content.querySelectorAll('script');
      scripts.forEach(script => script.remove());

      // Limpiar contenido actual
      this.innerHTML = '';
      this.appendChild(template.content.cloneNode(true));

      // Insertar versión
      if (this.versionApp) {
        const versionLabel = this.querySelector('#version-label');
        if (versionLabel) {
          versionLabel.textContent = `Asist v${this.versionApp}`;
        }
      }

      // Insertar fechas de licencia
      if (this.fechaInicio) {
        const fi = this.querySelector('#fecha-inicio');
        if (fi) fi.textContent = this.fechaInicio;
      }

      if (this.fechaFin) {
        const ff = this.querySelector('#fecha-fin');
        if (ff) ff.textContent = this.fechaFin;
      }

      // Limpiar scripts previos
      container.querySelectorAll('script[data-dynamic="true"]').forEach(s => s.remove());

      // Reinsertar scripts
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        newScript.setAttribute('data-dynamic', 'true');
        container.appendChild(newScript);
      });

    } catch (error) {
      console.error('Error al cargar acercade.html:', error);
    }
  }

  set versionApp(value) {
    this._versionApp = value;
  }

  get versionApp() {
    return this._versionApp;
  }

  set fechaInicio(value) {
    this._fechaInicio = value;
  }

  get fechaInicio() {
    return this._fechaInicio;
  }

  set fechaFin(value) {
    this._fechaFin = value;
  }

  get fechaFin() {
    return this._fechaFin;
  }
}

customElements.define('acercade-component', AcercaDeComponent);
