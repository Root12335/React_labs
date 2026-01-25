import Slider from "./component/Slider.jsx";
import Footer from "./component/Footer.jsx";
import Header from "./component/Header";
import ProductCard from "./component/ProductCard.jsx";
import NewArrivals from "./component/NewArrivals.jsx";
import TopSelling from "./component/TopSelling.jsx";
import DressStyle from "./component/DressStyle.jsx";


function App() {
  return (
    <>
      <Header />
      <Slider />
      <NewArrivals />
      <TopSelling />
      <DressStyle />

      <Footer />
    </>
  );
}

export default App;
