const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();
const port = 3010;

app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();
async function fetchAllRestaurants() {
   let query = "Select * from restaurants";
   let response = await db.all(query, []);
  return { restaurants: response }
}
app.get('/restaurants', async (req, res) => {
   try {
    let result = await fetchAllRestaurants();
     if(result.restaurants.length === 0) {
       return res.status(500).json({ message: "no restaurants found"})
     }
     return res.status(200).json(result);
   } catch (error) {
     return res.status(400).json({ error: error.message })
   }
});

async function getRestaurantsByID(id) {
  let query = "Select * from restaurants where id = ?";
  let response = await db.all(query, [id]);
 return { restaurants: response }
}
app.get('/restaurants/details/:id', async (req, res) => {
  try {
   const id = req.params.id;
   let result = await getRestaurantsByID(id);
    if(result.restaurants.length === 0) {
      return res.status(500).json({ message: "no restaurants found"})
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

async function getRestaurantsByCuisine(cuisine) {
  let query = "Select * from restaurants where cuisine = ?";
  let response = await db.all(query, [cuisine]);
 return { restaurants: response }
}
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
   const cuisine = req.params.cuisine;
   let result = await getRestaurantsByCuisine(cuisine);
    if(result.restaurants.length === 0) {
      return res.status(500).json({ message: "no restaurants found"})
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

async function getRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query = "Select * from restaurants where isVeg= ? AND hasOutdoorSeating = ? AND isLuxury = ?";
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response }
}
app.get('/restaurants/filter', async (req, res) => {
  try {
   const {isVeg, hasOutdoorSeating, isLuxury } = req.query;
   let result = await getRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury);
    if(result.restaurants.length === 0) {
      return res.status(500).json({ message: "no restaurants found"})
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

async function sortByRating() {
  let query = "Select * from restaurants order by rating DESC";
  let response = await db.all(query, []);
  return { restaurants: response }
}
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
   let result = await sortByRating();
    if(result.restaurants.length === 0) {
      return res.status(500).json({ message: "no restaurants found"})
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

async function fetchAllDishes() {
  let query = "Select * from dishes";
  let response = await db.all(query, []);
  return { dishes: response }
}
app.get('/dishes', async (req, res) => {
  try {
   let result = await fetchAllDishes();
    if(result.dishes.length === 0) {
      return res.status(500).json({ message: "no dishes found"})
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

async function getDishByID(id) {
  let query = "Select * from dishes where id = ?";
  let response = await db.all(query, [id]);
  return { dishes: response }
}
app.get('/dishes/details/:id', async (req, res) => {
  try {
    let id = req.params.id;
   let result = await getDishByID(id);
    if(result.dishes.length === 0) {
      return res.status(500).json({ message: "no dishes found"})
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

async function getDishByFilterVegNonVeg(isVeg) {
  let query = "Select * from dishes where isVeg = ?";
  let response = await db.all(query, [isVeg]);
  return { dishes: response }
}
app.get('/dishes/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
   let result = await getDishByFilterVegNonVeg(isVeg);
    if(result.dishes.length === 0) {
      return res.status(500).json({ message: "no dishes found"})
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

async function sortByRatingDishes() {
  let query = "Select * from dishes order by price";
  let response = await db.all(query, []);
  return { dishes: response }
}
app.get('/dishes/sort-by-price', async (req, res) => {
  try {
   let result = await sortByRatingDishes();
    if(result.dishes.length === 0) {
      return res.status(500).json({ message: "no dishes found"})
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
