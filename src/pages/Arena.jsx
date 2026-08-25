import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import { APP_CONFIG } from "../config";
import confetti from "canvas-confetti";
import {
  format,
  eachDayOfInterval,
  parseISO,
  isToday,
  isBefore,
} from "date-fns";

export default function Arena() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const userConfig = APP_CONFIG.users[userId];
  const opponentId = Object.keys(APP_CONFIG.users).find((id) => id !== userId);
  const opponentConfig = APP_CONFIG.users[opponentId];

  const [userData, setUserData] = useState({
    total_points: 0,
    entries_dates: {},
    message: "",
  });
  const [opponentData, setOpponentData] = useState({ message: "" });
  const [messageInput, setMessageInput] = useState("");
  const [isSent, setIsSent] = useState(false);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const hasLoggedToday = userData.entries_dates?.[todayStr] === true;
  const currentStreak = Object.keys(userData.entries_dates || {}).length;

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", userId), (docSnap) => {
      if (docSnap.exists()) setUserData(docSnap.data());
    });
    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (!opponentId) return;
    const unsubscribe = onSnapshot(doc(db, "users", opponentId), (docSnap) => {
      if (docSnap.exists()) setOpponentData(docSnap.data());
    });
    return () => unsubscribe();
  }, [opponentId]);

  const handleLogToday = async () => {
    if (hasLoggedToday) return;
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6b38d4", "#6cf8bb", "#ffddb8"],
    });
    await updateDoc(doc(db, "users", userId), {
      total_points: increment(1),
      [`entries_dates.${todayStr}`]: true,
    });
  };

  const handleSendMessage = async () => {
    if (messageInput.trim() === "") return;
    await updateDoc(doc(db, "users", userId), { message: messageInput.trim() });
    setMessageInput("");
    setIsSent(true);
    setTimeout(() => setIsSent(false), 2000);
  };

  const challengeDays = eachDayOfInterval({
    start: parseISO(APP_CONFIG.startDate),
    end: parseISO(APP_CONFIG.endDate),
  });

  return (
    <div className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low min-h-screen text-on-surface pt-20 py-6 px-4">
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl border-b border-white/30 bg-white/60 shadow-sm">
        <div className="flex items-center justify-between px-6 h-16 w-full max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/40 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-primary">
              arrow_back_ios_new
            </span>
          </button>
          <h1 className="text-xl font-semibold text-primary tracking-tight">
            HabitDuel
          </h1>
          <div className="w-10" />
        </div>
      </header>
      <main className="max-w-3xl mx-auto flex flex-col gap-8">
        <section className="mt-4 text-center">
          <h2 className="text-3xl font-semibold mb-2">
            {userConfig.challengeName}
          </h2>
          <div className="inline-flex items-center gap-2 bg-primary-fixed/50 px-4 py-1 rounded-full border border-primary/20">
            <span className="material-symbols-outlined text-primary text-sm">
              local_fire_department
            </span>
            <span className="text-sm font-medium text-primary">
              {currentStreak} Day Streak
            </span>
          </div>
          <div className="mt-4 text-5xl">{userConfig.default_emoji}</div>
        </section>
        <section className="flex justify-center">
          <button
            onClick={handleLogToday}
            disabled={hasLoggedToday}
            className={`shadow-lg active:scale-95 transition-all duration-300 px-12 py-6 rounded-3xl w-full max-w-sm flex flex-col items-center gap-2 ${hasLoggedToday ? "bg-surface-variant text-on-surface-variant" : "bg-primary text-on-primary"}`}
          >
            <span className="material-symbols-outlined text-4xl mb-1">
              {hasLoggedToday ? "task_alt" : "check_circle"}
            </span>
            <span className="text-2xl font-semibold">
              {hasLoggedToday ? "Logged Today" : "Log Today"}
            </span>
          </button>
        </section>
        <section className="glass-card rounded-3xl overflow-hidden">
          <div className="glass-panel-header px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Streak Calendar</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-7 gap-2 font-medium text-sm text-center">
              {challengeDays.map((date, idx) => {
                const dateStr = format(date, "yyyy-MM-dd");
                const isLogged = userData.entries_dates?.[dateStr];
                const today = isToday(date);
                const past = isBefore(date, new Date()) && !today;
                let cellClass =
                  "calendar-cell " +
                  (isLogged
                    ? "completed"
                    : today
                      ? "today"
                      : past
                        ? "missed"
                        : "upcoming");
                return (
                  <div key={idx} className={cellClass}>
                    {format(date, "d")}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section className="post-it rounded-2xl p-6 relative mt-4">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-400/80 rounded-full shadow-sm border border-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
          </div>
          <div className="flex justify-between items-start mb-4 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-white bg-white/40 flex items-center justify-center text-lg">
                {opponentConfig.default_emoji}
              </div>
              <div>
                <span className="font-medium text-sm text-on-secondary-fixed block">
                  Note from {opponentConfig.name}
                </span>
              </div>
            </div>
          </div>
          <p className="text-lg text-on-secondary-fixed mb-6 font-medium italic">
            "
            {opponentData.message ||
              "No messages yet. Be the first to talk trash! 🏃‍♂️💨"}
            "
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Write back..."
              className="flex-1 bg-white/40 border border-white/50 rounded-xl px-4 py-2 text-sm text-on-secondary-fixed placeholder:text-on-secondary-fixed-variant/50 focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container transition-all"
            />
            <button
              onClick={handleSendMessage}
              disabled={isSent}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors active:scale-95 shadow-sm flex items-center gap-1 ${isSent ? "bg-secondary text-on-secondary" : "bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed"}`}
            >
              {isSent ? (
                <>
                  <span className="material-symbols-outlined text-[16px]">
                    check
                  </span>{" "}
                  Sent
                </>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
