import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import {MOCK_PRODUCTS} from "../mockAdminData"
import AddProductForm from '../components/product/AddProduct';

export const AddEditProductPage = () => {
      const { id } = useParams(); // si id est présent → edit, sinon → create
      const productToEdit = id ? MOCK_PRODUCTS.find(p => p.id === Number(id)) : null;
      const navigate = useNavigate();

 const handleSave = (productData) => {
    if (productToEdit) {
      console.log("Mettre à jour le produit :", productData);
      // ici tu ferais API PUT pour update
    } else {
      console.log("Créer un nouveau produit :", productData);
      // ici tu ferais API POST pour create
    }
    navigate("/admin/productlist"); // après sauvegarde → retour à la liste
  };
   const handleCancel = () => {
    navigate("/admin/productlist"); // retour à la liste
  };
 
  return (
    <>
    {
      productToEdit ? 
      <AddProductForm productToEdit={productToEdit} onSave={handleSave} onCancel={handleCancel} />
      :<AddProductForm onSave={handleSave} onCancel={handleCancel} />
    }
        
    </>
  )
}
