interface MiscellaneousDataProps {
  memeTitle: string
  hashtags?: string[]
  description: string
}

export default function MiscellaneousData({
  memeTitle,
  hashtags = [],
  description,
}: MiscellaneousDataProps) {
  const processedHashtags = hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`);

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">{memeTitle}</h2>
      <div className="mb-4">
        {processedHashtags.map((tag) => (
          <span
            key={tag}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
    </div>
  )
}
