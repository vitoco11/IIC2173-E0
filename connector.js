const amqp = require('amqplib');

// de canvas sacamos esto
const AMQP_URL = 'amqps://observer.12:0TZ4bwVyP0WMUZHFRHnDk16H@broker.iic2173.org:5671/energy';
const QUEUE_NAME = 'observer.12.q'; 

async function connectToRabbitMQ() {
    try {
        console.log("Intentando conectar a RabbitMQ");
        
        // nos conectamos al servidor
        const connection = await amqp.connect(AMQP_URL);
        
        // creamos un canal
        const channel = await connection.createChannel();
        
        console.log(`Conectado, esperando mensajes en la cola ${QUEUE_NAME}...`);
        
        // Empezamos a recibir los eventos de la cola, esto se ejecuta cada vez que llega uno
        channel.consume(QUEUE_NAME, async (message) => {
            if (message !== null) {
                const mensajeTexto = message.content.toString();
                
                try {
                    // objeto json
                    const eventoJson = JSON.parse(mensajeTexto);

                    // enviamos el evento al master (api) para que lo guarde
                    const respuesta = await fetch('http://master:3000/eventos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(eventoJson)
                    });

                    // Solo si todo esta bien, hacemos ack para que rabbitMQ borre el msg de la cola
                    if (respuesta.ok) {
                        channel.ack(message);
                    } else {
                        console.error("El master rechazó el mensaje");
                    }
                } catch (error) {
                    console.error("Error al enviar el mensaje al master:", error.message);
                }
            }
        });

    } catch (error) {
        console.error("Hubo un error al conectar o se cayó la conexión:", error.message);
        
        // reconexión automatica dsp de 5 segundos del error
        console.log("Reintentando en 5 segundos...");
        setTimeout(connectToRabbitMQ, 5000); 
    }
}

connectToRabbitMQ();