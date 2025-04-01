import React from 'react';

const Card = ({ title, value, icon }) => {
  return (
    <div className="bg-gray-800 text-white rounded-lg py-7 px-4 ">
      <div className="gap-3 flex align-middle">
        <span className="text-2xl">{icon}</span>
        <h5>{title}</h5>
      <h2 className="text-4xl font-bold">{value}</h2>
      </div>
    </div>
  );
};

export default Card;
