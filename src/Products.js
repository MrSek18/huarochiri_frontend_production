import React, { useEffect, useState } from "react";
import api from "./api";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api
      .get("/products")
      .then((response) => {
        console.log("Respuesta de la API:", response.data);
        setProducts(response.data);
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  return (
    <div>
      <h2>Lista de Productos</h2>
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay productos disponibles.</p>
      )}
    </div>
  );
};

export default Products;
