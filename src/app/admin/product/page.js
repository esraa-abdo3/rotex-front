"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

import "./product.css";

export default function EditProduct() {


  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nameAr: "",
    nameEn: "",

    descAr: "",
    descEn: "",

    price: "",
    stock: "",

    category: "",

    image: "",
  });

  // GET PRODUCT
  async function getProduct() {
    try {
      const res = await axios.get(
        `https://rootex-backend.vercel.app/api/v1/product/6a105fe04036081b1eda3108`
      );

      const data = res.data;
      console.log(data)

      setForm({
        nameAr: data.name.ar,
        nameEn: data.name.en,

        descAr: data.description.ar,
        descEn: data.description.en,

        price: data.price,
        stock: data.stock,

        category: data.category,

        image: data.images[0],
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProduct();
  }, []);

  // HANDLE CHANGE
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // UPDATE PRODUCT
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await axios.put(
        `https://your-api.com/products/6a105fe04036081b1eda3108`,
        {
          name: {
            ar: form.nameAr,
            en: form.nameEn,
          },

          description: {
            ar: form.descAr,
            en: form.descEn,
          },

          price: Number(form.price),
          stock: Number(form.stock),

          category: form.category,
        }
      );

      alert("Product Updated Successfully");
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return <h2 className="loading">Loading...</h2>;
  }

  return (
    <div className="editProduct">
      <div className="top">
        <div>
          <h1>Edit Product</h1>
          <p>Update your product information</p>
        </div>

        <div className="imageBox">
          <Image
            src={form.image}
            alt="product"
            width={90}
            height={90}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* names */}
        <div className="grid2">
          <div className="inputGroup">
            <label>Name Arabic</label>

            <input
              type="text"
              name="nameAr"
              value={form.nameAr}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Name English</label>

            <input
           
              type="text"
              name="nameEn"
              value={form.nameEn}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* desc */}
        <div className="grid2">
          <div className="inputGroup">
            <label>Description Arabic</label>

            <textarea
              name="descAr"
              value={form.descAr}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Description English</label>

            <textarea
              name="descEn"
              value={form.descEn}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* price + stock */}
        <div className="grid2">
          <div className="inputGroup">
            <label>Price</label>

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Stock</label>

            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* category */}
        <div className="inputGroup">
          <label>Category</label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="hair-care">Hair Care</option>

            <option value="skin-care">Skin Care</option>

            <option value="body-care">Body Care</option>

            <option value="makeup">Makeup</option>
          </select>
        </div>

        <button className="saveBtn">
          Save Changes
        </button>
      </form>
    </div>
  );
}