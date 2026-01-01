import React from "react";

const TailwindTest = () => {
  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Tailwind CSS Test</h1>
        <p className="text-gray-100">
          If you can see these styles, Tailwind is working!
        </p>
      </div>

      <div className="flex space-x-4 justify-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Blue Button
        </button>
        <div className="bg-green-900 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Red Button
        </div>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Green Button
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-100 p-4 rounded-lg text-center">
          <h3 className="font-semibold text-red-800">Red Box</h3>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <h3 className="font-semibold text-blue-800">Blue Box</h3>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <h3 className="font-semibold text-green-800">Green Box</h3>
        </div>
      </div>
    </div>
  );
};

export default TailwindTest;
