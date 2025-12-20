import React from "react";

const BusTimetableView: React.FC = () => {
  const routes = [
    {
      id: 1,
      title: "Starts from Gram Panchayat Waranga till Panchsheel Square",
      subtitle: "Scheduled from 08:00 AM till 08:35 PM",
      times: [
        "08:00 AM",
        "09:10 AM",
        "10:00 AM",
        "10:40 AM",
        "11:45 AM",
        "12:30 PM",
        "02:25 PM",
        "03:30 PM",
        "04:55 PM",
        "06:00 PM",
        "06:20 PM",
        "08:35 PM",
      ],
    },
    {
      id: 2,
      title: "Starts from Panchsheel Square till Gram Panchayat Waranga",
      subtitle: "Scheduled from 06:55 AM till 07:30 PM",
      times: [
        "06:55 AM",
        "08:00 AM",
        "08:50 AM",
        "09:10 AM",
        "10:30 AM",
        "11:10 AM",
        "01:10 PM",
        "02:15 PM",
        "03:40 PM",
        "04:45 PM",
        "05:15 PM",
        "07:30 PM",
      ],
    },
  ];

  const getHighlight = (time: string) => {
    const now = new Date();
    const [hourMin, period] = time.split(" ");
    const [hour, minute] = hourMin.split(":").map(Number);
    const date = new Date();
    date.setHours(period === "PM" && hour !== 12 ? hour + 12 : hour);
    date.setMinutes(minute);

    const diff = Math.abs(now.getTime() - date.getTime()) / 60000;
    return diff <= 20;
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
        Bus Timetable
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routes.map((route) => (
          <div
            key={route.id}
            className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {route.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {route.subtitle}
            </p>

            <div className="space-y-3">
              {route.times.map((t) => (
                <div
                  key={t}
                  className={`text-lg font-semibold ${
                    getHighlight(t)
                      ? "text-orange-500 dark:text-orange-400"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusTimetableView;
