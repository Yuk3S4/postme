/* Declaracion de variables globales */
let MAIN;
let MODAL_POST;
let BTN_SHOW_POST;
let BTN_CANCEL_POST;
let deferredPrompt;
let TITLE;
let DESCRIPTION;

// Funciones
const showPostModal = () => {
    MAIN.style.display = 'none';
    MODAL_POST.style.display = 'block';
    setTimeout(() => {
      MODAL_POST.style.transform = 'translateY(0)';
    }, 1);
};
const closePostModal = () => {
    MAIN.style.display = 'block';
    MODAL_POST.style.transform = 'translateY(100vh)';
};

const sendData = async (e) => {
    try {
        e.preventDefault();
        TITLE = document.getElementById('title').value;
        DESCRIPTION = document.getElementById('description').value;
        if(TITLE && DESCRIPTION) {
            console.log(db);
            await db.collection('posts').add({
                title: TITLE,
                description: DESCRIPTION,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            const data = {
                message: 'Registro exitosamente almacenado',
                timeout: 1500
            };
            Message().MaterialSnackbar.showSnackbar(data);
        } else {
            const data = {
                message: 'Faltan campos por llenar',
                timeout: 1500
            };
            Message('error').MaterialSnackbar.showSnackbar(data);
        }
    } catch (error) {
        const data = {
            message: error.message,
            timeout: 1500
        };
        Message('error').MaterialSnackbar.showSnackbar(data);
    }
};

window.addEventListener('beforeinstallprompt', (e) => { // Para que no aparezca la pantalla de quiere instalar la app??
    e.preventDefault();
    deferredPrompt = e;
});

// Cuando se cargue todo nuestro DOM
window.addEventListener('load', async () => {
    try {
        MAIN = document.querySelector('#main');
        MODAL_POST = document.querySelector('#modal-post-section');
        BTN_SHOW_POST = document.querySelector('#btn-upload-post');
        BTN_SHOW_POST.addEventListener('click', showPostModal);
        BTN_CANCEL_POST = document.querySelector('#btn-post-cancel');
        BTN_CANCEL_POST.addEventListener('click', closePostModal);
    
        // await Notification.requestPermission();
    
        if('serviceWorker' in navigator) {
            await navigator.serviceWorker.register('sw.js');            
        }
    
        window.Message = (option = 'success', container = document.getElementById('toast-container')) => {
            container.classList.remove('success');
            container.classList.remove('error');
            container.classList.add(option);
            return container;
        };
    
        window.Loading = (option = 'block') => {
            document.getElementById('loading').style.display = option;
        };
    
        // Agarrando el boton enviar post
        const btnPostSubmit = document.getElementById('btn-post-submit');
        btnPostSubmit.addEventListener('click', (e) => sendData(e));
    
        const bannerInstall = document.getElementById('banner-install');
        bannerInstall.addEventListener('click', async () => {
            if(deferredPrompt) {
                deferredPrompt.prompt();
                const response = await deferredPrompt.userChoice;
                if(response.outcome == 'dismissed') {
                    console.error('El usuario canceló la instalación');
                }
            }
        });
        
    } catch (error) {
        const data = {
            message: error.message,
            timeout: 5000
        };
        Message('error').MaterialSnackbar.showSnackbar(data);
    }
    // IndexDB
    
    // if(window.indexedDB) {
    //     const request = window.indexedDB.open('mi-base-datos', 2); // base de datos | version

    //     // Observer
    //     request.onupgradeneeded = event => {
    //         let db = event.target.result;
    //         db.createObjectStore('cursos', {
    //             keyPath: 'id'
    //         });
    //     };

    //     // Errores
    //     request.onerror = event => {
    //         console.log(event);
    //     };

    //     // Success
    //     request.onsuccess = event => {
            
    //         // Agregar
    //         let db = event.target.result;

    //         const cursosData = [
    //             {
    //                 id: '1',
    //                 curso: 'Mi primera PWA',
    //                 descripcion: 'Este será un curso para trabajar offline'
    //             },
    //             {
    //                 id: '2',
    //                 curso: 'React Avanzado',
    //                 descripcion: 'Curso de react con puro hooks'
    //             },
    //             {
    //                 id: '3',
    //                 curso: 'Vue Avanzado',
    //                 descripcion: 'Curso en el cual veremos un clon de youtube'
    //             },
    //         ];

    //         let cursosTransaccion = db.transaction('cursos', 'readwrite');

    //         // Ocurre un error en la transaccion
    //         cursosTransaccion.onerror = e => {
    //             console.error('[IDB]', e.target.error );
    //         };

    //         // Informa sobre el éxito de la transacción
    //         cursosTransaccion.oncomplete = e => {
    //             console.info('[IDB]', e );
    //         };
            
    //         let cursosStore = cursosTransaccion.objectStore('cursos');            
            
    //         for( let curso of cursosData ) {
    //             cursosStore.add( curso );
    //         }
            
    //         cursosStore.onsuccess = e => {
    //             console.info('Nuevo curso agregado al IDB');
    //         };
    //     };
    // }
});