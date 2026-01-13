const templateCache = {};
var arrayGlobal = []; //array de promotores
var folderPathIMG="";//variable que guarda id de carpeta donde se guardan las imagenes
var versionApp="1.5";
const API_URL = "https://script.google.com/a/macros/envia.co/s/AKfycbxYk37eyW65emvTSs2hYuEg_Xo8s5UORfbVf6Wc0wxS9tqRw6nvM8RN19deuihIpbYO/exec";

function getRegistro() {
  let main = document.getElementById('App');
  removeALLChilds(main);
  const registro = document.createElement('registro-component');
  registro.setAttribute('container', '#App'); // <-- aquí pasas el parámetro
  main.appendChild(registro);
  const foto = document.createElement('foto-component');
  foto.setAttribute('container', '#App'); // <-- aquí pasas el parámetro
  main.appendChild(foto); 
}

function getHome() {
  let main = document.getElementById('App');
  removeALLChilds(main);
  const componente = document.createElement('bienvenida-component');
  componente.setAttribute('container', '#App'); // <-- aquí pasas el parámetro
  componente.versionApp = versionApp; // <-- Aquí se pasa la versión antes de renderizar
  main.appendChild(componente);

  /******************************************************** */
}



function errorUpload(data) {
  alert("Error al generar el archivo");
}

function removeALLChilds(parentNode) {
  while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.firstChild);
  }
}

function alertSMS(texto) {
  let myToast = document.querySelector('.toast');
  let smsToast = document.querySelector('.toast-body');
  let toast = new bootstrap.Toast(myToast);
  smsToast.innerHTML = texto;
  toast.show();
}

function getInforme() {    
  let main = document.getElementById('App');
  removeALLChilds(main);
  const informe = document.createElement('informe-component');
  informe.setAttribute('container', '#App'); // <-- aquí pasas el parámetro
  main.appendChild(informe);
  const vmodal = document.createElement('vmodal-component');
  vmodal.setAttribute('container', '#App'); // <-- aquí pasas el parámetro
  main.appendChild(vmodal); 
}

function getNomina() {  
  let main = document.getElementById('App');
  removeALLChilds(main);
  const nomina = document.createElement('nomina-component');
  nomina.setAttribute('container', '#App'); // <-- aquí pasas el parámetro
  main.appendChild(nomina);
  const vmodal = document.createElement('vmodal-component');
  vmodal.setAttribute('container', '#App'); // <-- aquí pasas el parámetro
  main.appendChild(vmodal); 
}

async function getArrayPromotors() {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: new URLSearchParams({ action: 'getPromotoresYUrl' })
    });

    const data = await response.json();

    if (data.status === 'success') {
      arrayGlobal = data.data.promotores; // Promotores
      folderPathIMG = data.data.urlImagenes; // URL de imágenes      
    } else {
      console.log(data.mensaje || "Error al obtener promotores");
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function crearLoader() {
  eliminarLoader();
  let containerloader = document.createElement('div');
  containerloader.id = "containerloader";
  let loader = document.createElement('div');
  loader.id = "loader";
  for (let i = 0; i < 4; i++) {
    loader.appendChild(document.createElement('div'));
  }
  loader.classList.add('lds-roller');
  containerloader.appendChild(loader);
  document.body.appendChild(containerloader);
}

function eliminarLoader() {
  let loader = document.getElementById('containerloader');
  if (loader) loader.remove();
}

function cerrarModalesActivos() {
  const allModals = document.querySelectorAll('.modal.show');
  allModals.forEach(modal => {
    const instance = bootstrap.Modal.getInstance(modal);
    if (instance) instance.hide();
  });
}

// Este código también puede ir en el archivo .js si no requiere esperar a que HTML cargue
function setNavbarCollapse(){
  const navLinks = document.querySelectorAll('.nav-item');
  const menuToggle = document.getElementById('navbarText');
  const bsCollapse = new bootstrap.Collapse(menuToggle, { toggle: false });

  navLinks.forEach((l) => {
    l.addEventListener('click', () => {
      bsCollapse.toggle();
    });
  });
}

document.addEventListener("DOMContentLoaded", async function () {   
  /************Para forzar actualizacion de PWA**************/
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/asist/service-worker.js', { scope: '/asist/' })
      .then(reg => {
        reg.onupdatefound = () => {
          const newSW = reg.installing;
          newSW.onstatechange = () => {
            if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('Nueva versión detectada, recargando...');
              window.location.reload(); // Puedes reemplazar esto con una notificación
            }
          };
        };
      })
      .catch(error => {
        console.error('Error al registrar el Service Worker:', error);
      });
  }
  /************Para forzar actualizacion de PWA**************/    
  setNavbarCollapse();
  getHome();
  getArrayPromotors();
});


