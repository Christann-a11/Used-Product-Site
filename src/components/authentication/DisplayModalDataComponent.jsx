import React, { useState, useEffect } from 'react';
import { useGetModalData } from '../../controllers/UseModal';

const DisplayModalDataComponent = ({ model }) => {
  const { data, loading, error } = useGetModalData(model);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      // Assuming all objects in data have the same shape,
      // we can get headers from the first item.
      // We filter out private properties starting with '_'
      const firstItemHeaders = Object.keys(data[0]).filter(key => !key.startsWith('_'));
      setHeaders(firstItemHeaders);
    } else if (model) {
      // Fallback to model instance if data is empty
      const instance = new model();
      const instanceHeaders = Object.keys(instance).filter(key => !key.startsWith('_'));
      setHeaders(instanceHeaders);
    }
  }, [data, model]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header} scope="col">{header.charAt(0).toUpperCase() + header.slice(1)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id || index}>
              {headers.map(header => (
                <td key={header}>{String(item[header])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayModalDataComponent;