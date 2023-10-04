import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [allProducts, setAllProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewSingle, setViewSingle] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetch('https://tjeho5ur2rhijcjiukbzvph7je0wnqoy.lambda-url.us-east-2.on.aws/')
      .then(response => {
        if (!response.ok) {
          throw new Error('could not fetch data');
        }
        return response.json();
      })
      .then(data => {
        setAllProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const productId = getQueryParamValue('id');
    if (productId && allProducts) {
      const product = allProducts.find(p => p.id.toString() === productId);
      if (product) {
        setViewProduct(product);
      }
    }
  }, [allProducts]);

  const setViewProduct = product => {
    setFilteredProducts([product]);
    setViewSingle(true);
    window.history.pushState({}, '', `?id=${product.id}`);
  };

  const getQueryParamValue = name => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  };

  const handleSearchChange = event => {
    const term = event.target.value;
    setSearchTerm(term);

    if (allProducts) {
      const filtered = allProducts.filter(product =>
        product.id.toString().includes(term) ||
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.description.toLowerCase().includes(term.toLowerCase())
      );

      setFilteredProducts(filtered);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button> view {`something`} </button>
          <div>      <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
          /></div>

        </div>


        <div className="main-display">

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error.message}</p>
          ) : (
            <>
              {!viewSingle ? (
                <div>
                  <h1>Products</h1>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allProducts.map(product => (
                        <tr key={product.id} onClick={() => setViewProduct(product)}>
                          <td>{product.id}</td>
                          <td>{product.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <div>
                <h1>Products</h1>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id} onClick={() => setViewProduct(product)}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table></div>}
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
