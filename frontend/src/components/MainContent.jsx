import React from 'react'
import Card from "../components/Card";
import Chart from "../components/Chart";
import Messages from "../components/Messages";
import { BsBag, BsTruck, BsCart4 } from "react-icons/bs";

const MainContent = () => {
  return (
    <div className=''>
           {/* Cards Section */}
           <div className="p-4 flex gap-4 flex-wrap">
          <Card title="New Orders" value="43" icon={<BsBag />} />
          <Card title="Shipped Orders" value="88" icon={<BsTruck />} />
          <Card title="Pending Orders" value="56" icon={<BsCart4 />} />
        </div>

        {/* Content Section */}
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Chart */}
          <Chart />

          {/* Messages */}
          <Messages />
        </div>
    </div>
  )
}

export default MainContent