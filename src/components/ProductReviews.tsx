"use client";

import React, { useState } from "react";

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  content: string;
}

const MAX_AUTHOR_LENGTH = 50;
const MAX_CONTENT_LENGTH = 500;

const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    author: "محمد علوی",
    rating: 5,
    date: "۱۴۰۵/۰۲/۱۴",
    content: "تحویل بسیار سریع و پاسخگویی عالی بود. ممنون از سایت خوبتون.",
  },
  {
    id: 2,
    author: "رضا کریمی",
    rating: 4,
    date: "۱۴۰۵/۰۳/۰۲",
    content:
      "قیمت‌ها نسبت به جاهای دیگه مناسب‌تره، فقط کاش تنوع ریجن‌ها بیشتر بشه.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-brand-zard text-xs" aria-label={`امتیاز ${rating} از ۵`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "text-brand-zard" : "text-brand-surface_hover"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductReviews() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const trimmedAuthor = author.trim();
    const trimmedContent = content.trim();

    if (!trimmedAuthor || !trimmedContent) {
      setSubmitError("لطفاً نام و متن نظر را وارد کنید.");
      return;
    }

    const review: Review = {
      id: Date.now(),
      author: trimmedAuthor.slice(0, MAX_AUTHOR_LENGTH),
      rating,
      date: new Date().toLocaleDateString("fa-IR"),
      content: trimmedContent.slice(0, MAX_CONTENT_LENGTH),
    };

    setReviews((prev) => [review, ...prev]);
    setAuthor("");
    setRating(5);
    setContent("");
  };

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percent:
      totalReviews > 0
        ? Math.round(
            (reviews.filter((r) => r.rating === star).length / totalReviews) *
              100
          )
        : 0,
  }));

  return (
    <div
      className="w-full border-t border-brand-surface_hover pt-8 flex flex-col gap-6"
      dir="rtl"
    >
      <h2 className="text-xl font-black text-brand-active border-r-4 border-brand-blue pr-3">
        نظرات کاربران
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        {/* فرم و لیست نظرات */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          <form
            onSubmit={handleReviewSubmit}
            className="bg-brand-menu p-6 border border-brand-surface_hover flex flex-col gap-4"
          >
            <span className="text-sm font-bold text-brand-active">
              امتیاز و نظر خود را بنویسید
            </span>

            {submitError && (
              <p className="text-xs text-red-500 font-medium">{submitError}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="نام شما"
                  value={author}
                  maxLength={MAX_AUTHOR_LENGTH}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="bg-brand-surface border border-brand-surface_hover p-3 text-sm text-brand-active focus:border-brand-blue outline-none"
                />
                <span className="text-[10px] text-brand-surface_m text-left">
                  {author.length}/{MAX_AUTHOR_LENGTH}
                </span>
              </div>

              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="bg-brand-surface border border-brand-surface_hover p-3 text-sm text-brand-active focus:border-brand-blue outline-none"
              >
                <option value="5">۵ ستاره (عالی)</option>
                <option value="4">۴ ستاره</option>
                <option value="3">۳ ستاره</option>
                <option value="2">۲ ستاره</option>
                <option value="1">۱ ستاره</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <textarea
                placeholder="متن نظر شما..."
                rows={4}
                value={content}
                maxLength={MAX_CONTENT_LENGTH}
                onChange={(e) => setContent(e.target.value)}
                className="bg-brand-surface border border-brand-surface_hover p-3 text-sm text-brand-active focus:border-brand-blue outline-none resize-none"
              />
              <span className="text-[10px] text-brand-surface_m text-left">
                {content.length}/{MAX_CONTENT_LENGTH}
              </span>
            </div>

            <button
              type="submit"
              className="bg-brand-blue text-brand-active text-sm font-bold py-3 px-6 hover:bg-brand-blue/80 transition-colors self-start"
            >
              ثبت نظر
            </button>
          </form>

          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-brand-menu p-5 border border-brand-surface_hover flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-brand-active">
                    {review.author}
                  </span>
                  <span className="text-xs text-brand-m_khonsa">{review.date}</span>
                </div>
                <StarRating rating={review.rating} />
                <p className="text-brand-surface_m text-sm leading-7 mt-2">
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-brand-menu p-6 border border-brand-surface_hover flex flex-col items-center justify-center gap-4 text-center w-full">
          <span className="text-sm font-bold text-brand-surface_m">امتیاز کلی محصول</span>
          <div className="text-5xl font-black text-brand-blue">
            {avgRating.toLocaleString("fa-IR", { maximumFractionDigits: 1 })}
          </div>
          <StarRating rating={Math.round(avgRating)} />
          <span className="text-xs text-brand-m_khonsa">
            براساس {totalReviews.toLocaleString("fa-IR")} نظر ثبت شده
          </span>

          <div className="w-full flex flex-col gap-2 mt-2">
            {ratingCounts.map(({ star, percent }) => (
              <div
                key={star}
                className="flex items-center gap-2 text-xs w-full text-brand-surface_m"
              >
                <span className="w-12 text-left">{star} ستاره</span>
                <div className="flex-1 bg-brand-surface h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-blue h-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 text-right">{percent}٪</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
