var socket = io()

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre es necesario');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

//connect server
socket.on('connect', function () {
    console.log("Conectado al servidor");
    socket.emit('entrarChat', usuario, function (resp) {
        console.log('Usuarios conectados', resp);
    });
});

//disconnect server
socket.on('desconect', function () {
    console.log("usuario desconectado");
});

// //Enviar información
socket.on('crearMensaje', function (mensaje) {
    console.log('Servidor', mensaje);
});

//Escuhar cambios de usuarios
//cuando un usuario entra o sale del chat
socket.on('listaPersona', function (personas) {
    console.log(personas);
});

//Mensajes privados
socket.on('MensajePrivado', function(mensaje){
    console.log('Mensaje Privado', mensaje);
});
