// NOTE: The USDA FoodData Central API key is intentionally client-side.
// This is a free, public API with no sensitive data. The key is rate-limited
// by USDA and can be obtained freely at https://fdc.nal.usda.gov/api-key-signup.html
// In production on Cloudflare Pages, there is no backend to proxy through.
const API_KEY = import.meta.env.VITE_USDA_API_KEY || "DEMO_KEY";
const BASE_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

export function getEnergyKcal(food) {
  if (!food || !Array.isArray(food.foodNutrients)) return null;

  const nutrient =
    food.foodNutrients.find(
      (n) =>
        ((n.nutrientNumber === "208" || n.nutrientId === 1008) &&
          (n.unitName || "").toUpperCase() === "KCAL") ||
        ((n.nutrientName || "").toLowerCase().includes("energy") &&
          (n.unitName || "").toUpperCase() === "KCAL"),
    ) ||
    food.foodNutrients.find(
      (n) => (n.unitName || "").toUpperCase() === "KCAL",
    ) ||
    food.foodNutrients.find((n) =>
      (n.nutrientName || "").toLowerCase().includes("energy"),
    );

  if (!nutrient || nutrient.value == null) return null;

  const val = Number(nutrient.value);
  if (isNaN(val)) return null;

  if ((nutrient.unitName || "").toUpperCase() === "KJ") {
    return Math.round(val / 4.184);
  }

  return Math.round(val);
}

export async function searchFoods(query, signal) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const url = new URL(BASE_URL);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("query", query.trim());
  url.searchParams.set("pageSize", "10");

  const response = await fetch(url.toString(), { signal });
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        "USDA API rate limit reached. Please wait a moment or configure an API key in .env",
      );
    }
    throw new Error(
      `USDA API request failed with status: ${response.statusText || response.status}`,
    );
  }

  const data = await response.json();
  const foods = data.foods || [];

  return foods.map((food) => ({
    id: food.fdcId,
    description: food.description,
    brand: food.brandOwner || food.brandName || null,
    category: food.foodCategory || null,
    kcalPer100g: getEnergyKcal(food),
  }));
}
