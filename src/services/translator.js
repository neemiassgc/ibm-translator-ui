import net from "./net"

export function fetchLanguages() {
  return new Promise((resolve, reject) => {
    net.get("/languages")
      .then(response => {
        const data = response.data
          .map(language => language.nativeLanguageName)
          .sort();

        resolve(data)
      })
      .catch(error => reject(error));
  });
}