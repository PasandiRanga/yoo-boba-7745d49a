const perfectFor = [
  { label: "Cafes", icon: <span role="img" aria-label="Cafe">☕</span> },
  { label: "Hotels", icon: <span role="img" aria-label="Hotel">🏨</span> },
  { label: "Restaurants", icon: <span role="img" aria-label="Restaurant">🍽️</span> },
  { label: "Mini Bars", icon: <span role="img" aria-label="Mini Bar">🍸</span> },
  { label: "Villas", icon: <span role="img" aria-label="Villa">🏡</span> },
  { label: "Catering", icon: <span role="img" aria-label="Catering">🥗</span> },
];

const BYOBPerfectFor = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold font-display mb-8 text-center dark:text-white">Perfect For</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {perfectFor.map((item, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
          {/* Horizontal Layout */}
          <div className="flex flex-col md:flex-row items-center">
            {/* Icon Section */}
            <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
              <div className="bg-yooboba-light dark:bg-gray-700 rounded-full p-6 text-yooboba-purple dark:text-pink-400 transform transition-transform hover:scale-110">
                <div className="text-4xl">
                  {item.icon}
                </div>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="flex-1 md:pl-6 text-center md:text-left">
              <h3 className="font-semibold text-2xl dark:text-white">{item.label}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default BYOBPerfectFor;
