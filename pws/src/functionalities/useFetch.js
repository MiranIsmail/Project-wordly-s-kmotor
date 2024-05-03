import { useState, useEffect } from 'react';

const useFetch = (path, params) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const url = "http://127.0.0.1:8000/";


  useEffect(() => {
    setTimeout(() => {
        fetch(url+path+"?"+ new URLSearchParams(params)).then(res => {
            if (!res.ok) {
                throw Error('Could not fetch the data for that resource');
            }
            return res.json();
        }).then(data => {
            console.log(data);
            setData(data);
            setIsPending(false);
            setError(null);
        })
        .catch(e => {
            console.log(e.message);
            setError(e.message);
            setIsPending(false);
        })
    }, 1000);
  }, [url+path]);

  return { data, isPending, error };
}

export default useFetch;
