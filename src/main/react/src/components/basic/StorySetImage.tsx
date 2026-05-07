interface StorySetImageProps {
  image: string
  alt?: string
  link?: string
  text?: string
  imgClassName?: string
}

function StorySetImage({ image, alt, link, text, imgClassName }: StorySetImageProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <img src={image} alt={alt} className={`max-h-120 ${imgClassName}`} />
      <a className="text-3xs text-gray/50 dark:text-gray-dark/50" href={link} target="_blank">
        {text}
      </a>
    </div>
  )
}

export default StorySetImage
