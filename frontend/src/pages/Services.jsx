import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { SERVICE_ITEMS } from "../data/servicesCatalog";

export default function ServicesHubPage() {
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
          <section className="col-span-12 border border-black/25 px-5 py-10 sm:px-8 md:px-12">
            <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-black tracking-[0.22em] text-black/60">
              <span className="h-2 w-2 bg-[#ff5a12]" />
              SERVICES
            </div>
            <h1 className="font-[tron] text-[32px] font-black tracking-[0.08em] text-black sm:text-[50px] md:text-[74px]">
              SERVICE CATEGORIES
            </h1>
            <p className="mt-4 max-w-[980px] text-[14px] font-semibold leading-relaxed text-black/65 sm:text-[15px]">
              Choose one category to explore details, case works, and submit a dedicated requirement.
            </p>
          </section>

          {SERVICE_ITEMS.map((service) => (
            <article
              key={service.slug}
              className="group col-span-12 border border-black/25 bg-[#d9d9d9] p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(0,0,0,0.08)] sm:col-span-4 sm:p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[22px] font-black text-black/85">{service.title}</h2>
                <span className="h-3 w-3 bg-[#ff5a12]" />
              </div>
              <p className="text-[13px] font-semibold leading-relaxed text-black/65">{service.summary}</p>

              <div className="mt-5 h-[180px] overflow-hidden border border-black/20 bg-white/50">
                <img
                  src={service.categories[0].works[0].image}
                  alt={service.categories[0].works[0].title}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    if (e.currentTarget.src !== window.location.origin + "/og-image.jpg") {
                      e.currentTarget.src = "/og-image.jpg";
                    }
                  }}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-110"
                />
              </div>

              <Link
                to={`/services/${service.slug}`}
                className="mt-5 inline-flex items-center bg-[#ff5a12] px-4 py-2 text-[11px] font-black tracking-[0.2em] text-white transition hover:brightness-105"
              >
                OPEN SERVICE →
              </Link>
            </article>
          ))}
        </div>
      </main>
    </section>
  );
}
