import { useState, useEffect } from 'react';



function usePUT(path, body) {
  const url = "http://127.0.0.1:8000/"

  const [status, setStatus] = useState(null);
  const [data, setData] = useState(null);

  fetch(url + path, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }).then(res => {
    if (!res.ok) {
      throw Error('Could not fetch the data for that resource');
    }
    return res.json();
  }).then(data => {
    console.log(data);
  })
  
  return { status, data};
}

export default usePUT;