const perfectFor = [
  { label: "Cafes", icon: <span role="img" aria-label="Cafe">☕</span> },
  { label: "Hotels", icon: <span role="img" aria-label="Hotel">🏨</span> },
  { label: "Restaurants", icon: <span role="img" aria-label="Restaurant">🍽️</span> },
  { label: "Mini Bars", icon: <span role="img" aria-label="Mini Bar">🍸</span> },
  { label: "Villas", icon: <span role="img" aria-label="Villa">🏡</span> },
  { label: "Catering", icon: <span role="img" aria-label="Catering">🥗</span> },
];

const BYOBPerfectFor = () => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
    <h2 className="text-2xl font-bold font-display mb-6 dark:text-white">Perfect For</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {perfectFor.map((item, i) => (
        <div key={i} className="flex flex-col items-center p-4 bg-yooboba-light/50 dark:bg-gray-700/50 rounded-lg text-center">
          <div className="mb-3 text-yooboba-purple dark:text-pink-400">{item.icon}</div>
          <span className="font-medium dark:text-white">{item.label}</span>
        </div>
      ))}
    </div>
  </div>
);

export default BYOBPerfectFor;
