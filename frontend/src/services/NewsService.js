import axios from 'axios';

export function getFeed() {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:${window.nexusBackendPort}/news/feed`)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

export function getSources() {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:${window.nexusBackendPort}/news/sources`)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

export function saveSources(sources) {
    return new Promise((resolve, reject) => {
        axios.post(`http://localhost:${window.nexusBackendPort}/news/sources`, { sources: sources })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}