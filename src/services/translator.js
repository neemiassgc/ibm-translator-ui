import net from "./net"

export function fetchLanguages() {
  return new Promise((resolve, reject) => {
    net.get("/languages")
      .then(response => {
        const data = response.data
          .map(language => {
            return {
              name: language.nativeLanguageName,
              code: language.language
            }
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        resolve(data)
      })
      .catch(error => reject(error));
  });
}

export function translate(from, to, text) {
  return new Promise((resolve, reject) => {
    net.request({
      method: "POST",
      url: "/translate",
      data: {
        sourceLanguage: from,
        targetLanguage: to,
        text: text
      },
      responseType: "json"
    })
    .then(response => resolve(response.data))
    .catch(error => reject(error.response));
  });
}