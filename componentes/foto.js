class FotoComponent extends HTMLElement {
  constructor() {
    super();
    this.numClic = 0;
    this.objCamera = null;
    this.modalId = 'modal-' + crypto.randomUUID();
    this.videoId = 'video-' + crypto.randomUUID();
    this.canvasId = 'canvas-' + crypto.randomUUID();
    this.snapId = 'snap-' + crypto.randomUUID();
  }

  async connectedCallback() {
    const containerSelector = this.getAttribute('container') || '#App';
    const container = document.querySelector(containerSelector);
    if (!container) return console.error(`Contenedor no encontrado: ${containerSelector}`);

    try {
      const response = await fetch('view/foto.html');
      let htmlText = await response.text();

      // Reemplazar IDs en el HTML por IDs únicos
      htmlText = htmlText
        .replaceAll('id="staticBackdrop"', `id="${this.modalId}"`)
        .replaceAll('id="video"', `id="${this.videoId}"`)
        .replaceAll('id="canvas"', `id="${this.canvasId}"`)
        .replaceAll('id="snap"', `id="${this.snapId}"`);

      // Insertar contenido
      const template = document.createElement('template');
      template.innerHTML = htmlText;
      this.innerHTML = '';
      this.appendChild(template.content.cloneNode(true));

      // Inicializar modal y cámara
      this.initModal();
    } catch (error) {
      console.error('Error al cargar foto.html:', error);
    }
  }

  initModal() {
    const modalEl = document.getElementById(this.modalId);
    const video = document.getElementById(this.videoId);
    const canvas = document.getElementById(this.canvasId);
    const snap = document.getElementById(this.snapId);

    const bsModal = new bootstrap.Modal(modalEl, { backdrop: 'static', keyboard: false });

    // Abrir cámara
    this.openCamera = () => {
      this.reset();
      bsModal.show();
    };

    // Tomar foto
    snap.addEventListener('click', () => {
      const ctx = canvas.getContext('2d');
      canvas.width = 320;
      canvas.height = 240;
      ctx.drawImage(video, 0, 0, 320, 240);
      this.numClic = 1;
    });

    // Iniciar stream
    const constraints = { video: { facingMode: "user" }, audio: false };
    modalEl.addEventListener('shown.bs.modal', async () => {
      if (this.objCamera) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        this.objCamera = stream;
        video.addEventListener('loadedmetadata', () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        });
      } catch (e) {
        console.error('Error al acceder a la cámara:', e);
        alertSMS("Error al acceder a la cámara");
      }
    });

    // Cerrar modal
    modalEl.addEventListener('hidden.bs.modal', () => {
      if (this.objCamera) {
        this.objCamera.getTracks().forEach(track => track.stop());
        this.objCamera = null;
      }
      this.reset();
    });
  }

  reset() {
    this.numClic = 0;
    const canvas = this.querySelector('canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  getNumClic() {
    return this.numClic;
  }

  getCanvas() {
    return this.querySelector('canvas');
  }
}

customElements.define('foto-component', FotoComponent);
