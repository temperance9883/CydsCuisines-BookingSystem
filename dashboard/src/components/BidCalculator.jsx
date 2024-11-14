import React, { useState } from "react";

export default function BidCalculator() {
  const [ingredients, setIngredients] = useState([]);
  const [markup, setMarkup] = useState(0.2); // 20% markup by default
  const [totalCost, setTotalCost] = useState(0);
  const [status, setStatus] = useState("maybe");

  // Mock function to fetch ingredient prices
  const fetchIngredientPrice = async (ingredient) => {
    // Replace this URL with your API endpoint
    const response = await fetch(
      `https://api.spoonacular.com/food/ingredients/${ingredient}/price`
    );
    const data = await response.json();
    return data.price; // Assuming response has a price field
  };

  const calculateBid = async () => {
    let cost = 0;
    for (const ingredient of ingredients) {
      const price = await fetchIngredientPrice(ingredient.name);
      cost += price * ingredient.quantity;
    }
    setTotalCost(cost + cost * markup);
  };

  const handleSubmitBid = () => {
    // Post bid information to your backend
    const bid = { totalCost, status, ingredients };
    // Update backend and calendar based on the bid status
  };

  return (
    <div>
      <h1>Bid Calculator</h1>
      <div>
        <label>Markup (%): </label>
        <input
          type="number"
          value={markup * 100}
          onChange={(e) => setMarkup(e.target.value / 100)}
        />
      </div>

      <button onClick={calculateBid}>Calculate Bid</button>
      <p>Total Cost: ${totalCost.toFixed(2)}</p>

      <label>Status: </label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="accepted">Accepted</option>
        <option value="maybe">Maybe</option>
        <option value="rejected">Rejected</option>
      </select>

      <button onClick={handleSubmitBid}>Submit Bid</button>
    </div>
  );
}
