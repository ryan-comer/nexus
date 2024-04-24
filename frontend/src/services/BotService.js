import axios from 'axios';

export function startBot(name) {
    return new Promise((resolve, reject) => {
        axios.post(`http://localhost:${window.nexusBackendPort}/bots/start`, {name: name})
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    });
}

export function stopBot(name) {
    return new Promise((resolve, reject) => {
        axios.post(`http://localhost:${window.nexusBackendPort}/bots/stop`, {name: name})
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    });
}

export function saveBotSettings(name, settings) {
    return new Promise((resolve, reject) => {
        axios.post(`http://localhost:${window.nexusBackendPort}/bots/settings`, {name: name, settings: settings})
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    });
}

export function getBots() {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:${window.nexusBackendPort}/bots`)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    });
}