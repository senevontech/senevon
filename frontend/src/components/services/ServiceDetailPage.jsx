import React, { useMemo, useState } from "react";
import Header from "../Header";
import DesignRequestModal from "../UI/DesignRequestModal";

const FALLBACK_IMAGE = "/og-image.jpg";

function Stat({ label, value }) {
  return (
    <div className="border border-black/20 bg-white/45 px-3 py-2">
      <div className="text-[10px] font-black tracking-[0.22em] text-black/55">{label}</div>
      <div className="mt-1 text-[13px] font-black text-black/85">{value}</div>
    </div>
  );
}

export default function ServiceDetailPage({ service }) {
  const [activeCategorySlug, setActiveCategorySlug] = useState("");
  const [designRequestOpen, setDesignRequestOpen] = useState(false);
  const [requestContext, setRequestContext] = useState({
    serviceTitle: "",
    categoryTitle: "",
    workTitle: "",
    workCaption: "",
  });

  const activeCategory = useMemo(() => {
    return service.categories.find((cat) => cat.slug === activeCategorySlug) || null;
  }, [activeCategorySlug, service.categories]);

  const onCategoryClick = (slug) => {
    setActiveCategorySlug(slug);
  };

  const onDesignThis = (work) => {
    const category = activeCategory || service.categories[0] || null;
    setRequestContext({
      serviceTitle: service.title,
      categoryTitle: category?.title || "General",
      workTitle: work?.title || "General request",
      workCaption: work?.caption || "",
    });
    setDesignRequestOpen(true);
  };

  return (
    <section className="min-h-screen bg-[#d9d9d9] text-black">
      <Header />

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.45]
        [background-image:linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)]
        [background-size:220px_220px]"
      />

      <main className="relative mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-4 sm:py-6">
        <div className="grid grid-cols-12 gap-0 border border-black/25 bg-[#d9d9d9]">
          <section className="col-span-12 border border-black/25 bg-[#d9d9d9] px-5 py-10 sm:px-8 md:px-12">
            <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-black tracking-[0.22em] text-black/60">
              <span className="h-2 w-2 bg-[#ff5a12]" />
              SERVICE
            </div>
            <h1 className="font-[tron] text-[30px] font-black tracking-[0.08em] text-black sm:text-[50px] md:text-[74px]">
              {service.title.toUpperCase()}
            </h1>
            <p className="mt-4 max-w-[980px] text-[14px] font-semibold leading-relaxed text-black/65 sm:text-[15px]">
              {service.summary}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label="Delivery" value="Fast" />
              <Stat label="Quality" value="High" />
              <Stat label="Process" value="Structured" />
              <Stat label="Support" value="Continuous" />
            </div>
          </section>

          <section className="col-span-12 border border-black/25 bg-[#d9d9d9] p-5 sm:p-8">
            <h2 className="text-[20px] font-black tracking-[0.08em] text-black sm:text-[28px]">Service Context</h2>
            <p className="mt-4 max-w-[1100px] text-[14px] font-semibold leading-relaxed text-black/70 sm:text-[15px]">
              {service.brief}
            </p>
          </section>

          <section className="col-span-12 border border-black/25 bg-[#d9d9d9] p-5 sm:p-8">
            <h2 className="text-[20px] font-black tracking-[0.08em] text-black sm:text-[28px]">Category Explorer</h2>
            <p className="mt-2 text-[13px] font-semibold text-black/60">
              Choose a category. Its brief and 6 demo works will reveal below.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {service.categories.map((category) => {
                const active = activeCategorySlug === category.slug;
                return (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => onCategoryClick(category.slug)}
                    className={[
                      "text-left border p-4 transition duration-300",
                      active
                        ? "border-black/35 bg-[#ff5a12] text-white shadow-[0_14px_28px_rgba(255,90,18,0.22)]"
                        : "border-black/20 bg-white/40 text-black/80 hover:-translate-y-0.5 hover:bg-white/60 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)]",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-[17px] font-black">{category.title}</h3>
                      <span className={active ? "h-2.5 w-2.5 bg-white" : "h-2.5 w-2.5 bg-[#ff5a12]"} />
                    </div>
                    <p className={active ? "mt-2 text-[12px] font-semibold text-white/85" : "mt-2 text-[12px] font-semibold text-black/60"}>
                      Click to reveal demos
                    </p>
                  </button>
                );
              })}
            </div>

            {activeCategory ? (
              <div className="mt-6 border border-black/20 bg-white/35 p-4 sm:p-5">
                <h3 className="text-[20px] font-black text-black/85">{activeCategory.title}</h3>
                <p className="mt-2 max-w-[980px] text-[13px] font-semibold leading-relaxed text-black/65">
                  {activeCategory.brief}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {activeCategory.works.map((work) => (
                    <article
                      key={work.title}
                      className="group border border-black/20 bg-white/45 p-3 transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(0,0,0,0.08)]"
                    >
                      <div className="relative h-[190px] overflow-hidden border border-black/15 bg-white/70">
                        <img
                          src={work.image}
                          alt={work.title}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            if (e.currentTarget.src !== FALLBACK_IMAGE) {
                              e.currentTarget.src = FALLBACK_IMAGE;
                            }
                          }}
                          className="h-full w-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-110"
                        />
                      </div>
                      <h4 className="mt-3 text-[15px] font-black text-black/80">{work.title}</h4>
                      <p className="mt-1 text-[12px] font-semibold text-black/60">{work.caption}</p>
                      <button
                        type="button"
                        onClick={() => onDesignThis(work)}
                        className="mt-3 inline-flex items-center bg-[#ff5a12] px-3 py-2 text-[11px] font-black tracking-[0.16em] text-white transition hover:brightness-105"
                      >
                        DESIGN THIS
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 border border-dashed border-black/25 bg-white/25 px-4 py-5 text-[13px] font-semibold text-black/60">
                Select a category card to reveal brief and demo works.
              </div>
            )}
          </section>

        </div>
      </main>
      <DesignRequestModal
        open={designRequestOpen}
        onClose={() => setDesignRequestOpen(false)}
        context={requestContext}
      />
    </section>
  );
}
