import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { HiOutlineDotsVertical } from "react-icons/hi";
import exporticon from "./../../../../assets/img/sla/export-icon.png";
import { Box } from "@mui/system";

const data = [
  { name: "Jan", Batch: 100, ModuleWise: 50 },
  { name: "Feb", Batch: 200, ModuleWise: 150 },
  { name: "Mar", Batch: 300, ModuleWise: 250 },
  { name: "Apr", Batch: 400, ModuleWise: 300 },
  { name: "May", Batch: 500, ModuleWise: 400 },
  { name: "Jun", Batch: 450, ModuleWise: 350 },
  { name: "Jul", Batch: 300, ModuleWise: 250 },
  { name: "Aug", Batch: 400, ModuleWise: 350 },
  { name: "Sep", Batch: 450, ModuleWise: 400 },
  { name: "Oct", Batch: 256, ModuleWise: 224 },
  { name: "Nov", Batch: 300, ModuleWise: 250 },
  { name: "Dec", Batch: 400, ModuleWise: 350 },
];

const Agenttraining = () => {
  return (
    <div>
      <div className="graph-container">
        <div className="graph-header">
          <div>
            <p className="name">Agents Training</p>
          </div>
          <div className="left-container">
            <button className="export-btn">
              {" "}
              <img src={exporticon} /> Export
            </button>
            <select className="form-select">
              <option value="">Last 12 Months</option>
            </select>
            <div className="dot-icon">
              <HiOutlineDotsVertical />
            </div>
          </div>
        </div>
        <div>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid
                  strokeDasharray="0" // Solid grid lines
                  horizontal={true}
                  vertical={false}
                  stroke="#e4e4e4"
                />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#666" }} tickLine={false} axisLine={{ stroke: "#ddd" }} />
                <YAxis tick={{ fontSize: 12, fill: "#666" }} tickLine={false} axisLine={{ stroke: "#ddd" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #fff",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Legend
                  align="left"
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: 12,
                    color: "#666",
                    paddingRight: 20,
                  }}
                />
                <Bar dataKey="Batch" fill="#007bff" barSize={10} stackId="stack" radius={[0, 0, 0, 0]} />
                <Bar dataKey="ModuleWise" fill="#74c0fc" barSize={10} stackId="stack" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Agenttraining;
