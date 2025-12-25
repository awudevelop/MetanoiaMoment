/**
 * JSON-LD Structured Data Component
 * Injects schema.org structured data into the page for SEO.
 */

interface JsonLdProps {
  data: object | object[]
}

export function JsonLd({ data }: JsonLdProps) {
  const jsonLdData = Array.isArray(data) ? data : [data]

  return (
    <>
      {jsonLdData.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}
