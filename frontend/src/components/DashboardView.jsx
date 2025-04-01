import React from 'react';
import { Card as BootstrapCard, Row, Col } from 'react-bootstrap';
import { BsBag, BsTruck, BsCart4 } from "react-icons/bs";
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import Chart from "../components/Chart";
import DashboardMessages from './DashboardMessaages';
function Card ({ title, value, icon, percentageChange, miniChartData })  {
  const isPositive = percentageChange >= 0;
  
  return (
    <BootstrapCard className="h-100 border-0 shadow-sm">
      <BootstrapCard.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded-circle bg-primary bg-opacity-10">
              {React.cloneElement(icon, { className: 'text-primary', size: 20 })}
            </div>
            <span className="text-muted fs-6">{title}</span>
          </div>
          {percentageChange && (
            <span className={`badge ${isPositive ? 'bg-success' : 'bg-danger'} bg-opacity-10 
              ${isPositive ? 'text-success' : 'text-danger'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(percentageChange)}%
            </span>
          )}
        </div>
        
        <h3 className="mb-3 fw-bold">{value}</h3>
        
        {miniChartData && (
          <div style={{ height: '40px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={miniChartData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0d6efd" 
                  strokeWidth={2} 
                  dot={false}
                />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </BootstrapCard.Body>
    </BootstrapCard>
  );
};

const generateMiniChartData = (length = 7) => {
  return Array.from({ length }, (_, i) => ({
    name: `Day ${i + 1}`,
    value: Math.floor(Math.random() * 100)
  }));
};

function DashboardView() {
  const cardData = [
    {
      title: "New Orders",
      value: "43",
      icon: <BsBag />,
      percentageChange: 12.5,
      miniChartData: generateMiniChartData()
    },
    {
      title: "Shipped Orders",
      value: "88",
      icon: <BsTruck />,
      percentageChange: -5.2,
      miniChartData: generateMiniChartData()
    },
    {
      title: "Pending Orders",
      value: "56",
      icon: <BsCart4 />,
      percentageChange: 8.7,
      miniChartData: generateMiniChartData()
    }
  ];

  return (
    <div className="p-4">
      {/* <Row className="g-4 mb-4">
        {cardData.map((card, index) => (
          <Col key={index} xs={12} md={6} lg={4}>
            <Card {...card} />
          </Col>
        ))}
      </Row> */}

      <Row className="g-4">
        {/* <Col xs={12} lg={6}>
          <Chart />
        </Col> */}
        <Col xs={12} lg={6}>
          <DashboardMessages />
        </Col>
      </Row>
    </div>
  );
}

export default DashboardView;