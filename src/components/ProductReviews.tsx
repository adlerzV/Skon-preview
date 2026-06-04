"use client";

import React, { useState } from "react";

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  content: string;
}

export default function ProductReviews() {
  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, author: "محمد علوی", rating: 5, date: "۱۴۰۵/۰۲/۱۴", content: "تحویل بسیار سریع و پاسخگویی عالی بود. ممنون از سایت خوبتون." },
    { id: 2, author: "رضا کریمی", rating: 4, date: "۱۴۰۵/۰۳/۰۲", content: "قیمت‌ها نسبت به جاهای دیگه مناسب‌تره، فقط کاش تنوع ریجن‌ها بیشتر بشه." }
  ]);
  
  const [newReview, setNewReview] = useState({ author: "", rating: 5, content: "" });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.author || !newReview.content) return;
    const reviewItem: Review = {
      id: Date.now(),
      author: newReview.author,
      rating: newReview.rating,
      date: "۱۴۰۵/۰۳/۰۲", // می‌تونی بعداً با تاریخ شمسی داینامیک جایگزین کنی
      content: newReview.content
    };
    setReviews([reviewItem, ...reviews]);
    setNewReview({ author: "", rating: 5, content: "" });
  };

  return (
    <div className="w-full border-t border-brand-surface_hover pt-8 flex flex-col gap-6" dir="rtl">
      <h2 className="text-xl font-black text-brand-active border-r-4 border-brand-blue pr-3">
        نظرات کاربران
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        
        {/* ۷۰ درصد: فرم ثبت نظر و لیست نظرات جاری */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          <form onSubmit={handleReviewSubmit} className="bg-brand-menu p-6 border border-brand-surface_hover flex flex-col gap-4">
            <span className="text-sm font-bold text-brand-active">امتیاز و نظر خود را بنویسید</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="نام شما" 
                value={newReview.author}
                onChange={e => setNewReview({...newReview, author: e.target.value})}
                className="bg-brand-surface border border-brand-surface_hover p-3 text-sm text-brand-active focus:border-brand-blue outline-none"
              />
              <select 
                value={newReview.rating} 
                onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}
                className="bg-brand-surface border border-brand-surface_hover p-3 text-sm text-brand-active focus:border-brand-blue outline-none"
              >
                <option value="5">۵ ستاره (عالی)</option>
                <option value="4">۴ ستاره</option>
                <option value="3">۳ ستاره</option>
                <option value="2">۲ ستاره</option>
                <option value="1">۱ ستاره</option>
              </select>
            </div>
            <textarea 
              placeholder="متن نظر شما..." 
              rows={4}
              value={newReview.content}
              onChange={e => setNewReview({...newReview, content: e.target.value})}
              className="bg-brand-surface border border-brand-surface_hover p-3 text-sm text-brand-active focus:border-brand-blue outline-none resize-none"
            />
            <button type="submit" className="bg-brand-blue text-brand-active text-sm font-bold py-3 px-6 hover:bg-brand-blue/80 transition-colors self-start">ثبت نظر</button>
          </form>

          <div className="flex flex-col gap-4">
            {reviews.map(review => (
              <div key={review.id} className="bg-brand-menu p-5 border border-brand-surface_hover flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-brand-active">{review.author}</span>
                  <span className="text-xs text-brand-m_khonsa">{review.date}</span>
                </div>
                <div className="flex gap-1 text-brand-zard text-xs">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-brand-surface_m text-sm leading-7 mt-2">{review.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ۳۰ درصد: باکس امتیازات کلی محصول */}
        <div className="lg:col-span-4 bg-brand-menu p-6 border border-brand-surface_hover flex flex-col items-center justify-center gap-4 text-center w-full">
          <span className="text-sm font-bold text-brand-surface_m">امتیاز کلی محصول</span>
          <div className="text-5xl font-black text-brand-blue">۴.۷</div>
          <div className="flex gap-1 text-brand-zard text-lg">
            <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-brand-surface_hover">★</span>
          </div>
          <span className="text-xs text-brand-m_khonsa">براساس ۲ نظر ثبت شده</span>
          
          <div className="w-full flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2 text-xs w-full text-brand-surface_m">
              <span className="w-12 text-left">۵ ستاره</span>
              <div className="flex-1 bg-brand-surface h-2 rounded-full overflow-hidden">
                <div className="bg-brand-blue h-full w-[80%]" />
              </div>
              <span className="w-6 text-right">۸۰٪</span>
            </div>
            <div className="flex items-center gap-2 text-xs w-full text-brand-surface_m">
              <span className="w-12 text-left">۴ ستاره</span>
              <div className="flex-1 bg-brand-surface h-2 rounded-full overflow-hidden">
                <div className="bg-brand-blue h-full w-[20%]" />
              </div>
              <span className="w-6 text-right">۲۰٪</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}