import { useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Calendar from "../../../common/Calendar";
import TableCurrentData from "./TableCurrentData";
import ElectricityData from "./ElectricityData";
import UsersElectricityByDate from "./UsersElectricityByDate";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const UsersElectricity = () => {

  const [startDate, setStartDate] = useState(new Date().toISOString());
  const [endDate, setEndDate] = useState(new Date().toISOString());
  
  return (
    <div>
      <TableCurrentData/>
      <Calendar 
        startDate={startDate} 
        setStartDate={setStartDate} 
        endDate={endDate} 
        setEndDate={setEndDate}
      />
      {(startDate !== new Date().toISOString() && endDate !== new Date().toISOString()) ?
        <UsersElectricityByDate startDate={startDate} endDate={endDate}/>
      : 
        <ElectricityData/>
      }
    </div>
  );
};
  
export default UsersElectricity;
  