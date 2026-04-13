import Image from "next/image";

const ARTICLES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070&auto=format&fit=crop",
    date: "Oct 12, 2023",
    category: "Interiors",
    title: "Minimalism in the Modern Home",
    excerpt:
      "Exploring the balance between functionality and aesthetic in contemporary living spaces, emphasizing clutter-free environments.",
    delay: "",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1987&auto=format&fit=crop",
    date: "Sep 28, 2023",
    category: "Design",
    title: "The Art of Lighting",
    excerpt:
      "How proper lighting transforms the mood and utility of a room instantly, creating warmth and depth in any space.",
    delay: "delay-100",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=2070&auto=format&fit=crop",
    date: "Sep 15, 2023",
    category: "Studio",
    title: "Meet the Makers",
    excerpt:
      "A behind-the-scenes look at the artisans crafting our ceramic collection using traditional techniques handed down for generations.",
    delay: "delay-200",
  },
];

export default function Journal() {
  return (
    <section className="w-full py-20 lg:py-32 scroll-mt-20" id="journal">
      <div className="max-w-[1440px] mx-auto px-6">
        <h2 className="text-3xl font-medium tracking-tighter mb-12 reveal">
          The Journal
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <article
              key={article.id}
              className={`group cursor-pointer reveal ${article.delay}`}
            >
              <div className="overflow-hidden rounded-xl mb-5 aspect-[16/10] bg-neutral-100 relative">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-2.5 uppercase tracking-wide">
                <span>{article.date}</span>
                <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                <span>{article.category}</span>
              </div>
              <h3 className="text-xl font-medium tracking-tight mb-2 group-hover:underline decoration-1 underline-offset-4">
                {article.title}
              </h3>
              <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
