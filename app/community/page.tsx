// app/community/page.tsx
"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/shared/sidebar";
import PostCard from "./components/postCard";
import CreatePostModal, { CreatePostType } from "./components/createPost";
import { GetAllPosts } from "../sign-up/Services/posts.service";
import useGetUser from "../Hooks/useGetUser";
import { Post } from "../types/type";

function Tag({ label, count }: { label: string; count?: number }) {
  return (
    <button className="text-xs sm:text-[13px] rounded-full border border-gray-200 bg-white px-3 py-1 hover:bg-gray-50">
      #{label} {typeof count === "number" ? `(${count})` : ""}
    </button>
  );
}

export default function CommunityPage() {
  const shellVars = {
    "--sb-w": "88px",
    "--extra-left": "24px",
  } as React.CSSProperties;

  const [feedTab, setFeedTab] = useState<"trending" | "new">("trending");

  // NEW: modal open state
  const [openCreate, setOpenCreate] = useState(false);
  const [Posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // NEW: submit handler for modal
  async function handleCreateSubmit(data: CreatePostType) {
    // TODO: call your API here
    console.log("CreatePost payload:", data);
    // optionally optimistically add to feed here
  }

  const { userDB } = useGetUser();

  const fetchGetPosts = async () => {
    setLoading(true);
    try {
      const response = await GetAllPosts();
      setPosts(response);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGetPosts();
  }, [userDB?.data?.user_id]);

  // console.log(Posts);

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Sidebar />

      <main
        style={shellVars}
        className="w-full lg:w-[calc(95vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
          {/* Title + Post button */}
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">Community</h1>

            <button
              className="rounded-xl bg-rose-500 text-white text-1xl px-10 py-3 hover:bg-rose-600"
              onClick={() => setOpenCreate(true)}
            >
              + Post
            </button>
          </div>
          <div className="mt-5 h-[2px] w-full bg-gray-200 rounded-full" />

          {/* Trending topics */}
          <section className="mt-5 justify-between ">
            <h2 className="text-0xl font-bold text-gray-700 mb-5 ">
              Trending Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              <Tag label="StrengthTraining" count={234} />
              <Tag label="Nutrition" count={156} />
              <Tag label="MorningWorkout" count={89} />
            </div>
          </section>

          {/* Tabs */}
          <section className="mt-4  justify-center">
            {/* Segmented control */}
            <div className="w-full max-w-md justify-center">
              <div
                className="relative grid grid-cols-2 rounded-full bg-gray-100 p-1"
                role="tablist"
                aria-label="Feed filter"
              >
                {/* sliding white pill */}
                <span
                  className={[
                    "absolute inset-y-1 left-1 w-1/2 rounded-full bg-white shadow-sm",
                    "transition-transform duration-200 ease-out",
                    feedTab === "trending"
                      ? "translate-x-0"
                      : "translate-x-full",
                  ].join(" ")}
                  aria-hidden
                />

                {/* Trending */}
                <button
                  role="tab"
                  aria-selected={feedTab === "trending"}
                  onClick={() => setFeedTab("trending")}
                  className={[
                    "relative z-10 py-2 text-center text-sm font-semibold",
                    "transition-colors",
                    feedTab === "trending" ? "text-gray-900" : "text-gray-600",
                  ].join(" ")}
                >
                  Trending
                </button>

                {/* New */}
                <button
                  role="tab"
                  aria-selected={feedTab === "new"}
                  onClick={() => setFeedTab("new")}
                  className={[
                    "relative z-10 py-2 text-center text-sm font-semibold",
                    "transition-colors",
                    feedTab === "new" ? "text-gray-900" : "text-gray-600",
                  ].join(" ")}
                >
                  New
                </button>
              </div>
            </div>
          </section>

          {/* Feed */}
          <section className="mt-5 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                {/* أو استخدم أي loader component عندك */}
              </div>
            ) : (
              <>
                {Array.isArray(Posts) && Posts.length > 0 ? (
                  Posts.map((post) => (
                    <div key={post.id}>
                      <PostCard
                        author={{
                          name:
                            post?.users?.first_name +
                              " " +
                              post?.users?.second_name || "",
                          role: post?.users?.user_type || "Coach",
                          avatar:
                            post.users?.avatar_url ||
                            "https://example.com/images/sunset.jpg",
                        }}
                        timeAgo={post.created_at}
                        content={post.bio}
                        image={
                          post.image || "https://example.com/images/sunset.jpg"
                        }
                        stats={{ likes: 145, comments: 23, shares: 8 }}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No posts yet</p>
                )}
              </>
            )}
          </section>

          {/* bottom padding so content isn't hidden behind bottom nav on mobile */}
          <div className="pb-24 lg:pb-0" />
        </div>
      </main>

      {/* ===== Create Post Modal (mounted at page root) ===== */}
      <CreatePostModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreateSubmit}
        user={{
          name: "Youssef Tarek",
          subtitle: "Share with your community",
          // avatarUrl: "/avatar-1.jpg", // optional; show initials if missing
        }}
      />
    </div>
  );
}
