import React, { useRef, useState } from "react";
import "./AddRecipes.css";
import axios from "axios";
import { baseUrl } from "../Url";
import { Navigate, useNavigate } from "react-router-dom";
import Loder from "../Loder/Loder2";

const AddRecipe = () => {
  const navigate = useNavigate();
  const imageFilesRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();
  const timeRef = useRef();
  const servingRef = useRef();
  const costRef = useRef();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [step, setStep] = useState([""]);
  const [ingredients, SetIngredients] = useState([""]);
    const [loading, setLoading] = useState(false);
  const addIngredients = () => {
    SetIngredients([...ingredients, ""]);
  };
  const addStep = () => {
    setStep([...step, ""]);
  };
  const handleStepChange = (index, val) => {
    const update = [...step];
    update[index] = val;
    setStep(update);
  };
  const handleIngredients = (index, val) => {
    const update = [...ingredients];
    update[index] = val;
    SetIngredients(update);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", titleRef.current.value);
    formData.append("description", descriptionRef.current.value);
    formData.append("time", timeRef.current.value);
    formData.append("serving", servingRef.current.value);
    formData.append("cost", costRef.current.value);

    // ✅ Just one image
    const file = imageFilesRef.current.files[0];
    if (file) {
      formData.append("photo", file); // backend expects 'photo'
    }

    // ✅ Convert steps and ingredients to JSON strings
    formData.append("steps", JSON.stringify(step));
    formData.append("ingredients", JSON.stringify(ingredients));
    formData.append("userId", user._id);
    
setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/user/upload/Recipe`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      navigate("/useruploadRecipe");
    } catch (err) {
      console.error("Submit error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="add-recipe-container">
      {loading && (
        <div className="loadingOverlay">
          <Loder loading={loading} />
        </div>
      )}
      <h2>Add a New Recipe</h2>
      <form onSubmit={handleSubmit} className="recipe-form">
        <input
          type="text"
          name="title"
          placeholder="Recipe Title"
          ref={titleRef}
        />
        <textarea
          name="description"
          placeholder="Description"
          ref={descriptionRef}
        />
        <input type="file" accept="image/*" ref={imageFilesRef} />
        <div className="small-inputs">
          <input
            type="text"
            name="time"
            placeholder="Time (e.g. 45 mins)"
            ref={timeRef}
          />
          <input
            type="text"
            name="servings"
            placeholder="Servings"
            ref={servingRef}
          />
          <input
            type="text"
            name="cost"
            placeholder="Cost per Serving"
            ref={costRef}
          />
        </div>

        <h4>Ingredients</h4>
        {ingredients.map((data, index) => (
          <input
          key={index} 
            type="text"
            placeholder={`Add Ingredients ${index + 1}`}
            value={data}
            onChange={(e) => handleIngredients(index, e.target.value)}
          />
        ))}

        <button type="button" onClick={addIngredients}>
          + Add Ingredient
        </button>

        <h4> Write step of the recipes Steps</h4>
        {step.map((data, index) => (
          <div key={index}>
            <p>Step {index + 1}</p>
            <textarea
              placeholder={`step ${index + 1}`}
              value={data}
              onChange={(e) => handleStepChange(index, e.target.value)}
            />
          </div>
        ))}

        <button type="button" onClick={addStep}>
          + Add Step
        </button>

        <button type="submit" className="submit-btn">
          Submit Recipe
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;
