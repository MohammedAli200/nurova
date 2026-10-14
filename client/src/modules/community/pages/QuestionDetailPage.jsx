import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  User,
  Stethoscope,
  Send,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import UserNavbar from "../../../components/layout/UserNavbar";
import ClayCard from "../../../components/ui/ClayCard";
import ClayButton from "../../../components/ui/ClayButton";
import ClayBadge from "../../../components/ui/ClayBadge";
import ClayTextarea from "../../../components/ui/ClayTextarea";
import ClaySkeleton from "../../../components/ui/ClaySkeleton";
import ClayEmptyState from "../../../components/ui/ClayEmptyState";
import ClayErrorState from "../../../components/ui/ClayErrorState";
import { useToast } from "../../../contexts/ToastContext";
import { useAuth } from "../../../contexts/AuthContext";

import {
  getQuestionById,
  getAnswersForQuestion,
  addAnswer,
} from "../services/communityService";

export default function QuestionDetailPage() {
  const { id } = useParams();
  const toast = useToast();
  const { user } = useAuth();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Practitioner Answer Submission State
  const [answerContent, setAnswerContent] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  const isPractitioner = user?.role === "practitioner";

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [qRes, aRes] = await Promise.all([
        getQuestionById(id),
        getAnswersForQuestion(id),
      ]);

      setQuestion(qRes.data);
      setAnswers(aRes.data || []);
    } catch (err) {
      console.error("Failed to load question details:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load this discussion. It may have been removed."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    if (!answerContent.trim() || answerContent.trim().length < 5) {
      toast.error(
        "Please provide a helpful clinical answer (at least 5 characters).",
        "Validation Error"
      );
      return;
    }

    try {
      setSubmittingAnswer(true);
      const res = await addAnswer(id, answerContent.trim());

      toast.success(
        "Your practitioner answer has been published!",
        "Answer Added"
      );

      // Append new answer immediately
      setAnswers((prev) => [...prev, res.data]);
      setQuestion((prev) =>
        prev
          ? {
              ...prev,
              answersCount: (prev.answersCount || 0) + 1,
              status: "answered",
            }
          : prev
      );
      setAnswerContent("");
    } catch (err) {
      console.error("Failed to submit answer:", err);
      toast.error(
        err.response?.data?.message || "Failed to submit practitioner answer.",
        "Submission Error"
      );
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand font-georama pb-16">
        <UserNavbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
          <ClaySkeleton className="h-40 w-full rounded-3xl" />
          <ClaySkeleton className="h-64 w-full rounded-3xl" />
        </main>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen bg-sand font-georama pb-16">
        <UserNavbar />
        <main className="max-w-2xl mx-auto px-4 pt-12">
          <ClayErrorState
            title="Discussion Not Found"
            message={error || "This question is not available."}
            onRetry={loadData}
          />
          <div className="mt-4 text-center">
            <Link to="/community">
              <ClayButton variant="beige" size="sm">
                Back to All Discussions
              </ClayButton>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const authorName =
    question.author?.name || question.author?.username || "Community Seeker";

  return (
    <div className="min-h-screen bg-sand font-georama pb-16">
      <UserNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Back Link */}
        <div>
          <Link
            to="/community"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-forest/70 hover:text-burntOrange transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Community Discussions</span>
          </Link>
        </div>

        {/* Question Hero Card */}
        <ClayCard level="2" className="p-6 sm:p-8 space-y-4 border border-white/80">
          <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <ClayBadge status="orange" size="xs">
                {question.category}
              </ClayBadge>

              <span className="text-forest/60 font-semibold flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-forest/40" />
                Asked by {authorName}
              </span>

              <span className="text-forest/40">•</span>

              <span className="text-forest/60 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-forest/40" />
                {formatDate(question.createdAt)}
              </span>
            </div>

            <ClayBadge
              status={answers.length > 0 ? "approved" : "sand"}
              size="xs"
            >
              {answers.length} Practitioner Answer{answers.length === 1 ? "" : "s"}
            </ClayBadge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest leading-tight">
            {question.title}
          </h1>

          <p className="text-sm sm:text-base text-forest/85 leading-relaxed font-normal whitespace-pre-line">
            {question.content}
          </p>

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="pt-2 flex items-center gap-1.5 flex-wrap">
              {question.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-bold bg-warmBeige text-forest/70 px-2.5 py-0.5 rounded-lg border border-white/40"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </ClayCard>

        {/* Practitioner Answers Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between ml-1">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-forest" />
              <h2 className="text-lg sm:text-xl font-bold text-forest">
                Practitioner Answers & Guidance
              </h2>
            </div>
            <span className="text-xs font-bold text-burntOrange">
              ({answers.length} Clinical Response{answers.length === 1 ? "" : "s"})
            </span>
          </div>

          {!answers.length ? (
            <ClayCard level="1" className="p-8 text-center">
              <ClayEmptyState
                icon={MessageSquare}
                title="Awaiting Practitioner Responses"
                description="No verified practitioners have answered this question yet. If you are a certified practitioner, you can submit clinical advice below."
              />
            </ClayCard>
          ) : (
            <div className="space-y-4">
              {answers.map((answer, index) => {
                const practitioner = answer.practitioner || answer.practitionerId;
                const isVerified = Boolean(
                  practitioner?.verified ??
                    (practitioner?.approvalStatus === "approved" ||
                      practitioner?.verificationStatus === "approved" ||
                      practitioner?.isApproved)
                );

                const displayName =
                  practitioner?.displayName ||
                  (practitioner?.name
                    ? isVerified &&
                      !practitioner.name.toLowerCase().startsWith("dr.") &&
                      !practitioner.name.toLowerCase().startsWith("dr ")
                      ? `Dr. ${practitioner.name}`
                      : practitioner.name
                    : practitioner?.username || "Practitioner");

                const initial = (
                  displayName.replace(/^Dr\.\s*/i, "")[0] ||
                  displayName[0] ||
                  "P"
                ).toUpperCase();

                const avatarUrl =
                  practitioner?.profileImage ||
                  practitioner?.avatar ||
                  practitioner?.image;

                const apiBase =
                  import.meta.env.VITE_API_URL || "http://localhost:5001";
                const fullAvatar = avatarUrl
                  ? avatarUrl.startsWith("http")
                    ? avatarUrl
                    : `${apiBase}${avatarUrl}`
                  : null;

                const practitionerId =
                  practitioner?._id || practitioner?.id;

                return (
                  <ClayCard
                    key={answer._id || answer.id || index}
                    level="1"
                    className="p-5 sm:p-6 space-y-3.5 border border-white/70"
                  >
                    {/* Practitioner Header */}
                    <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-forest/10">
                      <div className="flex items-center gap-3">
                        {fullAvatar ? (
                          <img
                            src={fullAvatar}
                            alt={displayName}
                            className="w-10 h-10 rounded-2xl object-cover shadow-[2px_2px_6px_rgba(53,92,69,0.25)] border border-white/60"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-forest text-sand flex items-center justify-center font-bold text-sm shadow-[2px_2px_6px_rgba(53,92,69,0.25)]">
                            {initial}
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-forest">
                              {displayName}
                            </h3>

                            {isVerified && (
                              <ClayBadge status="approved" size="xs">
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Verified Practitioner
                                </span>
                              </ClayBadge>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs font-semibold text-burntOrange capitalize">
                            <span>
                              {practitioner?.specialization ||
                                "Alternative Therapy Specialist"}
                            </span>
                            {practitionerId && (
                              <>
                                <span className="text-forest/30">•</span>
                                <Link
                                  to={`/practitioners/${practitionerId}`}
                                  className="text-[11px] text-forest/60 hover:text-burntOrange underline underline-offset-2 transition-colors font-medium"
                                >
                                  View Profile
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs font-medium text-forest/50">
                        Answer posted {formatDate(answer.createdAt)}
                      </div>
                    </div>

                    {/* Answer Content */}
                    <div className="text-sm text-forest/85 leading-relaxed font-normal whitespace-pre-line pl-1">
                      {answer.content}
                    </div>
                  </ClayCard>
                );
              })}
            </div>
          )}
        </div>

        {/* Practitioner Response Form / Notice */}
        {isPractitioner ? (
          <ClayCard level="2" className="p-6 sm:p-8 space-y-4 border border-white/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-burntOrange" />
              <h3 className="text-lg font-bold text-forest">
                Contribute Your Clinical Insight
              </h3>
            </div>

            <p className="text-xs text-forest/70 leading-relaxed">
              As a verified holistic practitioner, your response helps guide seekers toward evidence-based alternative therapy and safe wellness practices.
            </p>

            <form onSubmit={handleAnswerSubmit} className="space-y-4">
              <ClayTextarea
                label="Your Answer / Recommendation"
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Share your diagnostic perspective, recommended therapies (e.g. specific asanas, herbs, acupuncture points, lifestyle adjustments), precautions, and consultation advice..."
                rows={5}
                required
              />

              <div className="flex justify-end">
                <ClayButton
                  type="submit"
                  variant="forest"
                  size="md"
                  icon={Send}
                  loading={submittingAnswer}
                >
                  Publish Answer
                </ClayButton>
              </div>
            </form>
          </ClayCard>
        ) : (
          <div className="p-4 rounded-2xl bg-warmBeige/70 border border-white/60 text-xs text-forest/70 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-forest flex-shrink-0" />
            <p>
              To maintain medical and therapeutic safety, community answers are provided exclusively by certified and verified practitioners on Nurova.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
