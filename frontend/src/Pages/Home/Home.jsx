import { useState } from "react";
import Header from "../../Components/Header/Header";
import FoodDisplay from "../../Components/FoodDisplay/FoodDisplay";

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div className="home">
      <Header />
      <FoodDisplay category={category} />
    </div>
  );
};

export default Home;
