import {useEffect, useState, type FormEvent} from 'react';
import {CheckCircle2, MessageSquarePlus, Star} from 'lucide-react';
import {OWNER_NAME, SHOP_NAME} from '../constants/workshop';

interface CustomerReview {
  id: string;
  customerName: string;
  bikeModel: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const RATING_LABELS: Record<number, string> = {
  1: '1 Star — Sudhar Zaroori',
  2: '2 Stars — Theek-Thak',
  3: '3 Stars — Accha Kaam',
  4: '4 Stars — Bahut Accha',
  5: '5 Stars — Shandar Seva',
};

function formatReviewDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [customerName, setCustomerName] = useState('');
  const [bikeModel, setBikeModel] = useState('');
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/reviews')
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (
          data: {
            reviews?: CustomerReview[];
            averageRating?: number;
            totalReviews?: number;
          } | null,
        ) => {
          if (!active || !data) {
            return;
          }
          const list = Array.isArray(data.reviews) ? data.reviews : [];
          setReviews(list);
          setTotalReviews(typeof data.totalReviews === 'number' ? data.totalReviews : list.length);
          setAverageRating(typeof data.averageRating === 'number' ? data.averageRating : 0);
        },
      )
      .catch(() => {
        // Keep empty list safely on network error
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanName = customerName.trim();
    const cleanBike = bikeModel.trim();
    const cleanComment = comment.trim();

    if (cleanName.length < 2) {
      setErrorMsg('Kripya apna sahi naam likhein (kam se kam 2 akshar).');
      return;
    }
    if (cleanComment.length < 5) {
      setErrorMsg('Kripya apna anubhav kam se kam 5 aksharon mein likhein.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          customerName: cleanName,
          bikeModel: cleanBike,
          rating: selectedRating,
          comment: cleanComment,
        }),
      });

      const payload = (await res.json()) as {
        ok?: boolean;
        error?: string;
        review?: CustomerReview;
      };

      if (!res.ok || !payload.review) {
        setErrorMsg(payload.error ?? 'Review save nahi ho saka. Kripya dobara koshish karein.');
        return;
      }

      const nextList = [payload.review, ...reviews];
      const nextTotal = nextList.length;
      const nextAvg = Number(
        (nextList.reduce((sum, item) => sum + item.rating, 0) / nextTotal).toFixed(1),
      );

      setReviews(nextList);
      setTotalReviews(nextTotal);
      setAverageRating(nextAvg);
      setCustomerName('');
      setBikeModel('');
      setSelectedRating(5);
      setComment('');
      setSuccessMsg('Dhanyavaad! Aapka review aur star rating save ho gaya hai.');
    } catch {
      setErrorMsg('Server se sampark nahi ho saka. Kripya thodi der baad koshish karein.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const activeStarValue = hoverRating || selectedRating;

  return (
    <section id="reviews" className="py-14 sm:py-20 bg-white border-t border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-emerald-700">
              Grahakon ka Vishwas aur Star Rating
            </p>
            {/* Main Heading in English */}
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
              Customer Reviews &amp; Star Ratings
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Agar aapne <strong className="text-slate-900">{SHOP_NAME}</strong> par {OWNER_NAME} ji
              se apni bike ya scooter service karwayi hai, to apna review aur star rating zaroor
              dein.
            </p>
          </div>

          {/* Real Average Star Summary */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 py-4 flex items-center gap-4 shrink-0">
            <div>
              <p className="font-mono-tabular text-2xl sm:text-3xl font-extrabold text-emerald-950">
                {totalReviews > 0 ? `${averageRating.toFixed(1)} / 5` : 'New'}
              </p>
              <p className="text-xs font-semibold text-emerald-800">
                {totalReviews > 0
                  ? `${totalReviews} Customer Review${totalReviews > 1 ? 's' : ''}`
                  : 'Pehla Star Review Dein'}
              </p>
            </div>
            <div className="flex items-center gap-1" aria-label="Average customer star rating">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = totalReviews > 0 ? star <= Math.round(averageRating) : true;
                return (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      filled ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                    }`}
                    aria-hidden="true"
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Write a Review + Interactive 1-5 Star Selector */}
          <div className="lg:col-span-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 sm:p-7 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <MessageSquarePlus className="w-5 h-5 text-emerald-800" aria-hidden="true" />
              <h3 className="font-display text-xl font-bold text-slate-900">
                Write a Service Review
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="block text-sm font-semibold text-slate-800 mb-2">
                  Star Rating Chunein *
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 py-2"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = star <= activeStarValue;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setSelectedRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          aria-label={`${star} Star`}
                          aria-pressed={selectedRating === star}
                          className="p-1 rounded-lg transition-transform duration-150 hover:scale-110 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              active ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-emerald-900">
                    {RATING_LABELS[activeStarValue]}
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-customer-name"
                  className="block text-sm font-semibold text-slate-800 mb-1.5"
                >
                  Apka Naam *
                </label>
                <input
                  id="review-customer-name"
                  type="text"
                  required
                  maxLength={80}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Jaise: Rahul Kumar"
                  className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div>
                <label
                  htmlFor="review-bike-model"
                  className="block text-sm font-semibold text-slate-800 mb-1.5"
                >
                  Bike / Scooter Model (Optional)
                </label>
                <input
                  id="review-bike-model"
                  type="text"
                  maxLength={80}
                  value={bikeModel}
                  onChange={(e) => setBikeModel(e.target.value)}
                  placeholder="Jaise: Splendor Plus, Apache, Activa"
                  className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div>
                <label
                  htmlFor="review-comment"
                  className="block text-sm font-semibold text-slate-800 mb-1.5"
                >
                  Apka Anubhav (Review) *
                </label>
                <textarea
                  id="review-comment"
                  required
                  rows={3}
                  maxLength={500}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Service kaisi lagi, kaam aur behaviour ke baare mein likhein..."
                  className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              {errorMsg && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-red-700"
                >
                  {errorMsg}
                </p>
              )}

              {successMsg && (
                <div
                  role="status"
                  className="rounded-xl bg-emerald-100 border border-emerald-300 px-3.5 py-2.5 flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-900"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" aria-hidden="true" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                <Star className="w-4 h-4 fill-amber-300 text-amber-300 shrink-0" aria-hidden="true" />
                <span>{isSubmitting ? 'Review Save Ho Raha Hai...' : 'Review aur Star Jama Karein'}</span>
              </button>
            </form>
          </div>

          {/* Right: Customer Reviews Feed */}
          <div className="lg:col-span-7 space-y-4">
            {isLoading ? (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-8 text-center text-sm text-slate-600">
                Customer reviews load ho rahe hain...
              </div>
            ) : reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/30 p-8 sm:p-10 text-center space-y-3">
                <div className="inline-flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-6 h-6 fill-amber-400 text-amber-500"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                  Be the First to Rate Our Workshop
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Abhi tak koi review darj nahi hua hai. Baayi taraf diye form mein star rating aur
                  apna anubhav likhkar sabse pehla review dein.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reviews.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-emerald-200/90 bg-white p-5 shadow-sm flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className="flex items-center gap-0.5"
                          aria-label={`${item.rating} out of 5 stars`}
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= item.rating
                                  ? 'fill-amber-400 text-amber-500'
                                  : 'text-slate-200'
                              }`}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <span className="font-mono-tabular text-xs font-bold text-amber-700">
                          {item.rating}/5 Stars
                        </span>
                      </div>

                      <p className="text-sm text-slate-700 leading-relaxed">{item.comment}</p>
                    </div>

                    <div className="pt-3 border-t border-emerald-100 flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{item.customerName}</p>
                        {item.bikeModel && (
                          <p className="text-emerald-700 font-medium truncate">{item.bikeModel}</p>
                        )}
                      </div>
                      <span className="text-slate-500 shrink-0">
                        {formatReviewDate(item.createdAt)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
