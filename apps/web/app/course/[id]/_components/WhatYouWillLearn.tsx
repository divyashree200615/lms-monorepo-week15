export default function WhatYouWillLearn() {
  const points = [
    "Build real-world projects",
    "Understand HTML & CSS deeply",
    "Responsive design techniques",
    "Deploy websites professionally",
  ];

  return (
    <div className="border rounded-lg p-6 my-10">
      <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {points.map((p, i) => (
          <div key={i} className="flex gap-2">
            ✅ <span>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
