const { io } = require('../server');
const { Usuarios } = require('../classes/usuario');
const  { crearMensaje } = require('../utilidades/utilidades');
let usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mansaje: 'El nombre/sala es necesario'
            });
        }

        client.join(data.sala);

        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${ data.nombre } se unió`));
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasSala(data.sala));
        callback(usuarios.getPersonasSala(data.sala));

    });

    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        
        let mensaje = crearMensaje( persona.nombre, data.mensaje );
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        callback(mensaje);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${ personaBorrada.nombre } salio`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasSala(personaBorrada.sala));
    });

    //Mensaje privados
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('MensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    });
});