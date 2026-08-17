import type { ContinentConfig } from '../types/country';

export const CONTINENTS: ContinentConfig[] = [
  { name: 'Europe', nameUz: 'Yevropa', region: 'Europe', description: "Tarix va madaniyat beshigi — 44 ta davlat, qadimiy shaharlar va rang-barang madaniyatlar makoni.", icon: '🏰', color: '#3B82F6', gradient: 'from-blue-500 to-indigo-600', route: '/europe', facts: ['44 ta davlat', 'Eng kichik: Vatikan', 'Eng katta: Rossiya'] },
  { name: 'Asia', nameUz: 'Osiyo', region: 'Asia', description: "Dunyoning eng katta qit'asi — 48 ta davlat, jahon aholisining 60 foizi yashaydi.", icon: '🏯', color: '#EF4444', gradient: 'from-red-500 to-orange-600', route: '/asia', facts: ['48 ta davlat', "Eng ko'p aholi: Hindiston", 'Eng baland cho\'qqi: Everest'] },
  { name: 'Africa', nameUz: 'Afrika', region: 'Africa', description: "Insoniyat vatani — 54 ta davlat, boyligi va xilma-xilligi bilan ajralib turadi.", icon: '🌍', color: '#F59E0B', gradient: 'from-amber-500 to-yellow-600', route: '/africa', facts: ['54 ta davlat', 'Eng katta: Jazoir', 'Eng uzun daryo: Nil'] },
  { name: 'North America', nameUz: 'Shimoliy Amerika', region: 'Americas', description: "Imkoniyatlar qit'asi — 23 ta davlat, iqtisodiy jihatdan eng rivojlangan mintaqa.", icon: '🗽', color: '#8B5CF6', gradient: 'from-violet-500 to-purple-600', route: '/north-america', facts: ['23 ta davlat', 'Eng katta: Kanada', "Eng ko'p aholi: AQSH"] },
  { name: 'South America', nameUz: 'Janubiy Amerika', region: 'Americas', description: "Tropik o'rmonlar va And tog'lari yurti — 12 ta davlat, Amazonka daryosi makoni.", icon: '🌿', color: '#10B981', gradient: 'from-emerald-500 to-green-600', route: '/south-america', facts: ['12 ta davlat', 'Eng katta: Braziliya', "Eng baland: And tog'lari"] },
  { name: 'Oceania', nameUz: 'Okeaniya', region: 'Oceania', description: "Tinch okean orollari — 14 ta davlat, noyob tabiat va madaniyatlar makoni.", icon: '🏝️', color: '#06B6D4', gradient: 'from-cyan-500 to-teal-600', route: '/oceania', facts: ['14 ta davlat', 'Eng katta: Avstraliya', 'Eng kichik: Nauru'] },
];

export function getContinentByRoute(route: string): ContinentConfig | undefined {
  return CONTINENTS.find((c) => c.route === route);
}
