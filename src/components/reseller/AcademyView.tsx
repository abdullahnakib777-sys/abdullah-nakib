import React, { useState, useEffect } from 'react';
import { AcademyLesson, ResellerProfile } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { triggerLevelUpCelebration } from '../common/ConfettiTrigger';
import {
  BookOpen,
  CheckCircle2,
  Award,
  Sparkles,
  Play,
  Clock,
  ArrowRight,
  X,
  Video,
  Youtube,
  ExternalLink,
} from 'lucide-react';

export const AcademyView: React.FC<{ reseller: ResellerProfile }> = ({ reseller }) => {
  const { refreshProfile } = useAuth();
  const [lessons, setLessons] = useState<AcademyLesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<AcademyLesson | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.getAcademyLessons().then((res) => {
      setLessons(res.lessons || []);
    });
  }, [reseller.id]);

  const handleCompleteLesson = async (lessonId: string) => {
    setIsSubmitting(true);
    try {
      await api.completeAcademyLesson(lessonId);
      triggerLevelUpCelebration();
      const updated = await api.getAcademyLessons();
      setLessons(updated.lessons || []);
      if (activeLesson && activeLesson.id === lessonId) {
        setActiveLesson({ ...activeLesson, isCompleted: true });
      }
      await refreshProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const completedCount = lessons.filter((l) => l.isCompleted).length;

  return (
    <div className="space-y-6" id="academy-view">
      {/* Academy Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-400" />
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-100">
              Video Masterclasses & Direct YouTube Lessons
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">MeherMart Reseller Academy</h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
            Watch battle-tested Facebook marketing, TikTok viral selling, and customer objection handling video lessons to scale your daily COD profits.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 min-w-[200px] text-center space-y-1">
          <p className="text-xs text-emerald-100 font-bold">Your Academy Progress</p>
          <p className="text-2xl font-black text-white">
            {completedCount} / {lessons.length} Completed
          </p>
          <p className="text-[11px] text-amber-300 font-semibold">+{completedCount * 150} Total XP Earned</p>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {lesson.courseTitle || lesson.category || 'Reseller Mastery'}
                </span>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> +{lesson.xpReward || 150} XP
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">{lesson.title}</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{lesson.titleBn}</p>
              </div>

              {/* YouTube Thumbnail preview */}
              {lesson.videoEmbedId && (
                <div
                  onClick={() => setActiveLesson(lesson)}
                  className="relative cursor-pointer group aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-xs"
                >
                  <img
                    src={`https://img.youtube.com/vi/${lesson.videoEmbedId}/hqdefault.jpg`}
                    alt={lesson.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90 group-hover:opacity-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition">
                    <div className="w-12 h-12 rounded-full bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition transform group-hover:scale-110">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {lesson.description || lesson.summary || lesson.content}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {lesson.durationMinutes || 10} mins video
              </span>

              {lesson.isCompleted ? (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Completed (+{lesson.xpReward} XP)
                </span>
              ) : (
                <button
                  onClick={() => setActiveLesson(lesson)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch & Earn XP</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lesson Reader & Video Player Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs" onClick={() => setActiveLesson(null)} />
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Youtube className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="font-bold text-base">{activeLesson.title}</h3>
                  <p className="text-xs text-slate-400">{activeLesson.courseTitle || 'Masterclass'}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Responsive YouTube Embed */}
              {activeLesson.videoEmbedId ? (
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg border border-slate-200">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${activeLesson.videoEmbedId}?autoplay=1&rel=0`}
                    title={activeLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : activeLesson.youtubeUrl ? (
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-900">Watch on YouTube: {activeLesson.youtubeUrl}</span>
                  <a
                    href={activeLesson.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-1"
                  >
                    <span>Open YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : null}

              <div>
                <p className="text-base font-bold text-slate-900">{activeLesson.titleBn}</p>
                <span className="text-xs text-emerald-700 font-bold">{activeLesson.durationMinutes} min video • Earn +{activeLesson.xpReward} XP</span>
              </div>

              {activeLesson.description && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                  {activeLesson.description}
                </div>
              )}

              {/* Key Takeaways */}
              {activeLesson.keyTakeaways && activeLesson.keyTakeaways.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Key Actionable Takeaways
                  </h4>
                  <div className="space-y-1.5">
                    {activeLesson.keyTakeaways.map((takeaway, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setActiveLesson(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Close
              </button>

              {!activeLesson.isCompleted ? (
                <button
                  onClick={() => handleCompleteLesson(activeLesson.id)}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Mark Complete & Claim +{activeLesson.xpReward} XP</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Lesson Completed (+{activeLesson.xpReward} XP)!
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
