import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import CategoryCard from './CategoryCard';

const CategoryCarousel = ({ categories }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="category-carousel-wrapper pb-8">
        <Swiper
          modules={[Pagination]}
          spaceBetween={12}
          slidesPerView={2}
          pagination={{ clickable: true, el: '.swiper-pagination' }}
          breakpoints={{
            768: {
              slidesPerView: 3,
              spaceBetween: 16,
            }
          }}
          className="pb-10"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat.id}>
              <CategoryCard category={cat} />
            </SwiperSlide>
          ))}
          <div className="swiper-pagination mt-4"></div>
        </Swiper>
      </div>
    );
  }

  // Desktop Grid (1024px+)
  return (
    <div className="grid grid-cols-5 gap-4">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} />
      ))}
    </div>
  );
};

export default CategoryCarousel;
