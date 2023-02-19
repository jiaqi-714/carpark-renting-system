const PORT_NUMBER = 5000

function FetchHelper (method, path, body, needToken) {
  const requestOptions = {
    method,
    headers: { 'Content-Type': 'application/json' },
    body,
  }

  if (needToken) {
    const token = localStorage.getItem('ParkrToken');
    requestOptions.headers.Authorization = `Bearer ${token}`;
  }

  return new Promise(function (resolve, reject) {
    fetch(`http://localhost:${PORT_NUMBER}${path}`, requestOptions)
      .then(response => {
        if (response.ok) {
          resolve(response.json());
        } else {
          response.json()
            .then(err => {
              reject(err.error);
            });
        }
      })
      .catch(err => alert(err));
  })
}

export default FetchHelper;