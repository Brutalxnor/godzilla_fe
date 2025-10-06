// components/shared/PostCard.tsx
import Image from "next/image";

export type PostCardProps = {
  author: { name: string; role?: "Coach" | "Athlete"; avatar?: string };
  timeAgo: string;
  content: string;
  image?: string;
  stats?: { likes: number; comments: number; shares: number };
};

export default function PostCard({
  author,
  timeAgo,
  content,
  image,
  stats = { likes: 0, comments: 0, shares: 0 },
}: PostCardProps) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {author.avatar ? (
            <Image
              src={author.avatar}
              alt={author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 grid place-items-center text-xs font-semibold text-gray-700">
              {author.name
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm sm:text-[15px]">
                {author.name}
              </span>
              {author.role && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  {author.role}
                </span>
              )}
              <span className="text-[11px] text-rose-500">↗</span>
            </div>
            <div className="text-xs text-gray-500">{timeAgo}</div>
          </div>
        </div>

        <button
          type="button"
          className="text-gray-400 hover:text-gray-600"
          aria-label="More"
        >
          •••
        </button>
      </div>

      {/* Body */}
      <div className="mt-3 text-sm text-gray-800 whitespace-pre-line">
        {content}
      </div>

      {image && (
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
          <Image
            src={image}
            alt="post image"
            width={1200}
            height={800}
            className="w-full h-64 sm:h-72 object-cover"
          />
        </div>
      )}

      {/* Footer stats */}
      <div className="mt-3 flex items-center gap-6 text-gray-500">
        <button className="inline-flex items-center gap-1.5 hover:text-rose-600 transition-colors">
          <span>❤️</span>
          <span className="text-sm">{stats.likes}</span>
        </button>
        <button className="inline-flex items-center gap-1.5 hover:text-gray-700 transition-colors">
          <span>💬</span>
          <span className="text-sm">{stats.comments}</span>
        </button>
        <button className="inline-flex items-center gap-1.5 hover:text-gray-700 transition-colors">
          <span>↗</span>
          <span className="text-sm">{stats.shares}</span>
        </button>
      </div>
    </article>
  );
}
