import { useState, useEffect } from "react";

interface MemePreviewProps {
  imageUrl: string;
  memeCaption?: string;
}

export default function MemePreview({ imageUrl, memeCaption }: MemePreviewProps) {
  const [topText, setTopText] = useState<string>("");
  const [bottomText, setBottomText] = useState<string>("");

  useEffect(() => {
    if (memeCaption) {
      const words = memeCaption.split(" ");
      const midIndex = Math.ceil(words.length / 2);
      setTopText(words.slice(0, midIndex).join(" "));
      setBottomText(words.slice(midIndex).join(" "));
    }
  }, [memeCaption]);

  const memeTextStyle = {
    fontFamily: "Impact, sans-serif",
    textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <img
        src={imageUrl || "/placeholder.svg"}
        alt="Meme template"
        className="w-full rounded-lg shadow-lg max-h-[40vh] mx-auto object-contain"
      />
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <input
          type="text"
          value={topText}
          onChange={(e) => setTopText(e.target.value.toUpperCase())}
          placeholder="Top text"
          aria-label="Top meme text"
          className="bg-transparent text-white text-xl md:text-2xl font-bold text-center uppercase w-full focus:outline-none hover:bg-black/10 transition-colors rounded px-2"
          style={memeTextStyle}
        />
        <input
          type="text"
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value.toUpperCase())}
          placeholder="Bottom text"
          aria-label="Bottom meme text"
          className="bg-transparent text-white text-xl md:text-2xl font-bold text-center uppercase w-full focus:outline-none hover:bg-black/10 transition-colors rounded px-2"
          style={memeTextStyle}
        />
      </div>
    </div>
  );
}
