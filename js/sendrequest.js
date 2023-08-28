function sendRequest(method, url, body, func) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.responseType = 'json';

  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        let response = xhr.response;
        func(response);
      } catch (error) {
        console.log('Ошибка загрузки');
        func(null);
      }
    }
  })

  xhr.addEventListener('error', () => {
    console.log('Ошибка загрузки');
    func(null);
  })

  xhr.send(body);
}