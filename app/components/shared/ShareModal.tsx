"use client";
import React from "react";
import { Post } from "@/app/types/type";
import { FaFacebookF, FaTimes, FaWhatsapp } from "react-icons/fa";
import { useShareModal } from "@/app/community/context/ShareModal.context";

const ShareModal = ({ message }: { message: string }) => {
  const { toggleShareModal } = useShareModal();
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={toggleShareModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors text-lg"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold mb-6 text-center">Share Post</h2>

        {/* Share Link */}
        <div className="py-4">
          <div className="mb-3">
            <h1 className="text-lg font-semibold">Share Link</h1>
          </div>

          <div className="relative">
            <input
              type="text"
              readOnly
              value={message}
              className="w-full border border-gray-300 rounded-md py-2 px-3 pr-20 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 overflow-x-auto"
            />
            <button
              onClick={() => navigator.clipboard.writeText(message)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Social Media Buttons */}
        <div>
          <div className="mb-4">
            <h1>Share to Social Media</h1>
          </div>
          <div className="flex justify-between gap-6">
            <button
              onClick={() => {
                // const message = encodeURIComponent(
                //   `https://godzilla-fe.vercel.app/community/${Posts?.id}`
                // );
                const url = `https://wa.me/?text=${message}`;
                window.open(url, "_blank");
              }}
              className="flex items-center justify-center w-1/2 h-12 cursor-pointer border border-gray-300 rounded-full hover:bg-green-100 text-green-500 transition-colors text-xl"
            >
              <FaWhatsapp />
            </button>

            <button
              onClick={() => {
                // const postUrl = encodeURIComponent(
                //   `https://godzilla-fe.vercel.app/community/${Posts?.id}`
                // );
                const url = `https://www.facebook.com/sharer/sharer.php?u=${message}`;
                window.open(url, "_blank");
              }}
              className="flex items-center justify-center w-1/2 h-12 border cursor-pointer border-gray-300 rounded-full hover:bg-blue-100 text-blue-600 transition-colors text-xl"
            >
              <FaFacebookF />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
