'use client'

import Image from 'next/image'
import { useState } from 'react'

const categories = [
  'Development',
  'Business',
  'Finance & Accounting',
  'IT & Software',
  'Office Productivity',
  'Personal Development',
  'Design',
  'Marketing',
  'Health & Fitness',
  'Music',
]

const banners = [
  '/banners/one.png',
  '/banners/two.jpg',
  '/banners/three.jpg',
]

const learningCourses = [
  { title: 'The Complete Python Masterclass', lecture: 'Lecture • 0m', img: 'banners/python masterclass.webp' },
  { title: 'UX UI Design Course', lecture: 'Lecture • 2m', img: 'banners/ui ux.webp' },
  { title: 'Figma Essentials', lecture: 'Lecture • 1m', img: 'banners/Figma-Image.jpg' },
  { title: 'React for Beginners', lecture: 'Lecture • 3m', img: 'banners/react beg.png' },
]

const recommendedCourses = [
  { title: 'Git, GitHub Fundamentals', author: 'MTF Institute', rating: '4.2', img: 'banners/git-concepts.webp' },
  { title: 'Web Design Course', author: 'Stephen Koel', rating: '4.3', img: 'banners/web-design-concept-with-drawings.jpg' },
  { title: 'Mastering HTML5', author: 'Mehmood Khalil', rating: '4.7', img: 'banners/html.jpg' },
  { title: 'HTML CSS Advanced', author: 'Manuel Tudu', rating: '4.3', img: 'banners/images.jpg' },
  { title: 'HTML CSS WordPress', author: 'Manuel Tudu', rating: '4.4', img: 'banners/3.webp' },
]

const recentCourses = [
  {
    title: 'AI Engineer Agentic Track: The Complete Agent & MCP Course',
    author: 'Ed Donner, Ligency',
    rating: '4.7',
    reviews: '24,799',
    price: 449,
    originalPrice: 799,
    badge: 'Premium',
    img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
  },
  {
    title: 'AI Engineer MLOps Track: Deploy Gen AI & Agentic AI',
    author: 'Ligency, Ed Donner',
    rating: '4.8',
    reviews: '1,388',
    price: 449,
    originalPrice: 799,
    badge: 'Premium',
    img: 'https://images.unsplash.com/photo-1676299081847-824916de030a',
  },
  {
    title: 'AI Agents Crash Course: Build with Python & OpenAI',
    author: 'Sundog Education',
    rating: '4.7',
    reviews: '298',
    price: 449,
    originalPrice: 799,
    badge: 'Bestseller',
    img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
  },
  {
    title: 'AI Agents & Workflows – The Practical Guide',
    author: 'Maximilian Schwarzmüller',
    rating: '4.6',
    reviews: '2,696',
    price: 489,
    originalPrice: 799,
    badge: 'Premium',
    img: 'banners/agent.webp',
  },
  {
    title: 'Learn GenAI Tools & AI Agents for Software Testing',
    author: 'Rahul Shetty Academy',
    rating: '4.6',
    reviews: '10,897',
    price: 489,
    originalPrice: 2919,
    badge: 'Premium',
    tag: 'Bestseller',
    img: 'https://images.unsplash.com/photo-1605379399642-870262d3d051',
  },
]

const devCourses = [
  {
    title: 'The Complete JavaScript Course 2024: From Zero to Expert!',
    author: 'Jonas Schmedtmann',
    rating: '4.7',
    reviews: '190,234',
    price: 449,
    originalPrice: 3199,
    badge: 'Bestseller',
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
  },
  {
    title: 'React – The Complete Guide (incl Hooks, React Router)',
    author: 'Academind',
    rating: '4.6',
    reviews: '210,118',
    price: 449,
    originalPrice: 3499,
    badge: 'Bestseller',
    img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
  },
  {
    title: 'Node.js, Express, MongoDB & More: The Complete Bootcamp',
    author: 'Jonas Schmedtmann',
    rating: '4.7',
    reviews: '155,821',
    price: 449,
    originalPrice: 3299,
    badge: 'Bestseller',
    img: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3',
  },
  {
    title: 'Java Programming Masterclass updated to Java 21',
    author: 'Tim Buchalka',
    rating: '4.6',
    reviews: '198,772',
    price: 449,
    originalPrice: 3799,
    badge: 'Bestseller',
    img: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
  },
  {
    title: 'Python for Data Science and Machine Learning Bootcamp',
    author: 'Jose Portilla',
    rating: '4.6',
    reviews: '149,387',
    price: 449,
    originalPrice: 3499,
    badge: 'Bestseller',
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
  },
  {
    title: 'Docker & Kubernetes: The Practical Guide',
    author: 'Maximilian Schwarzmüller',
    rating: '4.7',
    reviews: '72,114',
    price: 499,
    originalPrice: 3499,
    badge: 'Hot & New',
    img: 'https://images.unsplash.com/photo-1629904853716-f0bc54eea481',
  },
]

const topPick = {
  title: 'The Ultimate Python Bootcamp – Everything You Need to Know',
  subtitle:
    'Master Python from Scratch to Advanced Levels in 2025! In-depth Python, Data Science, Web Development, and many more.',
  author: 'Oluwatoyosi Oladipo',
  updated: 'June 2025',
  hours: '38 total hours',
  lectures: '267 lectures',
  level: 'All Levels',
  rating: '4.8',
  reviews: '18',
  price: 449,
  originalPrice: 799,
  img: 'banners/python bootcamp.jpg',
}


export default function Page() {
  const [current, setCurrent] = useState(0)

  const prev = () => {
    setCurrent((c) => (c === 0 ? banners.length - 1 : c - 1))
  }

  const next = () => {
    setCurrent((c) => (c === banners.length - 1 ? 0 : c + 1))
  }

  const [learnIndex, setLearnIndex] = useState(0)
  const [recIndex, setRecIndex] = useState(0)

  const [recentIndex, setRecentIndex] = useState(0)
  const [devIndex, setDevIndex] = useState(0)



  return (
    <>
      {/* 🔹 Top Category Navbar (Centered) */}
      <div className="top-0 z-50 bg-white border-b">
        <div className="max-w-[1340px] mx-auto px-6">
          <ul className="flex justify-center gap-6 text-sm font-medium text-gray-700 h-12 items-center overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <li key={cat} className="whitespace-nowrap cursor-pointer hover:text-black">
                {cat}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 🔹 Banner Section */}
      <main className="max-w-[1340px] mx-auto px-4">
        <div className="relative mt-6 h-[420px] overflow-hidden rounded-md">

          {/* Background Image */}
          <Image
            src={banners[current]}
            alt="Udemy banner"
            fill
            priority
            className="object-cover"
          />

          {/* White Overlay Box */}
          <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-white w-[420px] p-8 shadow-lg z-10 rounded-[6px]">
            <h2 className="text-3xl font-bold mb-2">
              Every day a little closer
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Learning helps you reach your goals{' '}
              <span className="text-purple-700 underline cursor-pointer">
                Keep learning
              </span>{' '}
              and reap the rewards.
            </p>
          </div>

          {/* ⬅️ Left Arrow (Bigger) */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center z-20"
          >
            <svg width="26" height="26" viewBox="0 0 24 24">
              <path
                d="M15 18l-6-6 6-6"
                fill="none"
                stroke="black"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* ➡️ Right Arrow (Bigger) */}
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center z-20"
          >
            <svg width="26" height="26" viewBox="0 0 24 24">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="black"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

        </div>
      </main>

      {/* ================= LET'S START LEARNING ================= */}
      <section className="max-w-[1340px] mx-auto px-6 mt-16 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Let’s start learning</h2>
          <span className="text-purple-700 font-medium cursor-pointer hover:underline">
            My learning
          </span>
        </div>

        {learnIndex > 0 && (
          <button
            onClick={() => setLearnIndex(learnIndex - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow flex items-center justify-center z-20"
          >
            ‹
          </button>
        )}

        {learnIndex < learningCourses.length - 3 && (
          <button
            onClick={() => setLearnIndex(learnIndex + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow flex items-center justify-center z-20"
          >
            ›
          </button>
        )}

        <div className="flex gap-6 overflow-hidden">
          {learningCourses.slice(learnIndex, learnIndex + 3).map((c, i) => (
            <div key={i} className="min-w-[420px] border rounded-lg flex overflow-hidden">
              <div className="relative w-[140px] h-[90px]">
                <Image
                  src={c.img}
                  alt={c.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow">
                    ▶
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1">{c.title}</h3>
                <span className="text-xs text-gray-500">{c.lecture}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BUSINESS BANNER ================= */}
      <section className="max-w-[1340px] mx-auto px-6 mt-12">
        <div className="bg-gradient-to-r from-black to-gray-900 rounded-xl px-10 py-7 flex justify-between items-center">
          <p className="text-white text-lg font-medium">
            Training 2 or more people? Get your team access to Udemy's top 30,000+ courses
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-black px-5 py-2 rounded font-medium">
              Get Udemy Business
            </button>
            <button className="border border-white text-white px-5 py-2 rounded">
              Dismiss
            </button>
          </div>
        </div>
      </section>

      {/* ================= WHAT TO LEARN NEXT ================= */}
     <section className="max-w-[1340px] mx-auto px-6 mt-20 relative">
  <h2 className="text-3xl font-bold mb-1">What to learn next</h2>
  <p className="text-lg font-medium mb-6">Recommended for you</p>

  {/* RIGHT ARROW (Udemy style) */}
  {recIndex < recommendedCourses.length - 5 && (
    <button
      onClick={() => setRecIndex(recIndex + 1)}
      className="absolute right-2 top-[55%] -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-20"
    >
      <span className="text-2xl">›</span>
    </button>
  )}

  <div className="flex gap-6 overflow-hidden">
    {recommendedCourses.slice(recIndex, recIndex + 5).map((c, i) => (
      <div key={i} className="w-[240px] flex-shrink-0">
        
        {/* IMAGE */}
        <div className="relative h-[135px]">
          <Image
            src={c.img}
            alt={c.title}
            fill
            className="object-cover rounded"
            unoptimized
          />
        </div>

        {/* TITLE */}
        <h3 className="font-bold text-sm mt-2 leading-snug line-clamp-2">
          {c.title}
        </h3>

        {/* AUTHOR */}
        <p className="text-xs text-gray-600 mt-1">{c.author}</p>

        {/* RATING */}
        <div className="flex items-center gap-1 mt-1">
          <span className="text-sm font-bold text-orange-600">
            {c.rating}
          </span>
          <span className="text-orange-600 text-sm">★★★★★</span>
          <span className="text-xs text-gray-500">(1,234)</span>
        </div>

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-base">₹449</span>
          <span className="text-sm text-gray-500 line-through">₹799</span>
        </div>
      </div>
    ))}
  </div>
</section>
{/* ================= BASED ON YOUR RECENT SEARCHES ================= */}
<section className="max-w-[1340px] mx-auto px-6 mt-16 relative">
  <h2 className="text-2xl font-bold mb-6">
    Based on your recent searches
  </h2>

  {/* RIGHT ARROW */}
  {recentIndex < recentCourses.length - 5 && (
    <button
      onClick={() => setRecentIndex(recentIndex + 1)}
      className="absolute right-2 top-[52%] -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-20"
    >
      <span className="text-2xl">›</span>
    </button>
  )}

  {/* LEFT ARROW (appears after scroll) */}
  {recentIndex > 0 && (
    <button
      onClick={() => setRecentIndex(recentIndex - 1)}
      className="absolute left-2 top-[52%] -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-20"
    >
      <span className="text-2xl">‹</span>
    </button>
  )}

  <div className="flex gap-6 overflow-hidden">
    {recentCourses.slice(recentIndex, recentIndex + 5).map((c, i) => (
      <div key={i} className="w-[240px] flex-shrink-0">

        {/* IMAGE */}
        <div className="relative h-[135px]">
          <Image
            src={c.img}
            alt={c.title}
            fill
            className="object-cover rounded"
            unoptimized
          />
        </div>

        {/* TITLE */}
        <h3 className="font-bold text-sm mt-2 leading-snug line-clamp-2">
          {c.title}
        </h3>

        {/* AUTHOR */}
        <p className="text-xs text-gray-600 mt-1">{c.author}</p>

        {/* RATING */}
        <div className="flex items-center gap-1 mt-1">
          <span className="text-sm font-bold text-orange-600">
            {c.rating}
          </span>
          <span className="text-orange-600 text-sm">★★★★★</span>
          <span className="text-xs text-gray-500">({c.reviews})</span>
        </div>

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-base">₹{c.price}</span>
          <span className="text-sm text-gray-500 line-through">
            ₹{c.originalPrice}
          </span>
        </div>

        {/* BADGES */}
        <div className="flex gap-2 mt-2">
          {c.badge && (
            <span className="text-xs font-bold px-2 py-[2px] bg-purple-600 text-white rounded">
              {c.badge}
            </span>
          )}
          {c.tag && (
            <span className="text-xs font-bold px-2 py-[2px] bg-teal-100 text-teal-800 rounded">
              {c.tag}
            </span>
          )}
        </div>
      </div>
    ))}
  </div>
</section>

{/* ================= POPULAR FOR SOFTWARE DEVELOPERS ================= */}
<section className="max-w-[1340px] mx-auto px-6 mt-16 relative">
  <h2 className="text-2xl font-bold mb-6">
    Popular for Software Developers
  </h2>

  {/* RIGHT ARROW */}
  {devIndex < devCourses.length - 5 && (
    <button
      onClick={() => setDevIndex(devIndex + 1)}
      className="absolute right-2 top-[52%] -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-20"
    >
      <span className="text-2xl">›</span>
    </button>
  )}

  {/* LEFT ARROW */}
  {devIndex > 0 && (
    <button
      onClick={() => setDevIndex(devIndex - 1)}
      className="absolute left-2 top-[52%] -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-20"
    >
      <span className="text-2xl">‹</span>
    </button>
  )}

  <div className="flex gap-6 overflow-hidden">
    {devCourses.slice(devIndex, devIndex + 5).map((c, i) => (
      <div key={i} className="w-[240px] flex-shrink-0">

        {/* IMAGE */}
        <div className="relative h-[135px]">
          <Image
            src={c.img}
            alt={c.title}
            fill
            className="object-cover rounded"
            unoptimized
          />
        </div>

        {/* TITLE */}
        <h3 className="font-bold text-sm mt-2 leading-snug line-clamp-2">
          {c.title}
        </h3>

        {/* AUTHOR */}
        <p className="text-xs text-gray-600 mt-1">{c.author}</p>

        {/* RATING */}
        <div className="flex items-center gap-1 mt-1">
          <span className="text-sm font-bold text-orange-600">
            {c.rating}
          </span>
          <span className="text-orange-600 text-sm">★★★★★</span>
          <span className="text-xs text-gray-500">({c.reviews})</span>
        </div>

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-base">₹{c.price}</span>
          <span className="text-sm text-gray-500 line-through">
            ₹{c.originalPrice}
          </span>
        </div>

        {/* BADGES */}
        <div className="flex gap-2 mt-2">
          {c.badge && (
            <span className="text-xs font-bold px-2 py-[2px] bg-teal-100 text-teal-800 rounded">
              {c.badge}
            </span>
          )}
        </div>
      </div>
    ))}
  </div>
</section>
<section className="max-w-[1340px] mx-auto px-6 mt-16">
  <h2 className="text-2xl font-bold mb-4">Our top pick for you</h2>

  <div className="border rounded p-6 flex gap-8">
    {/* IMAGE */}
    <div className="relative w-[480px] h-[260px] flex-shrink-0">
      <Image
        src={topPick.img}
        alt={topPick.title}
        fill
        className="object-cover rounded"
        unoptimized
      />
    </div>

    {/* CONTENT */}
    <div className="flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-bold mb-2">{topPick.title}</h3>

        <p className="text-base text-gray-700 mb-3 max-w-[720px]">
          {topPick.subtitle}
        </p>

        <p className="text-sm text-gray-600 mb-2">
          By {topPick.author}
        </p>

        <p className="text-sm text-gray-600 mb-2">
          Updated <span className="font-semibold">{topPick.updated}</span> ·{' '}
          {topPick.hours} · {topPick.lectures} · {topPick.level}
        </p>

        {/* RATING */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-orange-600">
            {topPick.rating}
          </span>
          <span className="text-orange-600">★★★★★</span>
          <span className="text-sm text-gray-500">
            ({topPick.reviews})
          </span>

          <span className="ml-3 text-xs font-bold bg-purple-600 text-white px-2 py-1 rounded">
            Premium
          </span>
        </div>
      </div>

      {/* PRICE */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold">₹{topPick.price}</span>
        <span className="text-lg text-gray-500 line-through">
          ₹{topPick.originalPrice}
        </span>
      </div>
    </div>
  </div>
</section>
<section className="max-w-[1340px] mx-auto px-6 mt-20 relative">
  <h2 className="text-2xl font-bold mb-6">
    Topics recommended for you
  </h2>

  <div className="relative">
    <button className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow flex items-center justify-center z-10">
      <span className="text-2xl">›</span>
    </button>

    <div className="grid grid-cols-5 gap-4 pr-16">
      {[
        'HTML',
        'Java',
        'CSS',
        'Spring Boot',
        'Web Design',
        'Artificial Intelligence (AI)',
        'Web Development',
        'Generative AI (GenAI)',
        'JavaScript',
        'ChatGPT',
      ].map((topic) => (
        <div
          key={topic}
          className="border border-gray-300 py-4 text-center font-semibold text-sm hover:bg-gray-50 cursor-pointer"
        >
          {topic}
        </div>
      ))}
    </div>
  </div>
</section>
<section className="mt-20 bg-[#2d2f45] text-white">
  <div className="max-w-[1340px] mx-auto px-6 py-10 flex items-center justify-between">
    <div>
      <h3 className="text-xl font-bold mb-2">
        Teach the world online
      </h3>
      <p className="text-sm text-gray-200">
        Create an online video course, reach students across the globe,
        and earn money
      </p>
    </div>

    <button className="border border-white px-5 py-2 font-semibold hover:bg-white hover:text-black transition">
      Teach on Udemy
    </button>
  </div>
</section>
<section className="bg-[#2d2f45] border-t border-gray-600">
  <div className="max-w-[1340px] mx-auto px-6 py-8 flex items-center justify-between">
    <p className="text-white font-semibold">
      Top companies choose Udemy Business to build in-demand career skills.
    </p>

    <div className="flex items-center gap-10 text-gray-300 font-bold text-lg">
      <span>Nasdaq</span>
      <span>Volkswagen</span>
      <span>NetApp</span>
      <span>Eventbrite</span>
    </div>
  </div>
</section>
<footer className="bg-[#1c1d2f] text-white border-t border-[#3e3f51]">
  <div className="max-w-[1340px] mx-auto px-6 py-16">
    <div className="grid grid-cols-4 gap-16 text-sm">
      {/* Certifications by Skill */}
      <div>
        <h4 className="font-bold mb-4">Certifications by Skill</h4>
        <ul className="space-y-2 text-gray-300">
          <li>Cybersecurity Certification</li>
          <li>Project Management Certification</li>
          <li>Cloud Certification</li>
          <li>Data Analytics Certification</li>
          <li>HR Management Certification</li>
          <li className="font-semibold text-white">See all Certifications</li>
        </ul>
      </div>

      {/* Data Science */}
      <div>
        <h4 className="font-bold mb-4">Data Science</h4>
        <ul className="space-y-2 text-gray-300">
          <li>Data Science</li>
          <li>Python</li>
          <li>Machine Learning</li>
          <li>ChatGPT</li>
          <li>Deep Learning</li>
        </ul>
      </div>

      {/* Communication */}
      <div>
        <h4 className="font-bold mb-4">Communication</h4>
        <ul className="space-y-2 text-gray-300">
          <li>Communication Skills</li>
          <li>Presentation Skills</li>
          <li>Public Speaking</li>
          <li>Writing</li>
          <li>PowerPoint</li>
        </ul>
      </div>

      {/* Business Analytics */}
      <div>
        <h4 className="font-bold mb-4">Business Analytics & Intelligence</h4>
        <ul className="space-y-2 text-gray-300">
          <li>Microsoft Excel</li>
          <li>SQL</li>
          <li>Microsoft Power BI</li>
          <li>Data Analysis</li>
          <li>Business Analysis</li>
        </ul>
      </div>
    </div>
  </div>

    <div className="border-t border-[#3e3f51]">
    <div className="max-w-[1340px] mx-auto px-6 py-16">
      <div className="grid grid-cols-4 gap-16 text-sm">
        {/* About */}
        <div>
          <h4 className="font-bold mb-4">About</h4>
          <ul className="space-y-2 text-gray-300">
            <li>About us</li>
            <li>Careers</li>
            <li>Contact us</li>
            <li>Blog</li>
            <li>Investors</li>
          </ul>
        </div>

        {/* Discover Udemy */}
        <div>
          <h4 className="font-bold mb-4">Discover Udemy</h4>
          <ul className="space-y-2 text-gray-300">
            <li>Get the app</li>
            <li>Teach on Udemy</li>
            <li>Plans and Pricing</li>
            <li>Affiliate</li>
            <li>Help and Support</li>
          </ul>
        </div>

        {/* Udemy for Business */}
        <div>
          <h4 className="font-bold mb-4">Udemy for Business</h4>
          <ul className="space-y-2 text-gray-300">
            <li>Udemy Business</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-bold mb-4">Legal & Accessibility</h4>
          <ul className="space-y-2 text-gray-300">
            <li>Accessibility statement</li>
            <li>Privacy policy</li>
            <li>Sitemap</li>
            <li>Terms</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

    <div className="border-t border-[#3e3f51]">
    <div className="max-w-[1340px] mx-auto px-6 py-6 flex items-center justify-between text-sm text-gray-300">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold">udemy</span>
        <span>© 2025 Udemy, Inc.</span>
      </div>

      <div className="flex items-center gap-8">
        <span className="cursor-pointer hover:underline">Cookie settings</span>
        <div className="flex items-center gap-2 cursor-pointer">
          🌐 <span>English</span>
        </div>
      </div>
    </div>
  </div>
</footer>
    </>
  )
}
