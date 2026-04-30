import HeroSection from '@/components/home/HeroSection'
import CategoriesSection from '@/components/home/CategoriesSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import BrandsSection from '@/components/home/BrandsSection'
import PromoSection from '@/components/home/PromoSection'

export default function HomePage() {
  return (
    <div className="page-enter">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <PromoSection />
      <BrandsSection />
    </div>
  )
}
