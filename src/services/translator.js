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
      params: {
        from: from,
        to: to
      },
      data: {
        text: text
      },
      responseType: "text"
    })
    .then(response => resolve(response.data))
    .catch(error => reject(error));
  });
}