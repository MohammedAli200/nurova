import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
  X,
  Stethoscope,
  ArrowRight,
  Filter,
} from "lucide-react";

import UserNavbar from "../../../components/layout/UserNavbar";
import ClayCard from "../../../components/ui/ClayCard";
import ClayButton from "../../../components/ui/ClayButton";
import ClayBadge from "../../../components/ui/ClayBadge";
import ClayInput from "../../../components/ui/ClayInput";
import ClayTextarea from "../../../components/ui/ClayTextarea";
import ClaySelect from "../../../components/ui/ClaySelect";
import ClayModal from "../../../components/ui/ClayModal";
import ClaySkeleton from "../../../components/ui/ClaySkeleton";
import ClayEmptyState from "../../../components/ui/ClayEmptyState";
import ClayErrorState from "../../../components/ui/ClayErrorState";
import { useToast } from "../../../contexts/ToastContext";
import { useAuth } from "../../../contexts/AuthContext";

import { getQuestions, createQuestion } from "../services/communityService";

const CATEGORIES = [
  "All Topics",
  "Ayurveda",
  "Physiotherapy",
  "Acupuncture",
  "Chiropractic",
  "Holistic Nutrition",
  "Stress & Mindfulness",
  "General Wellness",
];

const STATUS_TABS = [
  { id: "all", label: "All Discussions" },
  { id: "latest", label: "Latest" },
  { id: "most-discussed", label: "Most Discussed" },
  { id: "unanswered", label: "Awaiting Answers" },
  { id: "answered", label: "Answered" },
];

export default function CommunityPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [activeTab, setActiveTab] = useState("all");

  // Ask Question Modal State
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    title: "",
    category: "Ayurveda",
    content: "",
    tags: "",
  });

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (selectedCategory !== "All Topics") {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      if (activeTab === "most-discussed") {
        params.sort = "most-discussed";
      } else if (activeTab === "unanswered") {
        params.status = "unanswered";
      } else if (activeTab === "answered") {
        params.status = "answered";
      } else {
        params.sort = "latest";
      }

      const res = await getQuestions(params);
      setQuestions(res.data || []);
    } catch (err) {
      console.error("Failed to load community questions:", err);
      setError(
        err.response?.data?.message || "Failed to load community discussions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [selectedCategory, activeTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadQuestions();
  };

  const handleAskQuestionSubmit = async (e) => {
    e.preventDefault();

    if (!questionForm.title.trim() || questionForm.title.trim().length < 5) {
      toast.error(
        "Please provide a descriptive title (at least 5 characters).",
        "Validation Error"
      );
      return;
    }

    if (
      !questionForm.content.trim() ||
      questionForm.content.trim().length < 10
    ) {
      toast.error(
        "Please explain your question in detail (at least 10 characters).",
        "Validation Error"
      );
      return;
    }

    try {
      setSubmitting(true);
      const res = await createQuestion({
        title: questionForm.title.trim(),
        category: questionForm.category,
        content: questionForm.content.trim(),
        tags: questionForm.tags,
      });

      toast.success(
        "Your question has been posted to the community!",
        "Question Submitted"
      );
      setAskModalOpen(false);
      setQuestionForm({
        title: "",
        category: "Ayurveda",
        content: "",
        tags: "",
      });

      // Reload or navigate to new discussion
      if (res.data?._id) {
        navigate(`/community/${res.data._id}`);
      } else {
        await loadQuestions();
      }
    } catch (err) {
      console.error("Failed to post question:", err);
      toast.error(
        err.response?.data?.message || "Failed to submit question.",
        "Submission Error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-sand font-georama pb-16">
      <UserNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Community Header Banner */}
        <ClayCard level="2" className="p-6 sm:p-8 relative overflow-hidden border border-white/80">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="font-bitcount text-burntOrange text-xs uppercase font-bold tracking-wider">
                  COMMUNITY CARE & CLINICAL ADVICE
                </span>
                <span className="text-[10px] bg-forest/10 text-forest px-2 py-0.5 rounded-full font-bold">
                  Verified Insights
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-forest tracking-tight">
                Wellness Community Q&A
              </h1>

              <p className="text-sm sm:text-base text-forest/80 leading-relaxed font-medium">
                Ask wellness questions, seek guidance on alternative therapies, and receive accredited clinical responses from certified practitioners across Physiotherapy, Ayurveda, Acupuncture, and Chiropractic care.
              </p>
            </div>

            <div className="flex-shrink-0">
              <ClayButton
                type="button"
                variant="forest"
                size="md"
                icon={Plus}
                onClick={() => setAskModalOpen(true)}
              >
                Ask a Question
              </ClayButton>
            </div>
          </div>
        </ClayCard>

        {/* Filter and Search Bar */}
        <ClayCard level="1" className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="md:col-span-8 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40 pointer-events-none" />
              <input
                type="text"
                placeholder="Search questions by topic, condition, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-2.5 rounded-2xl bg-warmBeige/60 border border-white/60 shadow-[inset_1px_1px_3px_rgba(53,92,69,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:border-forest/50 font-medium"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      loadQuestions();
                    }}
                    className="text-forest/40 hover:text-forest p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded-xl bg-forest text-sand text-xs font-bold shadow-sm hover:bg-forest/90 cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Status Pill / Stats */}
            <div className="md:col-span-4 flex items-center justify-end gap-2 text-xs font-semibold text-forest/60">
              <MessageSquare className="w-4 h-4 text-forest" />
              <span>{questions.length} discussion{questions.length === 1 ? "" : "s"} listed</span>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-forest/10 pt-1">
            {STATUS_TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    active
                      ? "clay-btn-forest text-sand shadow-[2px_2px_6px_rgba(53,92,69,0.25)]"
                      : "text-forest/70 hover:text-forest hover:bg-white/40"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-burntOrange text-white shadow-sm"
                      : "bg-warmBeige/80 text-forest/75 hover:text-forest hover:bg-white/50 border border-white/40"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </ClayCard>

        {/* Questions Feed */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <ClayCard key={i} level="1" className="p-5 space-y-3 animate-pulse">
                <div className="h-5 bg-forest/20 rounded w-2/3" />
                <div className="h-3 bg-forest/10 rounded w-full" />
                <div className="h-3 bg-forest/10 rounded w-4/5" />
              </ClayCard>
            ))}
          </div>
        ) : error ? (
          <ClayCard level="1" className="p-8 max-w-xl mx-auto">
            <ClayErrorState
              title="Community Feed Unavailable"
              message={error}
              onRetry={loadQuestions}
            />
          </ClayCard>
        ) : !questions.length ? (
          <ClayCard level="1" className="p-8">
            <ClayEmptyState
              icon={MessageSquare}
              title="No Discussions Found"
              description="Be the first to ask a question in this category. Verified practitioners will provide certified advice."
              actionLabel="Ask a Question Now"
              onAction={() => setAskModalOpen(true)}
            />
          </ClayCard>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => {
              const hasAnswers = question.answersCount > 0;
              const authorName =
                question.author?.name ||
                question.author?.username ||
                "Community Seeker";

              return (
                <ClayCard
                  key={question._id}
                  level="1"
                  className="p-5 sm:p-6 hover:shadow-clay-card hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    {/* Top Row: Category, Author, Date, Status */}
                    <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <ClayBadge status="orange" size="xs">
                          {question.category}
                        </ClayBadge>

                        <span className="text-forest/60 font-semibold flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-forest/40" />
                          {authorName}
                        </span>

                        <span className="text-forest/40">•</span>

                        <span className="text-forest/60 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-forest/40" />
                          {formatDate(question.createdAt)}
                        </span>
                      </div>

                      {hasAnswers ? (
                        <ClayBadge status="approved" size="xs">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {question.answersCount} Practitioner Answer{question.answersCount === 1 ? "" : "s"}
                          </span>
                        </ClayBadge>
                      ) : (
                        <ClayBadge status="sand" size="xs">
                          Awaiting Answers
                        </ClayBadge>
                      )}
                    </div>

                    {/* Question Title */}
                    <Link
                      to={`/community/${question._id}`}
                      className="block group"
                    >
                      <h2 className="text-lg sm:text-xl font-bold text-forest leading-snug group-hover:text-burntOrange transition-colors">
                        {question.title}
                      </h2>
                    </Link>

                    {/* Question Snippet */}
                    <p className="text-xs sm:text-sm text-forest/80 line-clamp-2 leading-relaxed font-normal">
                      {question.content}
                    </p>

                    {/* Tags */}
                    {question.tags && question.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                        {question.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold bg-warmBeige text-forest/70 px-2 py-0.5 rounded-md border border-white/40"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Row */}
                  <div className="pt-3 border-t border-forest/10 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-forest/60 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-forest" />
                      Certified Practitioner Answers Supported
                    </span>

                    <Link to={`/community/${question._id}`}>
                      <ClayButton
                        type="button"
                        variant="beige"
                        size="sm"
                        icon={ArrowRight}
                      >
                        View Discussion
                      </ClayButton>
                    </Link>
                  </div>
                </ClayCard>
              );
            })}
          </div>
        )}
      </main>

      {/* Ask Question Modal */}
      <ClayModal
        isOpen={askModalOpen}
        onClose={() => {
          if (!submitting) setAskModalOpen(false);
        }}
        title="Ask the Wellness Community"
        subtitle="CERTIFIED ALTERNATIVE THERAPY GUIDANCE"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleAskQuestionSubmit} className="space-y-4">
          <ClayInput
            label="Question Title / Summary"
            value={questionForm.title}
            onChange={(e) =>
              setQuestionForm({ ...questionForm, title: e.target.value })
            }
            placeholder="e.g. Can acupuncture and herbal ghee help chronic lower back sciatica?"
            required
          />

          <div>
            <label className="block text-xs font-bold text-forest mb-1.5 uppercase tracking-wider">
              Relevant Category
            </label>
            <ClaySelect
              value={questionForm.category}
              onChange={(e) =>
                setQuestionForm({ ...questionForm, category: e.target.value })
              }
              options={CATEGORIES.filter((c) => c !== "All Topics").map(
                (c) => ({
                  value: c,
                  label: c,
                })
              )}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-forest mb-1.5 uppercase tracking-wider">
              Detailed Question Description
            </label>
            <ClayTextarea
              value={questionForm.content}
              onChange={(e) =>
                setQuestionForm({ ...questionForm, content: e.target.value })
              }
              placeholder="Describe your symptoms, lifestyle, past therapies tried, or specific concerns. Verified practitioners will read your case and respond with clinical suggestions."
              rows={4}
              required
            />
          </div>

          <ClayInput
            label="Tags (Optional, comma-separated)"
            value={questionForm.tags}
            onChange={(e) =>
              setQuestionForm({ ...questionForm, tags: e.target.value })
            }
            placeholder="e.g. sciatica, acupuncture, dosha-imbalance"
          />

          <div className="pt-3 border-t border-forest/10 flex gap-3">
            <ClayButton
              type="button"
              variant="beige"
              size="md"
              fullWidth
              disabled={submitting}
              onClick={() => setAskModalOpen(false)}
            >
              Cancel
            </ClayButton>

            <ClayButton
              type="submit"
              variant="forest"
              size="md"
              fullWidth
              loading={submitting}
            >
              Post Question
            </ClayButton>
          </div>
        </form>
      </ClayModal>
    </div>
  );
}
