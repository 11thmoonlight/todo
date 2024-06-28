import AddNew from "@/components/AddNew";

async function HomePage() {
  return (
    <div className="grid grid-cols-4 gap-8 justify-center px-4 ">
      <AddNew />
    </div>
  );
}

export default HomePage;
