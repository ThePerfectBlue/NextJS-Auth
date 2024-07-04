const page = ({ params }: any) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="mb-10 text-3xl font-bold text-gray-800">Profile Page</h1>
      <h2 className="p-2 bg-yellow-400">{params.id}</h2>
    </div>
  );
};

export default page;
