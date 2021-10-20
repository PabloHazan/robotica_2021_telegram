import { Telegraf } from "telegraf";
import { createSmartScene } from "../framework/telegraf.scenes";

const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

interface NumerosState {
    cantidad: number;
    min: number;
    max: number;
}

export const numeros = (bot: Telegraf) => createSmartScene<NumerosState>(
    bot,
    ['numeros', 'Numeros'],
    ({ setState, sendMessage }) => {
        setState({
            cantidad: 0,
            min: 0,
            max: 0,
        });
        sendMessage('¿Cuántos números queres generar?')
    },
    ({ getNumberFromMessage, sendMessage, state }) => {
        state.cantidad = getNumberFromMessage();
        if (state.cantidad < 1) {
            sendMessage('Tiene que ser un número mayor o igual a 1');
            return 'repeat';
        } else {
            sendMessage('¿Cuál es el número mas chico?');
        }
    },
    ({ getNumberFromMessage, sendMessage, state }) => {
        state.min = getNumberFromMessage();
        sendMessage('¿Cuál es el número mas grande?');
    },
    ({ getNumberFromMessage, sendMessage, state }) => {
        state.max = getNumberFromMessage();
        if (state.max <= state.min) {
            sendMessage(`El número mas grande debe ser mayor que ${state.min}`);
            return 'repeat';
        } else if ((state.max - state.min) + 1 < state.cantidad) {
            sendMessage('La cantidad de números que se quiere generar no entra en el rango, ingrese un número máximo mayor');
            return 'repeat';
        }
        const numeros: Array<number> = [];
        while (numeros.length < state.cantidad) {
            const numero = getRandomNumber(state.min, state.max);
            if (!numeros.some(numeroAgregado => numeroAgregado === numero)) {
                numeros.push(numero);
            }
        }
        sendMessage(numeros
            .sort((primero, segundo) => primero - segundo)
            .join(' :: ')
        )
    }
)