/**
 * Gadget Genie visual asset system.
 *
 * Asset specs (all WebP, studio product photography, no baked-in text):
 * - Hero desktop:  1792x608  (displayed ~3.5:1, products on the right, clean left for copy)
 * - Hero mobile:   1024x1024 (tight centred composition, copy sits below the photo)
 * - Category:      816x816   (light warm-grey seamless, light from upper left, ~65% fill)
 * - Promotion:     1280x640  (clean left half for copy, products on the right)
 */

// Hero – desktop
import heroDigitalLifeDesktop from '@/assets/banners/desktop/gadget-genie-hero-digital-life-desktop.webp';
import heroSmartphonesDesktop from '@/assets/banners/desktop/gadget-genie-hero-smartphones-desktop.webp';
import heroGamingDesktop from '@/assets/banners/desktop/gadget-genie-hero-gaming-desktop.webp';
import heroWorkDesktop from '@/assets/banners/desktop/gadget-genie-hero-work-desktop.webp';
import heroSmartHomeDesktop from '@/assets/banners/desktop/gadget-genie-hero-smart-home-desktop.webp';
import heroAudioDesktop from '@/assets/banners/desktop/gadget-genie-hero-audio-desktop.webp';
// Hero – mobile
import heroDigitalLifeMobile from '@/assets/banners/mobile/gadget-genie-hero-digital-life-mobile.webp';
import heroSmartphonesMobile from '@/assets/banners/mobile/gadget-genie-hero-smartphones-mobile.webp';
import heroGamingMobile from '@/assets/banners/mobile/gadget-genie-hero-gaming-mobile.webp';
import heroWorkMobile from '@/assets/banners/mobile/gadget-genie-hero-work-mobile.webp';
import heroSmartHomeMobile from '@/assets/banners/mobile/gadget-genie-hero-smart-home-mobile.webp';
import heroAudioMobile from '@/assets/banners/mobile/gadget-genie-hero-audio-mobile.webp';
// Categories
import catSmartphones from '@/assets/categories/category-smartphones.webp';
import catLaptops from '@/assets/categories/category-laptops.webp';
import catGaming from '@/assets/categories/category-gaming.webp';
import catAccessories from '@/assets/categories/category-accessories.webp';
import catAudio from '@/assets/categories/category-audio.webp';
import catSmartTvs from '@/assets/categories/category-smart-tvs.webp';
import catSmartHome from '@/assets/categories/category-smart-home.webp';
import catCameras from '@/assets/categories/category-cameras.webp';
import catTablets from '@/assets/categories/category-tablets.webp';
import catMonitors from '@/assets/categories/category-monitors.webp';
import catNetworking from '@/assets/categories/category-networking.webp';
import catWearables from '@/assets/categories/category-wearables.webp';
import catStorage from '@/assets/categories/category-storage.webp';
import catPower from '@/assets/categories/category-power-charging.webp';
// Promotions
import promoDeals from '@/assets/promotions/promo-deals-week.webp';
import promoSmartphones from '@/assets/promotions/promo-smartphones.webp';
import promoLaptops from '@/assets/promotions/promo-laptops.webp';
import promoGaming from '@/assets/promotions/promo-gaming.webp';
import promoAudio from '@/assets/promotions/promo-audio.webp';
import promoSmartHome from '@/assets/promotions/promo-smart-home.webp';

export type Tone = 'light' | 'dark';

export interface HeroCampaign {
  id: string;
  label: string;
  headline: string;
  copy: string;
  primaryCta: { text: string; path: string };
  secondaryCta?: { text: string; path: string };
  desktopImage: string;
  mobileImage: string;
  alt: string;
  /** Backdrop tone of the photo, so copy colour stays readable */
  tone: Tone;
}

export const HERO_CAMPAIGNS: HeroCampaign[] = [
  {
    id: 'digital-life', label: 'New Arrivals', headline: 'Power Your Digital Life',
    copy: 'Discover smartphones, laptops, gaming, audio and smart technology from Gadget Genie.',
    primaryCta: { text: 'Shop Now', path: '/products' }, secondaryCta: { text: 'Explore Deals', path: '/deals' },
    desktopImage: heroDigitalLifeDesktop, mobileImage: heroDigitalLifeMobile,
    alt: 'Laptop, smartphone, wireless earbuds and smartwatch on a white studio plinth', tone: 'light',
  },
  {
    id: 'smartphones', label: 'Smartphones', headline: 'Next-Gen Smartphones',
    copy: 'The latest flagship and everyday phones, ready to ship across Zimbabwe.',
    primaryCta: { text: 'Shop Phones', path: '/products?category=smartphones' }, secondaryCta: { text: 'Explore Deals', path: '/deals' },
    desktopImage: heroSmartphonesDesktop, mobileImage: heroSmartphonesMobile,
    alt: 'Three modern smartphones with wireless earbuds and a smartwatch', tone: 'light',
  },
  {
    id: 'gaming', label: 'Gaming', headline: 'Level Up Your Gaming',
    copy: 'Consoles, controllers, headsets, gaming laptops and monitors.',
    primaryCta: { text: 'Shop Gaming', path: '/products?category=gaming' },
    desktopImage: heroGamingDesktop, mobileImage: heroGamingMobile,
    alt: 'Game console, controller, gaming headset, gaming laptop and monitor on a dark desk', tone: 'dark',
  },
  {
    id: 'work', label: 'Work & Study', headline: 'Work Smarter',
    copy: 'Laptops, monitors, tablets, keyboards and USB-C accessories for a better setup.',
    primaryCta: { text: 'Shop Laptops', path: '/products?category=laptops' }, secondaryCta: { text: 'Accessories', path: '/products?category=accessories' },
    desktopImage: heroWorkDesktop, mobileImage: heroWorkMobile,
    alt: 'Desk setup with laptop, monitor, tablet, keyboard, mouse and USB-C hub', tone: 'light',
  },
  {
    id: 'smart-home', label: 'Smart Home', headline: 'Smart Home, Simplified',
    copy: 'Smart TVs, security cameras, speakers, routers and smart lighting.',
    primaryCta: { text: 'Shop Smart Home', path: '/products?category=smart-home' },
    desktopImage: heroSmartHomeDesktop, mobileImage: heroSmartHomeMobile,
    alt: 'Smart TV, security camera, smart speaker, Wi-Fi router and smart bulb on a white console', tone: 'light',
  },
  {
    id: 'audio', label: 'Audio', headline: 'Audio That Moves',
    copy: 'Headphones, wireless earbuds, portable speakers and soundbars.',
    primaryCta: { text: 'Shop Audio', path: '/products?category=audio' },
    desktopImage: heroAudioDesktop, mobileImage: heroAudioMobile,
    alt: 'Over-ear headphones, portable speaker, soundbar and wireless earbuds', tone: 'light',
  },
];

export interface CategoryAsset {
  name: string;
  image: string;
  path: string;
  /** Lower-case substrings used to count products in this category */
  matchKeys: string[];
}

export const CATEGORY_ASSETS: CategoryAsset[] = [
  { name: 'Smartphones', image: catSmartphones, path: '/products?category=smartphones', matchKeys: ['smartphone', 'phone'] },
  { name: 'Laptops & Computers', image: catLaptops, path: '/products?category=laptops', matchKeys: ['laptop', 'computer'] },
  { name: 'Gaming', image: catGaming, path: '/products?category=gaming', matchKeys: ['gaming', 'console'] },
  { name: 'Accessories', image: catAccessories, path: '/products?category=accessories', matchKeys: ['accessor'] },
  { name: 'Audio', image: catAudio, path: '/products?category=audio', matchKeys: ['audio', 'headphone', 'speaker', 'earbud'] },
  { name: 'Smart TVs', image: catSmartTvs, path: '/products?category=tvs', matchKeys: ['tv', 'television'] },
  { name: 'Smart Home', image: catSmartHome, path: '/products?category=smart-home', matchKeys: ['smart home'] },
  { name: 'Cameras', image: catCameras, path: '/products?category=cameras', matchKeys: ['camera'] },
  { name: 'Tablets', image: catTablets, path: '/products?category=tablets', matchKeys: ['tablet'] },
  { name: 'Monitors', image: catMonitors, path: '/products?category=monitors', matchKeys: ['monitor'] },
  { name: 'Networking', image: catNetworking, path: '/products?category=networking', matchKeys: ['network', 'router'] },
  { name: 'Wearables', image: catWearables, path: '/products?category=wearables', matchKeys: ['wearable', 'watch'] },
  { name: 'Storage', image: catStorage, path: '/products?category=storage', matchKeys: ['storage', 'ssd', 'flash'] },
  { name: 'Power & Charging', image: catPower, path: '/products?category=power', matchKeys: ['power', 'charg'] },
];

export interface PromoAsset {
  id: string;
  label: string;
  headline: string;
  copy: string;
  cta: { text: string; path: string };
  image: string;
  alt: string;
  tone: Tone;
}

export const PROMO_ASSETS: PromoAsset[] = [
  { id: 'deals', label: 'Deals of the Week', headline: 'Up to 40% Off', copy: 'Top gadgets. Great prices.', cta: { text: 'Shop Deals', path: '/deals' }, image: promoDeals, alt: 'Smartwatch and smartphone on a stone block', tone: 'light' },
  { id: 'laptops', label: 'Laptops & Accessories', headline: 'Work. Play. Create.', copy: 'Everything you need to stay productive.', cta: { text: 'Shop Laptops', path: '/products?category=laptops' }, image: promoLaptops, alt: 'Laptop, backpack, wireless mouse and USB-C hub', tone: 'light' },
  { id: 'gaming', label: 'Gaming', headline: 'Level Up Your Game', copy: 'Next-generation gaming gear.', cta: { text: 'Shop Gaming', path: '/products?category=gaming' }, image: promoGaming, alt: 'Game console, controller, headset and gaming laptop', tone: 'dark' },
  { id: 'smartphones', label: 'Smartphones', headline: 'The Latest Phones', copy: 'Flagships and everyday favourites.', cta: { text: 'Shop Phones', path: '/products?category=smartphones' }, image: promoSmartphones, alt: 'Two blue smartphones with wireless earbuds', tone: 'light' },
  { id: 'audio', label: 'Audio', headline: 'Hear Every Detail', copy: 'Headphones, earbuds and speakers.', cta: { text: 'Shop Audio', path: '/products?category=audio' }, image: promoAudio, alt: 'White headphones, portable speaker and black earbuds', tone: 'light' },
  { id: 'smart-home', label: 'Smart Home', headline: 'A Smarter Home', copy: 'Cameras, speakers and smart lighting.', cta: { text: 'Shop Smart Home', path: '/products?category=smart-home' }, image: promoSmartHome, alt: 'Smart speaker, security camera and smart bulb on a shelf', tone: 'light' },
];

export interface BrandAsset { name: string; slug: string | null; brandKey: string }

/** Official logos served from the Simple Icons CDN; null slug = text wordmark tile. */
export const BRAND_ASSETS: BrandAsset[] = [
  { name: 'Samsung', slug: 'samsung', brandKey: 'samsung' },
  { name: 'Apple', slug: 'apple', brandKey: 'apple' },
  { name: 'Xiaomi', slug: 'xiaomi', brandKey: 'xiaomi' },
  { name: 'Tecno', slug: null, brandKey: 'tecno' },
  { name: 'Infinix', slug: null, brandKey: 'infinix' },
  { name: 'Oppo', slug: 'oppo', brandKey: 'oppo' },
  { name: 'Vivo', slug: 'vivo', brandKey: 'vivo' },
  { name: 'Huawei', slug: 'huawei', brandKey: 'huawei' },
  { name: 'Nokia', slug: 'nokia', brandKey: 'nokia' },
  { name: 'Motorola', slug: 'motorola', brandKey: 'motorola' },
  { name: 'Lenovo', slug: 'lenovo', brandKey: 'lenovo' },
  { name: 'HP', slug: 'hp', brandKey: 'hp' },
  { name: 'Dell', slug: 'dell', brandKey: 'dell' },
  { name: 'Sony', slug: 'sony', brandKey: 'sony' },
  { name: 'JBL', slug: 'jbl', brandKey: 'jbl' },
];
