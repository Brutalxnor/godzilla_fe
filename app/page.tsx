"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  ShieldCheck,
  Users,
  Sparkles,
  Quote,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import { useState, type JSX, type ReactNode } from "react";

/* ----------------------------- types ----------------------------- */

type FeatureCard = {
  id: number;
  title: string;
  description: string;
  icon: ReactNode; // ⭐ UPDATED (no React. prefix, proper type)
};

type Testimonial = {
  id: number;
  name: string;
  role: string;
  text: string;
  avatarSrc: string;
};

type HighlightStat = {
  id: number;
  label: string;
  value: string;
};

/* ----------------------------- data ----------------------------- */

const featureCards: FeatureCard[] = [
  {
    id: 1,
    title: "Share, Motivate, Inspire.",
    description:
      "Follow top coaches and athletes, share your workouts, and stay accountable with a supportive community.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    id: 2,
    title: "Professional Training",
    description:
      "Access structured programs tailored to your goals, from fat loss to muscle building and performance.",
    icon: <Dumbbell className="h-6 w-6" />,
  },
  {
    id: 3,
    title: "Simple, Secure, Seamless",
    description:
      "Train, track, and pay all in one platform with secure payments and smooth user experience.",
    icon: <ShieldCheck className="h-6 w-6" />,
  },
  {
    id: 4,
    title: "Train. Earn. Achieve.",
    description:
      "Turn your passion for fitness into a scalable income stream with online coaching and programs.",
    icon: <Sparkles className="h-6 w-6" />,
  },
];

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ahmed K.",
    role: "Online Athlete",
    text: "Within just one week, I started seeing visible results and finally had structure in my training.",
    avatarSrc: "/images/testimonials/athlete-1.png",
  },
  {
    id: 2,
    name: "Coach Lina",
    role: "Online Coach",
    text: "Godzilla helped me turn my offline clients into a global online business in months.",
    avatarSrc: "/images/testimonials/coach-1.png",
  },
  {
    id: 3,
    name: "Omar R.",
    role: "Hybrid Athlete",
    text: "Tracking my progress and staying accountable became 10x easier with the app.",
    avatarSrc: "/images/testimonials/athlete-2.png",
  },
];

const highlightStats: HighlightStat[] = [
  { id: 1, label: "COACHES", value: "100+" },
  { id: 2, label: "ATHLETES", value: "5K+" },
  { id: 3, label: "PROGRAMS", value: "250+" },
];

/* ----------------------------- page ----------------------------- */

export default function GodzillaLandingPage(): JSX.Element {
  const [activeTestimonial, setActiveTestimonial] = useState<number>(0);
  const [navOpen, setNavOpen] = useState(false); // ⭐ NEW: mobile nav state

  const currentTestimonial: Testimonial = testimonials[activeTestimonial];

  const goNext = (): void => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const goPrev = (): void => {
    setActiveTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const setByIndex = (index: number): void => {
    setActiveTestimonial(index);
  };

  function extractTextFromHTML(html: string) {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }

  useEffect(() => {
    if (userDB?.data?.user_id) fetchUsers();
  }, [userDB?.data?.user_id]);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await GetUserById(sender_id as string);
    };

    if (sender_id) fetchUser();
  }, [sender_id]);

  useEffect(() => {
    if (!userDB?.data?.user_id) return;

    const fetchConversations = async () => {
      try {
        const res = await fetch(
          "https://godzilla-be.vercel.app/api/v1/chat/conversations",
          {
            headers: { Authorization: `Bearer ${userDB?.data.access_token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch conversations");

        const data = await res.json();
        const convIds = data.data.map((conv: { id: string }) => conv.id);
        setConversations(convIds);
      } catch (err) {
        console.error("Failed to fetch conversations", err);
        // toast.error("Failed to load conversations");
      }
    };

    fetchConversations();
  }, [userDB?.data?.user_id, userDB?.data.access_token]);

  useEffect(() => {
    if (conversations.length === 0 || !userDB?.data?.user_id) return;

    channelsRef.current.forEach((channel) => supabase.removeChannel(channel));
    channelsRef.current = [];

    conversations.forEach((convId) => {
      const channel = supabase
        .channel(`chat-${convId}`)
        .on("broadcast", { event: "new-message" }, (payload) => {
          const newMessage = payload.payload as ChatMessage;
          if (newMessage.sender_id === userDB?.data?.user_id) return;

          setSenderId(newMessage.sender_id);
          const sender = activeUsers.find((u) => u.id === newMessage.sender_id);
          if (sender) {
            setNotification({ user: sender, message: newMessage });
            setTimeout(() => setNotification(null), 3000);
          }

          setChats((prev) => {
            const key = newMessage.sender_id;
            const list = prev[key] || [];
            if (list.some((m) => m.id === newMessage.id)) return prev;
            console.log(newMessage, "ahjdgajs");

            return { ...prev, [key]: [...list, newMessage] };
          });
        })
        .subscribe();

      channelsRef.current.push(channel);
    });

    return () => {
      channelsRef.current.forEach((channel) => supabase.removeChannel(channel));
      channelsRef.current = [];
    };
  }, [conversations, userDB?.data?.user_id, activeUsers]);

  const role =
    (userDB?.data?.user?.user_type as string | undefined)?.toLowerCase() ??
    "athlete";
  const userId = userDB?.data?.user_id;

  useEffect(() => {
    if (!userId) return;

    const fetchPrograms = async () => {
      try {
        setIsLoading(true);

        if (role === "coach") {
          // ---------- COACH: programs created by this coach ----------
          const list = await GetProgramsByCoachId(userId as string | number);

          const mapped: DashboardProgram[] = Array.isArray(list)
            ? list.filter(isProgramFromAPI).map((p) => ({
                id: p.id,
                title: p.title,
                coachName: userDB?.data?.user.first_name ?? "Coach",
              }))
            : [];

          setPrograms(mapped);
        } else {
          // ---------- ATHLETE: programs this athlete is subscribed to ----------
          // use same base URL you use in /programs page
          const response = await axios.get(
            `https://godzilla-be.vercel.app/api/v1/subscripe/${userId}`
          );

          type Row = {
            id?: string | number;
            program_id?: string | number;
            programs?: {
              id?: string | number;
              title?: string;
              coach_id?: string | number;
              cover_image_url?: string | null;
              users?: { first_name?: string | null } | null; // coach
            } | null;
            users?: { first_name?: string | null } | null; // athlete
          };

          const raw = response.data?.data as Row[] | undefined;

          const mapped: DashboardProgram[] = Array.isArray(raw)
            ? raw.map((row, idx) => ({
                // prefer program id, fall back to program_id or subscription id
                id: row.programs?.id ?? row.program_id ?? row.id ?? `${idx}`,
                // REAL program title from programs
                title: row.programs?.title ?? "Program",
                // COACH name from programs.users.first_name
                coachName: row.programs?.users?.first_name ?? "Coach",
              }))
            : [];

          setPrograms(mapped);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          // if backend returns 404 when no subs, just show empty state
          if (err.response?.status === 404) {
            setPrograms([]);
          } else {
            console.error(
              "❌ Axios error fetching programs:",
              err.response?.data || err.message
            );
          }
        } else if (err instanceof Error) {
          console.error("❌ Error fetching programs:", err.message);
        } else {
          console.error("❌ Unknown error:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPrograms();
  }, [userId, role, userDB?.data?.user.first_name]);


  return (
    <div className="min-h-screen bg-[#f4f6ff] text-slate-900">
      {/* ----------------------- HERO ----------------------- */}
      {/* ----------------------- HERO ----------------------- */}
      <header className="relative isolate overflow-hidden bg-black/70 min-h-[620px] md:h-[50vh]">
        {/* background image */}
        <div className="absolute inset-0 -z-10">
          <img
            src="landing.png"
            alt="Athlete training"
            className="h-full w-full object-cover object-[50%_70%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/80" />
        </div>

        {/* TOP BAR WRAPPER */}
        <div className="mx-auto w-full max-w-7xl px-4 pt-4 relative z-30">
          {/* main nav pill */}
          <nav className="flex items-center justify-between rounded-full border border-white/20 bg-white/5 px-4 py-3 backdrop-blur-md">
            {/* logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 font-semibold">
                GZ
              </div>
              <span className="hidden text-[18px] font-semibold text-white/80 sm:inline">
                Godzilla
              </span>
            </div>

            {/* desktop links */}
            <div className="hidden items-center gap-6 text-sm text-white/75 lg:flex">
              <Link href="#about" className="hover:text-white text-[18px] transition">
                About
              </Link>
              <Link
                href="#features"
                className="hover:text-white text-[18px] transition"
              >
                Features
              </Link>
              <Link
                href="#coaches"
                className="hover:text-white text-[18px] transition"
              >
                Coaches
              </Link>
              <Link
                href="/home"
                className="hover:text-white text-[18px] transition"
              >
                home
              </Link>
              <Link
                href="#app"
                className="hover:text-white text-[18px] transition"
              >
                App
              </Link>
            </div>

            {/* actions + burger */}
            <div className="flex items-center gap-2">
              {/* desktop CTA */}
              <button className="hidden rounded-full border border-white/30 cursor-pointer text-[14px] bg-white/10 px-4 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur hover:bg-white/20 lg:inline-flex">
                Download App
              </button>

              <button className="rounded-full bg-white px-4 py-1.5 cursor-pointer text-[14px] text-xs font-semibold text-red-500 shadow-sm hover:bg-slate-100">
                Sign In
              </button>

              {/* burger for mobile / tablet */}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-white/10 p-2 text-white lg:hidden"
                aria-label="Toggle navigation"
                onClick={() => setNavOpen((open) => !open)}
              >
                {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>
        </div>

        {/* MOBILE OVERLAY MENU */}
        {navOpen && (
          <div className="fixed inset-0 z-20 bg-black/70 lg:hidden">
            <div className="mx-auto mt-20 w-full max-w-7xl px-4">
              <div className="rounded-2xl border border-white/15 bg-black/90 px-6 py-5 text-white/90 backdrop-blur">
                <div className="flex flex-col gap-3 text-[16px]">
                  <Link
                    href="#about"
                    onClick={() => setNavOpen(false)}
                    className="py-1 hover:text-white"
                  >
                    About
                  </Link>
                  <Link
                    href="#features"
                    onClick={() => setNavOpen(false)}
                    className="py-1 hover:text-white"
                  >
                    Features
                  </Link>
                  <Link
                    href="#coaches"
                    onClick={() => setNavOpen(false)}
                    className="py-1 hover:text-white"
                  >
                    Coaches
                  </Link>
                  <Link
                    href="/home"
                    onClick={() => setNavOpen(false)}
                    className="py-1 hover:text-white"
                  >
                    home
                  </Link>
                  <Link
                    href="#app"
                    onClick={() => setNavOpen(false)}
                    className="py-1 hover:text-white"
                  >
                    App
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HERO CONTENT */}
        <section className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-16 pb-28 text-center">
          <p className="mb-4 inline-flex items-center rounded-full bg-white/10 px-5 py-1 text-[11px] font-medium text-white/80 backdrop-blur">
            New · All-in-one platform for coaches &amp; athletes
          </p>

          <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-[40px]">
            Unleash Your Fitness Journey with{" "}
            <span className="text-red-400">Godzilla</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm text-white/80 sm:text-base">
            A platform built to connect coaches and athletes and give everyone a
            structured, motivating, and measurable fitness experience from day
            one.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button className="inline-flex items-center gap-2 cursor-pointer rounded-full bg-red-500 px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-red-500/40 hover:bg-red-600">
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="rounded-full border cursor-pointer border-white/40 bg-black/30 px-6 py-2.5 text-xs font-semibold text-white backdrop-blur hover:bg-white/10">
              Explore Programs
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-10 text-[11px] text-white/80 sm:text-xs">
            {highlightStats.map((stat) => (
              <div key={stat.id} className="flex flex-col items-center">
                <span className="text-sm font-semibold text-white">
                  {stat.value}
                </span>
                <span className="tracking-[0.18em]">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      </header>


      {/* ----------------------- "WHAT IS" SECTION ----------------------- */}
      <section
        id="about"
        className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-4 py-20 lg:flex-row lg:px-8"
      >
        {/* left text */}
        <div className="flex-1 max-w-xl space-y-5">
          <h2 className="text-[50px] font-semibold leading-[1.25] text-slate-900">
            What is <span className="text-red-500">Godzilla?</span>
          </h2>

          <p className="text-[20px] leading-relaxed text-slate-600">
            Godzilla is a next-generation fitness app that brings together
            coaches and athletes in one dynamic platform. With Godzilla, you
            can:
          </p>

          <ul className="mt-2 space-y-2 text-[20px] text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-[2px] h-4 w-4 flex-shrink-0 text-red-500" />
              <span>Discover custom training programs for your goals.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-[2px] h-4 w-4 flex-shrink-0 text-red-500" />
              <span>Connect directly with certified coaches.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-[2px] h-4 w-4 flex-shrink-0 text-red-500" />
              <span>
                Share your achievements with a supportive fitness community.
              </span>
            </li>
          </ul>

          <button
            type="button"
            className="mt-4 inline-flex items-center cursor-pointer gap-1 text-[14px] font-semibold text-red-500 hover:text-red-600"
          >
            <span>See how Godzilla transforms the way you train.</span>
            <span aria-hidden>→</span>
          </button>
        </div>

        {/* right image */}
        <div className="flex flex-1 justify-center lg:justify-end">
          <div className="relative">
            <img
              src="4ddde8a8ce300c8eddd6337703cbdbc242df8e3a.png"
              alt="Athlete stretching"
              className="h-auto w-full max-w-[490px] object-contain drop-shadow-[0_30px_60px_rgba(15,23,42,0.3)] "
            />
            <img
              src="4ddde8a8ce300c8eddd6337703cbdbc242df8e3a.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 -translate-x-5 opacity-15 blur-[1px] "
            />
          </div>
        </div>
      </section>

      {/* ----------------------- FEATURES GRID ----------------------- */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-[44px] font-semibold leading-tight text-slate-900 sm:text-[26px]">
              Everything You Need to Level Up — All in{" "}
              <span className="text-red-500">One Place</span>
            </h2>
            <p className="mt-3 text-[34px] leading-relaxed text-slate-600 sm:text-[15px]">
              Godzilla brings your entire fitness world together. Train,
              connect, and grow inside one smart platform made for athletes and
              coaches alike.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((feature) => (
              <div
                key={feature.id}
                className="flex h-full flex-col gap-3 rounded-[24px] bg-white px-7 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  {feature.icon}
                </div>
                <h3 className="text-[15px] font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative w-full bg-[#F7F8FF] py-28 overflow-hidden">
        {/* LEFT IMAGE — desktop */}
        <div className="hidden lg:block absolute left-0 top-0">
          <img
            src="8f3cceb6c00884ff29ce68a33ade48666895e1ad.png"
            className="
        relative z-10 
        w-[520px] 
        -rotate-9 
        drop-shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        object-contain
      "
          />

          <img
            src="8f3cceb6c00884ff29ce68a33ade48666895e1ad.png"
            className="
        absolute top-0 left-6
        w-[520px]
        -rotate-6 
        opacity-20 
        blur-[2px]
      "
            aria-hidden="true"
          />
        </div>

        {/* RIGHT IMAGE — desktop */}
        <div className="hidden lg:block absolute right-0 top-4">
          <img
            src="4744ceaa4dac2c594c0d1e586a750b81f8bdb6a1.png"
            className="
        relative z-10 
        w-[560px] 
        rotate-7
        drop-shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        object-contain
      "
          />

          <img
            src="4744ceaa4dac2c594c0d1e586a750b81f8bdb6a1.png"
            className="
        absolute top-0 right-6
        w-[560px]
        rotate-6
        opacity-20 
        blur-[2px]
      "
            aria-hidden="true"
          />
        </div>

        {/* CENTER CONTENT */}
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[48px] font-semibold leading-tight text-slate-900">
            Build <span className="text-red-500">Your Body.</span> Own{" "}
            <span className="text-red-500">Your Progress.</span>
          </h2>

          <p className="mt-6 text-[20px] text-slate-600 leading-relaxed">
            Join an active fitness community, find your ideal coach, and start
            following professional programs tailored to your goals.
          </p>

          <ul className="mt-6 space-y-3 text-[18px] text-slate-700">
            <li>• Expert programs for every level.</li>
            <li>• Direct connection with certified coaches.</li>
            <li>• Track your achievements day by day.</li>
          </ul>
        </div>

        {/* MOBILE IMAGES — side by side on mobile */}
        <div className="mt-16 flex flex-row items-center justify-center gap-4 lg:hidden">
          <img
            src="8f3cceb6c00884ff29ce68a33ade48666895e1ad.png"
            className="w-[45%] max-w-[180px] object-contain -rotate-6"
          />

          <img
            src="4744ceaa4dac2c594c0d1e586a750b81f8bdb6a1.png"
            className="w-[45%] max-w-[380px] object-contain rotate-6"
          />
        </div>
      </section>

      {/* ----------------------- PASSION INTO IMPACT ----------------------- */}
      <section className="bg-white py-16">
  <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 md:gap-16 lg:flex-row lg:items-center lg:px-0">
    {/* TEXT */}
    <div className="flex-1 space-y-4 text-center lg:text-left">
      <h2 className="text-xs md:text-sm font-semibold uppercase tracking-[0.32em] text-red-500">
        Turn Your Passion into Impact and Income
      </h2>

      <h3 className="text-2xl md:text-[32px] lg:text-[36px] font-semibold leading-snug text-slate-900">
        Grow your coaching business with built-in tools for scale.
      </h3>

      <p className="text-sm md:text-base lg:text-lg leading-relaxed text-slate-600">
        Godzilla makes it easy to package your knowledge into programs, onboard
        new clients, and manage monthly subscriptions — all in one place.
      </p>

      <ul className="mt-4 space-y-2 text-sm md:text-[16px] leading-relaxed text-slate-700 text-center lg:text-center">
        <li>• Offer 1:1, group, or self-paced programs.</li>
        <li>• Collect payments securely and track subscriptions.</li>
        <li>• Deliver updates, videos, and resources instantly.</li>
      </ul>
    </div>

    {/* IMAGE */}
    <div className="flex flex-1 justify-center lg:justify-end w-full">
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[480px]">
        <img
          src="179f6c24c41c3334a553f4e1898ef4352193bb56.png"
          alt="Coaches on Godzilla"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  </div>
</section>


      {/* ----------------------- TESTIMONIALS ----------------------- */}
      <section id="testimonials" className="bg-[#f4f6ff] py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-0">
          <div className="relative overflow-hidden rounded-[32px] bg-white px-6 py-10 shadow-[0_32px_80px_rgba(15,23,42,0.12)] sm:px-10 sm:py-12">
            <h2 className="mb-10 text-center text-[24px] font-semibold leading-tight text-slate-900 sm:text-[28px]">
              What Our <span className="text-red-500">Clients Say</span> About Us
            </h2>

            <div className="relative flex items-stretch gap-6">
              <button
                aria-label="Previous testimonial"
                className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 sm:inline-flex"
                onClick={goPrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex w-full flex-1 flex-col gap-5 rounded-[24px] border border-slate-100 bg-[#f9fbff] px-6 py-6 text-left sm:px-10 sm:py-8">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-full border border-slate-200">
                    <Image
                      src={currentTestimonial.avatarSrc}
                      alt={currentTestimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-slate-900">
                      {currentTestimonial.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {currentTestimonial.role}
                    </span>
                  </div>
                </div>

                <div className="relative mt-2 rounded-2xl bg-white px-5 py-6 text-[14px] leading-relaxed text-slate-700 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                  <span className="pointer-events-none absolute -top-5 left-4 text-3xl text-red-400">
                    “
                  </span>
                  <p className="pl-4">{currentTestimonial.text}</p>
                </div>

                <div className="mt-2 flex justify-center gap-2">
                  {testimonials.map((testimonial, index) => (
                    <button
                      key={testimonial.id}
                      type="button"
                      aria-label={`Jump to testimonial ${index + 1}`}
                      onClick={(): void => setByIndex(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === activeTestimonial
                          ? "w-6 bg-red-500"
                          : "w-2.5 bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                aria-label="Next testimonial"
                className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 sm:inline-flex"
                onClick={goNext}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------- GLIMPSE INSIDE GODZILLA ---------------------- */}
      <section id="app" className="bg-[#f7f8fc] py-16 lg:py-24">
  <div className="mx-auto flex max-w-7xl flex-col items-start gap-12 px-4 lg:flex-row lg:items-center lg:gap-20 lg:px-0">
    {/* -------- LEFT TEXT -------- */}
    <div className="flex-1 space-y-6 text-center lg:text-left">
      <h2 className="text-[18px] font-semibold tracking-wide text-red-500">
        A Glimpse Inside Godzilla
      </h2>

      {/* smaller on mobile, same 42px on web (lg) */}
      <h3 className="text-3xl sm:text-[36px] lg:text-[42px] font-bold leading-[1.2] text-slate-900 lg:max-w-xl">
        Track every rep, message, and milestone — right in your pocket.
      </h3>

      <p className="text-base sm:text-[18px] leading-relaxed text-slate-600 max-w-lg mx-auto lg:mx-0">
        From workout logs to progress photos and coach messages, the Godzilla
        app keeps everything organized and ready whenever you are. No
        spreadsheets, no lost chats, no guesswork.
      </p>

      <div className="flex justify-center lg:justify-start">
        <button className="mt-4 inline-flex items-center gap-3 rounded-[14px] bg-gradient-to-r from-red-500 to-red-600 px-8 py-3 text-[16px] font-semibold text-white shadow-xl hover:opacity-95 transition">
          Download App Now
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>

    {/* -------- RIGHT PHONES -------- */}
    {/* same look on web, fixed overflow + spacing on mobile */}
    <div className="mt-8 flex flex-1 items-center justify-center relative lg:mt-0">
      <img
        src="mobleft.png"
        alt="Godzilla app screen"
        className="
          w-[230px] sm:w-[300px] lg:w-[480px]
          rotate-[-10deg]
          drop-shadow-[0_40px_70px_rgba(0,0,0,0.25)]
          relative
          z-10
          -mr-4 sm:mr-5 lg:-mr-50
        "
      />

      <img
        src="mobright.png"
        alt="Godzilla app screen"
        className="
          w-[230px] sm:w-[300px] lg:w-[480px]
          rotate-[8deg]
          drop-shadow-[0_40px_70px_rgba(0,0,0,0.25)]
          relative
          -ml-4 sm:-ml-10 lg:-ml-40
        "
      />
    </div>
  </div>
</section>


      {/* ----------------------------- FOOTER ------------------------------ */}
      <footer className="border-t border-red-200 bg-[#f7f8fc] py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-[14px] text-slate-500 sm:flex-row">
          <div className="flex gap-6">
            <button className="hover:text-slate-700 transition">
              Terms &amp; Conditions
            </button>
            <button className="hover:text-slate-700 transition">Privacy</button>
          </div>

          <p className="whitespace-nowrap">
            © {new Date().getFullYear()} Godzilla. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
