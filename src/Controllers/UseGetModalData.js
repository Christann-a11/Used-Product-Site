import { useState, useEffect } from 'react';
import { getModelName } from './utils/getModelName';

export const useGetModalData  = (modal) => {
 const  [data, setData] = useState([]);
 const  [loading, setLoading]= useState(true);
 const  [error, setError] = useState(null);
 
 const modelName = getModelName(modal);
 const url = `https://used-products-selling-site-backend-api.onrender.com/api/${modelName}`;

 useEffect(() => {
   const fetchData = async () => {
     setLoading(true);
     setError(null);
     try {
       const token = localStorage.getItem('token');
       if (!token) {
         throw new Error('Not authorized, no token');
       }
       const response = await fetch(url, {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       });
       if (!response.ok) {
         throw new Error(`Server error: ${response.status} ${response.statusText}`);
       }

       const result = await response.json();

       // Transform data into the modal format and update state
       const transformedData = result.map(item => modal.constructor.fromJSON(item));
       setData(transformedData);

     } catch (error) {
       console.error("Error fetching modal data:", error);
       setError(error);
     } finally {
         setLoading(false);
     }
   };

   fetchData();
 }, [url]); // Rerun effect if url changes

 return { data, loading, error };

}
