import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/FormData.css";

export default function FormData() {
 // Saves the form information to send to the backend.
  const [result, setResult] = useState([]);
  const [dataToInsert, setDataToInsert] = useState({
    ProductName: "",
    SupplierID: "",
    CategoryID: "",
    Unit: "",
    Price: "",
  });
  const [redirected, setRedirected] = useState(false);

  const navigate = useNavigate();

  // Request information from the backend when the page is loaded.
  useEffect(() => {
    fetch("http://localhost:3000")
      .then((res) => res.json())
      .then((data) => {
        setResult(data);

        // Search for the item with the same ProductID as the pathname.
        const foundItem = data.find(
          (item) => window.location.pathname === `/modify/${item.ProductID}`
        );

        if (foundItem) {
          setDataToInsert((prevState) => ({
            ...prevState,
            ...foundItem,
          }));
        } else {
          // If the item cannot be found, redirects to the main page.
          if (!redirected) {
            setRedirected(true);
            navigate("/");
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Sends information to the backend when the submit button is clicked.
  const handleSubmit = (e) => {
    const foundItem = result.find(
      (item) => window.location.pathname === `/modify/${item.ProductID}`
    );
    if (foundItem) {
      fetch("http://localhost:3000", {
        method: "PUT",
        body: JSON.stringify(dataToInsert),
        headers: { "Content-Type": "application/json" },
      });
      navigate("/");
    } else {
      fetch("http://localhost:3000", {
        method: "POST",
        body: JSON.stringify(dataToInsert),
        headers: { "Content-Type": "application/json" },
      });
    }
  };
  // Stores information in the state as it is entered.
  const handleChange = (e) => {
    setDataToInsert({
      ...dataToInsert,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="form_div">
      <form onSubmit={handleSubmit} className="form">
        <input
          className="form_input"
          type="text"
          value={dataToInsert.ProductName}
          name="ProductName"
          onChange={handleChange}
          placeholder="Product Name"
          required
          autoComplete="none"
        />
        <input
          className="form_input"
          type="number"
          value={dataToInsert.SupplierID}
          name="SupplierID"
          onChange={handleChange}
          placeholder="Supplier ID"
          required
          autoComplete="none"
        />
        <input
          className="form_input"
          type="number"
          value={dataToInsert.CategoryID}
          name="CategoryID"
          onChange={handleChange}
          placeholder="Category ID"
          required
          autoComplete="none"
        />
        <input
          className="form_input"
          type="text"
          value={dataToInsert.Unit}
          name="Unit"
          onChange={handleChange}
          placeholder="Unit"
          required
          autoComplete="none"
        />
        <input
          className="form_input"
          type="number"
          value={dataToInsert.Price}
          name="Price"
          onChange={handleChange}
          placeholder="Price"
          required
          autoComplete="none"
        />
        <button className="form_button">Save</button>
      </form>
    </div>
  );
}
