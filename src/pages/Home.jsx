import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { APP_CONFIG } from "../config";

export default function Home() {
  const userIds = Object.keys(APP_CONFIG.users);
  const [selectedUser, setSelectedUser] = useState(userIds[0]);
  const [leader, setLeader] = useState({
    name: "Loading...",
    emoji: "⏳",
    streak: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const seedDatabase = async () => {
      for (const id of userIds) {
        const userRef = doc(db, "users", id);
        const snap = await getDoc(userRef);
        if (!snap.exists())
          await setDoc(userRef, {
            total_points: 0,
            entries_dates: {},
            message: "",
          });
      }
    };
    seedDatabase();

    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      let topUser = null;
      let maxPoints = -1;
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const points = data.total_points || 0;
        if (points > maxPoints && APP_CONFIG.users[doc.id]) {
          maxPoints = points;
          topUser = {
            id: doc.id,
            name: APP_CONFIG.users[doc.id].name,
            emoji: APP_CONFIG.users[doc.id].default_emoji,
            streak: Object.keys(data.entries_dates || {}).length,
          };
        }
      });
      if (topUser) setLeader(topUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/30 bg-white/60 shadow-sm">
        <div className="flex items-center px-6 h-16 w-full max-w-7xl mx-auto justify-center">
          <span className="font-lexend text-2xl font-semibold text-primary tracking-tight">
            HabitDuel
          </span>
        </div>
      </header>
      <main className="pt-24 px-6 max-w-lg mx-auto flex flex-col gap-8 min-h-screen justify-center items-center">
        <section className="w-full">
          <div className="glass-card rounded-xl p-6 flex flex-col items-center text-center relative hover:bg-white/80">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-container rounded-full mix-blend-multiply blur-[40px] opacity-30"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary-container rounded-full mix-blend-multiply blur-[40px] opacity-30"></div>
            <div className="relative w-24 h-24 mb-4">
              <div className="w-full h-full rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center text-5xl">
                {leader.emoji}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-secondary-container text-on-secondary-container text-xs px-2 py-1 rounded-full border border-white flex items-center gap-1 shadow-sm font-semibold">
                <span className="material-symbols-outlined text-sm">
                  workspace_premium
                </span>{" "}
                #1
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-on-surface mb-1">
              {leader.name} is leading!
            </h2>
            <p className="flex items-center justify-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary">
                local_fire_department
              </span>
              <span className="text-primary font-medium text-sm drop-shadow-sm">
                {leader.streak} Day Streak
              </span>
            </p>
          </div>
        </section>
        <section className="w-full">
          <div className="glass-card rounded-xl p-2 flex justify-between relative shadow-sm">
            <div
              className={`absolute top-2 bottom-2 w-[calc(50%-12px)] bg-white rounded-lg shadow-sm transition-transform duration-300 ease-in-out ${selectedUser === userIds[0] ? "translate-x-0 left-2" : "translate-x-full ml-2"}`}
            ></div>
            {userIds.map((id) => (
              <button
                key={id}
                onClick={() => setSelectedUser(id)}
                className={`relative z-10 flex-1 py-3 text-sm font-medium rounded-lg transition-colors ${selectedUser === id ? "text-primary" : "text-on-surface-variant"}`}
              >
                {APP_CONFIG.users[id].name}
              </button>
            ))}
          </div>
        </section>
        <section className="w-full flex justify-center mt-4">
          <button
            onClick={() => navigate(`/arena/${selectedUser}`)}
            className="bg-primary text-on-primary font-medium px-10 py-4 rounded-full shadow-lg hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-2 pulse-btn"
          >
            <span>Enter Arena</span>
            <span className="material-symbols-outlined text-lg">
              arrow_forward
            </span>
          </button>
        </section>
      </main>
    </>
  );
}
