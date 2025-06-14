const benefits = [
  {
    title: "Premium Quality Products",
    desc: "Authentic tapioca pearls and popping boba with superior taste and texture",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
  },
  {
    title: "Competitive Pricing",
    desc: "Wholesale rates that help maximize your profit margins",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
  },
  {
    title: "Custom Branding",
    desc: "Create your unique identity with customized packaging options",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
      </svg>
    ),
  },
  {
    title: "Training & Support",
    desc: "Comprehensive training materials and ongoing support for your team",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
      </svg>
    ),
  },
  {
    title: "Reliable Supply Chain",
    desc: "Consistent delivery and supply to ensure your business runs smoothly",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
      </svg>
    ),
  },
];


const BYOBBenefits = () => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 mb-8 border border-gray-100 dark:border-gray-700">
    <h2 className="text-2xl font-bold font-display mb-6 dark:text-white">Partnership Benefits</h2>
    <div className="space-y-6">
      {benefits.map((b, i) => (
        <div className="flex items-start" key={i}>
          <div className="bg-yooboba-light dark:bg-gray-700 rounded-full p-3 mr-4 text-yooboba-purple dark:text-pink-400">{b.icon}</div>
          <div>
            <h3 className="font-semibold text-lg mb-1 dark:text-white">{b.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{b.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default BYOBBenefits;
