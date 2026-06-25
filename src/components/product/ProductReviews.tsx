"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface Review {
  id: string;
  productId: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
}

const STORAGE_KEY = "ger-group-reviews";

function loadReviews(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

function saveReviews(reviews: Review[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setReviews(loadReviews().filter((r) => r.productId === productId));
  }, [productId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newReview: Review = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productId,
      name: name.trim(),
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    const allReviews = [newReview, ...loadReviews()];
    saveReviews(allReviews);
    setReviews((prev) => [newReview, ...prev]);
    setName("");
    setComment("");
    setRating(5);
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0";

  return (
    <div className="mt-16 border-t border-border pt-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-[22px] font-normal">Хэрэглэгчийн сэтгэгдэл</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {reviews.length} сэтгэгдэл · Дундаж үнэлгээ {averageRating} / 5
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsOpen((v) => !v)}>
          {isOpen ? "Болих" : "Сэтгэгдэл бичих"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <AnimatePresence>
          {isOpen && (
            <motion.form
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-wider text-muted-foreground">
                  Нэр
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Таны нэр"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-wider text-muted-foreground">
                  Үнэлгээ
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-[20px] transition-colors ${
                        star <= rating ? "text-foreground" : "text-muted-foreground/30"
                      }`}
                      aria-label={`${star} од`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-wider text-muted-foreground">
                  Сэтгэгдэл
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Энэ бүтээгдэхүүний талаар сэтгэгдлээ бичнэ үү..."
                  required
                  className="min-h-[120px]"
                />
              </div>

              <Button type="submit" className="w-full sm:w-auto">
                Илгээх
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-6">
          {reviews.length === 0 ? (
            <p className="text-[13px] text-muted-foreground">
              Энэ бүтээгдэхүүнд хараахан сэтгэгдэл байхгүй байна. Анхдагч болоорой.
            </p>
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className="border-b border-border pb-6 last:border-0"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[13px] font-medium">{review.name}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("mn-MN")}
                  </span>
                </div>
                <div className="mb-2 flex text-[13px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < review.rating ? "text-foreground" : "text-muted-foreground/30"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {review.comment}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
