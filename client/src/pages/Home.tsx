import Tasks from "@/components/Tasks";
const Home = () => {
  return (
    <div className="max-w-7xl w-11/12 mx-auto mt-30">
      <h1 className="text-3xl font-bold leading-relaxed">
        Welcome,{" "}
        <strong className="capitalize max-sm:block">John Doe 👋</strong>
      </h1>

      <Tasks />
    </div>
  );
};

export default Home;
