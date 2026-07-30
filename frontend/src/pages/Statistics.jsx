import React, { useEffect, useState } from "react";
import useReportStore from "../stores/useReportStore.js";
import { getDonorsCount } from "../stores/useDonorStore.js";

const Statistics = () => {
  const { getReportsCount } = useReportStore();

  const [stats, setStats] = useState([
    {
      label: "Total Reports",
      value: 0,
      icon: "🚨",
    },
    {
      label: "Total Donors",
      value: 0,
      icon: "🧑‍🤝‍🧑",
    },
  ]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Fetch reports count
        const reportsCount = await getReportsCount();
        
        // Fetch donors count
        const donorsCount = await getDonorsCount();
        
        // Update stats with the fetched values
        setStats([
          {
            label: "Total Reports",
            value: reportsCount,
            icon: "🚨",
          },
          {
            label: "Total Donors",
            value: donorsCount,
            icon: "🧑‍🤝‍🧑",
          },
        ]);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl text-black font-bold text-center mb-10">
          Blood Requirement Dashboard
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white shadow rounded-xl p-6 flex flex-col items-start"
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                <span className="text-lg">{stat.icon}</span>
              </div>
              <div className="text-2xl font-semibold text-black">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;