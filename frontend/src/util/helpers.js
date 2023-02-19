const PORT_NUMBER = 5000

export const callNoBody = async (method, path, needToken) => {
  const requestOptions = {
    method: `${method}`,
    headers: {
      'Content-Type': 'application/json'
    },
  }

  if (needToken) {
    const token = localStorage.getItem('token');
    requestOptions.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`http://localhost:${PORT_NUMBER}${path}`, requestOptions);
  const data = await response.json();
  if (data.error) {
    alert(data.error);
    return;
  }
  return data;
}

export const callBody = async (method, path, body, needToken) => {
  const requestOptions = {
    method: `${method}`,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    },
  }

  if (needToken) {
    const token = localStorage.getItem('token');
    requestOptions.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`http://localhost:${PORT_NUMBER}${path}`, requestOptions);
  const data = await response.json();
  if (data.error) {
    alert(data.error);
    return;
  }
  return data;
}

// ID generator
const randInt = max => Math.floor(Math.random() * max);
export const generateId = (currentList, max = 999999999) => {
  let newID = randInt(max);
  while (currentList.includes(newID)) {
    newID = randInt(max);
  }
  return newID;
}

// Convert string to dictionary
export const convertCoords = (coordinates) => {
  const coordsArr = coordinates.split(" ");
  const lat = parseFloat(coordsArr[0])
  const lng = parseFloat(coordsArr[1])

  return {lat, lng};
}