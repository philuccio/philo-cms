'use client'

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface GalleryImage {
  src: string
  width: number
  height: number
  alt: string
}

export function ProjectGallery({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState(-1)

  if (images.length === 0) return null

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            images.length === 1 ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {images.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setIndex(i)}
            style={{
              padding: 0,
              border: 'none',
              background: 'none',
              cursor: 'zoom-in',
              borderRadius: '0.375rem',
              overflow: 'hidden',
              aspectRatio: images.length === 1 ? '16/9' : '4/3',
              display: 'block',
            }}
            aria-label={`Apri immagine: ${img.alt}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s',
              }}
              onMouseEnter={(e) => ((e.target as HTMLImageElement).style.transform = 'scale(1.04)')}
              onMouseLeave={(e) => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={images}
        styles={{ container: { backgroundColor: 'rgba(0,0,0,0.97)' } }}
      />
    </>
  )
}
