import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline"

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void
  isLoading: boolean
}

export default function ImageUploader({ onImageUpload, isLoading }: ImageUploaderProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null)
      const file = acceptedFiles[0]
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit")
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        onImageUpload(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    },
    [onImageUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors max-w-full h-[70vh] flex flex-col items-center justify-center ${
        isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <input {...getInputProps()} />
      {isLoading ? (
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Uploading...</p>
        </div>
      ) : (
        <>
          <ArrowUpTrayIcon className="mx-auto h-14 w-14 text-gray-400" />
          <p className="mt-6 text-xl text-gray-600">Drag and drop your image here</p>
          <p className="mt-2 text-base text-gray-500">or click to select a file</p>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </>
      )}
    </div>
  )
}