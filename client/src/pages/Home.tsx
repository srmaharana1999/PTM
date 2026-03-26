import { Header, Hero } from "@/components/Home";

const HomePage = () => {
  return (
    <div>
      <div className="bg-linear-to-b from-fuchsia-100 via-fuchsia-200 to-violet-300 ">
        <Header />
        <Hero />
      </div>
    </div>
  );
};

export default HomePage;
