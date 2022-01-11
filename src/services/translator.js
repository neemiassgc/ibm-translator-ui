import net from "./net"

export function fetchLanguages() {
    return new Promise((resolve, reject) => {
        net.get("/languages")
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
}