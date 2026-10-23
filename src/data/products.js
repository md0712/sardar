export const categories = [
  {
    id: 'sofas',
    name: 'Sofas',
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    itemCount: '24+ Models',
    badge: 'Popular'
  },
  {
    id: 'beds',
    name: 'Beds',
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
    itemCount: '18+ Models',
    badge: 'Hot'
  },
  {
    id: 'dining',
    name: 'Dining Sets',
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80',
    itemCount: '15+ Models',
    badge: 'Trending'
  },
  {
    id: 'wardrobes',
    name: 'Wardrobes',
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
    itemCount: '12+ Models',
    badge: 'Solid Wood'
  },
  {
    id: 'tvs',
    name: 'TV & Audio',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80',
    itemCount: '20+ Models',
    badge: '4K OLED'
  },
  {
    id: 'refrigerators',
    name: 'Refrigerators',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80',
    itemCount: '16+ Models',
    badge: 'Inverter'
  },
  {
    id: 'washers',
    name: 'Washing Machines',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80',
    itemCount: '14+ Models',
    badge: 'Eco Wash'
  },
  {
    id: 'kitchen',
    name: 'Kitchen Appliances',
    category: 'appliances',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    itemCount: '30+ Models',
    badge: 'Up to 40% Off'
  }
];

export const products = [
  // --- FEATURED & FURNITURE ---
  {
    id: 'hk-furn-01',
    name: 'Modern Fabric Sofa 3 Seater',
    category: 'furniture',
    subcategory: 'sofas',
    price: 24999,
    originalPrice: 32999,
    discount: 24,
    rating: 4.8,
    reviewsCount: 128,
    badge: 'BEST SELLER',
    featured: true,
    highlights: [
      { label: 'Comfortable', icon: 'sofa' },
      { label: 'Premium Quality', icon: 'gear' },
      { label: 'Multiple Colours', icon: 'clock' }
    ],
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Elevate your living room with this handcrafted 3-seater modern fabric sofa. Engineered with high-resilience foam and a solid eucalyptus timber frame for long-lasting ergonomic comfort.',
    features: [
      'High density 32-gauge foam cushioning',
      'Premium breathable stain-resistant linen fabric',
      'Solid kiln-dried hardwood frame structure',
      '10-year termite & manufacturing structural warranty',
      'Includes 2 complementary geometric accent cushions'
    ],
    specifications: {
      'Dimensions (W x D x H)': '78" x 34" x 33"',
      'Seating Capacity': '3 Persons',
      'Primary Material': 'Treated Solid Wood & Fabric',
      'Color Variant': 'Warm Sand & Camel Grey',
      'Warranty': '5 Years Comprehensive'
    }
  },
  {
    id: 'hk-furn-02',
    name: 'Queen Size Bed with Storage',
    category: 'furniture',
    subcategory: 'beds',
    price: 19999,
    originalPrice: 26000,
    discount: 23,
    rating: 4.7,
    reviewsCount: 94,
    badge: 'NEW ARRIVAL',
    featured: true,
    highlights: [
      { label: 'Storage Space', icon: 'bed' },
      { label: 'Durable Build', icon: 'shield' },
      { label: 'Multiple Colours', icon: 'clock' }
    ],
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef3?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Transform your bedroom into a sanctuary of peace and order. Features German hydraulic lift mechanism allowing effortless access to huge under-bed storage.',
    features: [
      'Heavy-duty German hydraulic gas-lift mechanism',
      'Scratch & moisture resistant Melamine finish',
      'Padded headboard for comfortable late-night reading',
      'Under-bed partition for organized bedding storage'
    ],
    specifications: {
      'Dimensions (W x L x H)': '63" x 82" x 40"',
      'Mattress Size Compatibility': '78" x 60" (Queen)',
      'Primary Material': 'Pre-laminated Engineered Wood',
      'Storage Type': 'Hydraulic Lift Storage',
      'Finish': 'Natural Walnut Teak Finish'
    }
  },
  {
    id: 'hk-furn-03',
    name: 'Wooden Dining Table 6 Seater',
    category: 'furniture',
    subcategory: 'dining',
    price: 18999,
    originalPrice: 26000,
    discount: 27,
    rating: 4.9,
    reviewsCount: 76,
    badge: null,
    featured: true,
    highlights: [
      { label: '6 Seater', icon: 'chair' },
      { label: 'Premium Wood', icon: 'leaf' },
      { label: 'Modern Design', icon: 'tools' }
    ],
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A masterpiece for family celebrations and dinner parties. Handcrafted from sustainably harvested Sheesham wood with smooth rounded safety corners.',
    features: [
      'Crafted from 100% Genuine Seasoned Sheesham Wood',
      'Includes 6 ergonomically contoured wooden chairs with padded seats',
      'Multi-stage walnut lacquer finish resistant to heat marks',
      'Child-safe beveled edge design'
    ],
    specifications: {
      'Table Dimensions': '58" x 35" x 30"',
      'Chair Dimensions': '18" x 18" x 38"',
      'Wood Type': 'Indian Rosewood (Sheesham)',
      'Seating Capacity': '6 Chairs Included',
      'Warranty': '3 Years on Wood & Jointures'
    }
  },
  {
    id: 'hk-furn-04',
    name: '4-Door Sliding Wardrobe with Full Mirror',
    category: 'furniture',
    subcategory: 'wardrobes',
    price: 28499,
    originalPrice: 38000,
    discount: 25,
    rating: 4.6,
    reviewsCount: 52,
    badge: 'Modern',
    featured: false,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Expansive storage meets minimalist beauty. Features smooth sliding doors with soft-close dampers, a full-length dressing mirror, and built-in jewelry locks.',
    features: [
      'Heavy-gauge aluminum sliding track with anti-jump wheels',
      'Integrated lockable security drawer for valuables',
      'Full height dressing mirror on central panel',
      'Ample hanging rods and 8 adjustable modular shelves'
    ],
    specifications: {
      'Dimensions (W x D x H)': '72" x 24" x 84"',
      'Material': 'BWP Marine Ply with High-Gloss Laminate',
      'Number of Doors': '4 Modular Panels',
      'Warranty': '5 Years'
    }
  },
  {
    id: 'hk-furn-05',
    name: 'Ergonomic High-Back Executive Chair',
    category: 'furniture',
    subcategory: 'chairs',
    price: 8999,
    originalPrice: 14000,
    discount: 35,
    rating: 4.8,
    reviewsCount: 180,
    badge: 'Work From Home',
    featured: false,
    image: 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Recommended by orthopedic specialists. Features dynamic lumbar support, 3D armrests, and a 135-degree synchro-tilt recline mechanism.',
    features: [
      'Self-adjusting active lumbar support',
      'Class 4 BIFMA certified hydraulic gas lift',
      'Breathable Korean mesh fabric backrest',
      '3D adjustable armrests with soft PU padding'
    ],
    specifications: {
      'Weight Capacity': 'Up to 140 kg',
      'Base': 'Heavy Chrome Metal Star Base with Silent Caster Wheels',
      'Warranty': '3 Years Replacement Warranty'
    }
  },
  {
    id: 'hk-furn-06',
    name: 'Luxury L-Shape Sectional Fabric Sofa',
    category: 'furniture',
    subcategory: 'sofas',
    price: 36999,
    originalPrice: 49999,
    discount: 26,
    rating: 4.9,
    reviewsCount: 68,
    badge: 'Premium',
    featured: false,
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Indulge in spacious comfort. Reversible chaise lounge allows left or right side configuration to suit any living room footprint.',
    features: [
      'Reversible left/right corner chaise configuration',
      'Water and pet-scratch resistant suede-touch upholstery',
      'Feather-down layered top cushion fill for cloud-like sinking comfort'
    ],
    specifications: {
      'Overall Width': '104"',
      'Chaise Depth': '64"',
      'Frame': 'Kiln Dried Sal Wood'
    }
  },

  // --- ELECTRONICS ---
  {
    id: 'hk-elec-01',
    name: 'Smart LED TV 55 inch 4K Ultra HD',
    category: 'electronics',
    subcategory: 'tvs',
    price: 39999,
    originalPrice: 52999,
    discount: 24,
    rating: 4.8,
    reviewsCount: 215,
    badge: 'OFFER',
    featured: true,
    highlights: [
      { label: '4K Ultra HD', icon: '4k' },
      { label: 'Smart TV', icon: 'wifi' },
      { label: 'Multiple Sizes', icon: 'monitor' }
    ],
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Immerse your senses in breathtaking cinema quality with Dolby Vision HDR, quantum-dot color accuracy, and 30W Dolby Atmos spatial acoustics.',
    features: [
      'True 4K UHD 3840 x 2160 Resolution with Quantum Dot Enhancer',
      'Google TV OS with Google Assistant & Hands-free voice remote',
      'Dolby Vision & Dolby Atmos sound system',
      'ALLM & VRR 120Hz mode for next-gen gaming consoles',
      '3 x HDMI 2.1 ports, 2 x USB, Dual-band Wi-Fi & Bluetooth 5.2'
    ],
    specifications: {
      'Screen Size': '55 Inches (139 cm)',
      'Display Technology': 'LED 4K Ultra HD with Quantum Color',
      'Refresh Rate': '60Hz Native / 120Hz Motion Rate',
      'Sound Output': '30W Dolby Atmos Built-in Speakers',
      'Warranty': '2 Years Comprehensive Manufacturer Warranty'
    }
  },
  {
    id: 'hk-elec-02',
    name: 'Double Door Refrigerator 350L',
    category: 'electronics',
    subcategory: 'refrigerators',
    price: 28999,
    originalPrice: 39999,
    discount: 28,
    rating: 4.7,
    reviewsCount: 164,
    badge: null,
    featured: true,
    highlights: [
      { label: 'Energy Saving', icon: 'zap' },
      { label: 'Fast Cooling', icon: 'snowflake' },
      { label: 'Large Storage', icon: 'storage' }
    ],
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Keep farm produce fresh for up to 15 days with Smart Inverter cooling and Multi-Air Flow vents that circulate even chill across all compartments.',
    features: [
      'Frost-free double door with convertible 5-in-1 cooling modes',
      'Smart Digital Inverter Compressor with 10-year warranty',
      'Deodorizer with active antibacterial honeycomb carbon filter',
      'Toughened glass shelves capable of bearing up to 175 kg per rack'
    ],
    specifications: {
      'Gross Capacity': '350 Litres (Fresh Food 255L, Freezer 95L)',
      'Energy Rating': '3 Star BEE Efficiency Certified',
      'Defrosting System': 'Automatic Frost-Free',
      'Finish': 'Brushed Steel Silver Finish',
      'Warranty': '1 Year on Unit, 10 Years on Compressor'
    }
  },
  {
    id: 'hk-elec-03',
    name: 'Front Load Washing Machine 8kg',
    category: 'electronics',
    subcategory: 'washers',
    price: 26999,
    originalPrice: 36999,
    discount: 27,
    rating: 4.8,
    reviewsCount: 142,
    badge: null,
    featured: true,
    highlights: [
      { label: '8kg Capacity', icon: 'tub' },
      { label: 'Inverter Motor', icon: 'refresh' },
      { label: 'Water Saving', icon: 'droplet' }
    ],
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Sanitize clothes while protecting delicate fabrics. The built-in steam cycle kills 99.9% of allergens and bacteria while reducing wrinkles and creases.',
    features: [
      'AI Direct Drive motor detects weight & fabric tenderness automatically',
      'Inbuilt heater with 90°C baby care sterilization mode',
      'Ultra-fast 1400 RPM spin speed for faster drying',
      'Smart mobile diagnosis and Wi-Fi laundry control'
    ],
    specifications: {
      'Washing Capacity': '8.0 Kg (Ideal for families of 4-6 members)',
      'Energy Rating': '5 Star BEE Highest Energy Saving',
      'Motor Type': 'BLDC Inverter Direct Drive',
      'Warranty': '2 Years on Product, 10 Years on Motor'
    }
  },
  {
    id: 'hk-elec-04',
    name: 'Split AC 1.5 Ton 5 Star Inverter',
    category: 'electronics',
    subcategory: 'acs',
    price: 32999,
    originalPrice: 44999,
    discount: 27,
    rating: 4.9,
    reviewsCount: 198,
    badge: 'BEST SELLER',
    featured: true,
    highlights: [
      { label: 'Fast Cooling', icon: 'snowflake' },
      { label: 'Energy Saving', icon: 'zap' },
      { label: 'Low Noise', icon: 'volume' }
    ],
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Instant cooling even under extreme 52°C heat waves. 100% copper condenser with anti-corrosion blue fin coating ensures decades of reliable performance.',
    features: [
      'Dual rotary inverter technology for ultra-quiet operation (<21dB)',
      'PM 2.5 air purification filter removes microscopic dust and pollen',
      'Convertible 6-in-1 power-saving cooling modes',
      'Stabilizer-free operation across 130V to 290V voltage swings'
    ],
    specifications: {
      'Capacity': '1.5 Ton (Ideal for room size 120-180 sq.ft)',
      'Energy Rating': '5 Star BEE (ISEER 5.2)',
      'Condenser Coil': '100% Grooved Pure Copper Tubes',
      'Refrigerant Gas': 'Eco-Friendly R32',
      'Warranty': '1 Year on Machine, 10 Years on Compressor'
    }
  },
  {
    id: 'hk-elec-05',
    name: '65" OLED Cinema Smart TV 4K',
    category: 'electronics',
    subcategory: 'tvs',
    price: 84999,
    originalPrice: 110000,
    discount: 23,
    rating: 4.95,
    reviewsCount: 88,
    badge: 'Flagship OLED',
    featured: false,
    image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Self-lit pixels deliver infinite contrast and true pitch blacks. Experience movies exactly as the Hollywood directors envisioned in Master Studio mode.',
    features: [
      'Self-illuminating 8.3 million individual OLED pixels',
      'Neural Quantum AI 4K Upscaling Processor',
      'Ultra Slim 4.9mm Gallery Wallpaper Profile'
    ],
    specifications: {
      'Screen Size': '65 Inches (164 cm)',
      'Display Panel': 'Master OLED EVO Panel',
      'Sound Output': '60W 4.2 Channel Surround with Subwoofer'
    }
  },

  // --- HOME APPLIANCES ---
  {
    id: 'hk-app-03',
    name: 'Microwave Oven 25L Convection',
    category: 'appliances',
    subcategory: 'kitchen',
    price: 11999,
    originalPrice: 15999,
    discount: 25,
    rating: 4.7,
    reviewsCount: 119,
    badge: null,
    featured: true,
    highlights: [
      { label: 'Auto Cook', icon: 'chef' },
      { label: 'Grill Function', icon: 'grill' },
      { label: 'Child Lock', icon: 'lock' }
    ],
    image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Bake cakes, grill tikkas, and reheat gourmet meals with one versatile kitchen companion. Ceramic enamel cavity resists scratches and wipes clean easily.',
    features: [
      'Over 200 Indian auto-cook recipe menus programmed',
      'Bacteriostatic ceramic enamel interior cavity',
      'Motorized rotisserie for authentic barbecue grilling'
    ],
    specifications: {
      'Cavity Capacity': '25 Litres Stainless Ceramic',
      'Control Type': 'Tactile Dial & Touch membrane with LED display',
      'Warranty': '1 Year Comprehensive + 5 Years Magnetron'
    }
  },
  {
    id: 'hk-app-01',
    name: 'Mixer Grinder 750W 4 Jars',
    category: 'appliances',
    subcategory: 'mixers',
    price: 4999,
    originalPrice: 6999,
    discount: 29,
    rating: 4.7,
    reviewsCount: 310,
    badge: 'NEW',
    featured: true,
    highlights: [
      { label: '750W Power', icon: 'zap' },
      { label: '4 Jars', icon: 'jars' },
      { label: 'Durable Blades', icon: 'blade' }
    ],
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Tackle the toughest Indian spices, turmeric roots, and smooth idli batter effortlessly with pure copper 750W motor and stainless steel flow-breaker jars.',
    features: [
      '100% Copper wound motor with overload thermal cut-off',
      '4 Heavy gauge stainless steel jars including juicer blender jar',
      'Aero-drive 3D stainless steel blades with razor-sharp edges',
      'Dual safety interlocking mechanism with anti-slip vacuum feet'
    ],
    specifications: {
      'Power Consumption': '750 Watts / 230V',
      'Number of Jars': '4 (1.5L Wet, 1.25L Dry, 0.5L Chutney, 1.5L Juicer)',
      'Blade Material': 'Food Grade Stainless Steel 304',
      'Warranty': '2 Years on Product, 5 Years on Motor'
    }
  },
  {
    id: 'hk-app-05',
    name: '3 Burner Gas Stove Toughened Glass',
    category: 'appliances',
    subcategory: 'kitchen',
    price: 5499,
    originalPrice: 7999,
    discount: 31,
    rating: 4.8,
    reviewsCount: 184,
    badge: null,
    featured: true,
    highlights: [
      { label: 'High Efficiency', icon: 'flame' },
      { label: 'Toughened Glass', icon: 'gem' },
      { label: 'ISI Certified', icon: 'award' }
    ],
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Upgrade your culinary space with this sleek toughened glass 3-burner gas stove. Equipped with tri-pin brass burners, ergonomic knobs, and spill-proof drip trays.',
    features: [
      'Heavy-duty shatterproof toughened black glass top',
      'High-efficiency forged brass burners with uniform blue flame',
      'Rust-proof powder coated pan supports',
      '360-degree revolving gas inlet nozzle'
    ],
    specifications: {
      'Burner Type': '3 High-Efficiency Brass Burners',
      'Top Material': '8mm Toughened Glass',
      'Ignition': 'Manual',
      'Certification': 'ISI Certified',
      'Warranty': '2 Years on Product, 5 Years on Glass'
    }
  },
  {
    id: 'hk-app-02',
    name: 'Digital Air Fryer 5.5L Rapid Crisp',
    category: 'appliances',
    subcategory: 'kitchen',
    price: 4999,
    originalPrice: 7999,
    discount: 37,
    rating: 4.8,
    reviewsCount: 175,
    badge: 'Healthy Living',
    featured: false,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Enjoy crispy French fries, samosas, and roasted chicken with 90% less oil. 360-degree rapid superheated vortex air circulation cooks evenly in minutes.',
    features: [
      '8 One-touch preset digital menus for fries, baking, chicken, fish',
      'Non-stick dishwasher safe Teflon-free ceramic basket',
      'Temperature control from 80°C to 200°C with 60-min timer',
      'Cool touch handle with auto-pause basket removal sensor'
    ],
    specifications: {
      'Capacity': '5.5 Litres (Serves 4-5 persons)',
      'Power': '1500 Watts High Efficiency',
      'Warranty': '2 Years Replacement Guarantee'
    }
  },
  {
    id: 'hk-app-04',
    name: 'RO + UV + Copper Mineral Water Purifier 8L',
    category: 'appliances',
    subcategory: 'home',
    price: 12999,
    originalPrice: 18999,
    discount: 31,
    rating: 4.9,
    reviewsCount: 220,
    badge: 'Pure & Safe',
    featured: false,
    image: 'https://images.unsplash.com/photo-1584281722573-b3c16694e9f7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584281722573-b3c16694e9f7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Ensures pure, mineral-rich drinking water. Advanced 8-stage purification infuses natural copper and zinc ions to boost daily immunity.',
    features: [
      '8-Stage RO + UV + UF + Active Copper Cartridge technology',
      'Real-time digital filter life indicator and TDS controller',
      'Food-grade sealed 8-litre water storage tank with UV LED guard'
    ],
    specifications: {
      'Storage Tank': '8 Litres Storage',
      'Purification Speed': '15 Litres / Hour',
      'TDS Reduction': 'Up to 2000 ppm input source',
      'Warranty': '1 Year with Free First Filter Service'
    }
  },

  // --- SPECIAL COMBO OFFERS ---
  {
    id: 'hk-combo-01',
    name: 'Living Room Royale Combo: 3-Seater Sofa + 55" 4K Smart TV',
    category: 'furniture',
    subcategory: 'sofas',
    isCombo: true,
    price: 59999,
    originalPrice: 85000,
    discount: 29,
    rating: 4.95,
    reviewsCount: 42,
    badge: 'Mega Combo Deal',
    featured: false,
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The ultimate home entertainment bundle! Receive our bestselling Modern Fabric 3-Seater Sofa together with the Smart LED 55-Inch 4K UHD TV at an unbeatable combo discount.',
    features: [
      'Includes Modern Fabric 3-Seater Sofa (Sand Grey)',
      'Includes Smart LED TV 55" 4K Ultra HD with Dolby Atmos',
      'Free VIP White Glove home delivery and TV wall mounting installation',
      'Combined warranty coverage & single dedicated relationship manager'
    ],
    specifications: {
      'Combo Savings': 'Save ₹25,001 compared to individual purchase',
      'Delivery': 'Synchronized single-day home delivery',
      'EMI': 'Zero-interest 6 or 12 month EMI available'
    }
  },
  {
    id: 'hk-combo-02',
    name: 'Kitchen & Appliance Suite: Double Door Fridge + 8kg Front Load Washer',
    category: 'electronics',
    subcategory: 'refrigerators',
    isCombo: true,
    price: 51999,
    originalPrice: 66000,
    discount: 21,
    rating: 4.9,
    reviewsCount: 38,
    badge: 'Smart Home Bundle',
    featured: false,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Upgrade your home appliances at once. 400L Inverter Double Door Fridge paired with 8kg Steam Front-Load Washing Machine for pristine everyday living.',
    features: [
      'Includes 400L Inverter Double Door Refrigerator (Silver)',
      'Includes 8kg Steam Inverter Front Load Washing Machine',
      'Free standard installation kit, tap adapter & voltage protector'
    ],
    specifications: {
      'Combo Savings': 'Save ₹14,001 on this bundle',
      'Warranty': '10 Years Motor & Compressor Warranty included'
    }
  }
];

export const specialOffers = [
  {
    id: 'festive-50',
    title: 'Festival Offers',
    subtitle: 'Up to 50% OFF',
    description: 'Massive festive discounts on handcrafted furniture, smart LED TVs, refrigerators, and modular dining suites.',
    code: 'FESTIVE50',
    cta: 'Shop Offers',
    discountHighlight: 'Flat ₹5,000 extra on orders above ₹40,000',
    validTill: 'Valid until Diwali midnight',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-amber-700 to-amber-900'
  },
  {
    id: 'combo-deals',
    title: 'Combo Deals',
    subtitle: 'Furniture + Electronics',
    description: 'Combine sofas with smart TVs or beds with bedroom ACs for unmatched bundled price drops and free VIP setup.',
    code: 'COMBOBEST',
    cta: 'Explore Deals',
    discountHighlight: 'Save up to ₹25,000 on curated living room sets',
    validTill: 'Limited stock availability',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-stone-800 to-amber-950'
  },
  {
    id: 'easy-emi',
    title: 'EMI Options Available',
    subtitle: 'Shop Now, Pay Later',
    description: '0% Interest No-Cost EMI options on HDFC, ICICI, SBI, Axis, Bajaj Finserv, and Snapmint up to 18 months.',
    code: 'ZEROEMI',
    cta: 'Know More',
    discountHighlight: 'Down-payment as low as ₹0 on select products',
    validTill: 'Instant approval at showroom & online',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-zinc-900 to-stone-800'
  }
];

export const testimonials = [];

export const storeInfo = {
  name: 'Sardar Mart Furniture and Home Appliances',
  tagline: 'Your Home, Our Priority',
  phone: '+91 6383056338',
  secondaryPhone: '+91 9344623632',
  whatsapp: '916383056338',
  secondaryWhatsapp: '919344623632',
  email: 'sardarmart64@gmail.com',
  gstin: '33DVKPR2334L1Z9',
  address: 'No. 192, E.H Road, Cholan nagar, Vyasarpadi, Erukancheri, Chennai - 39.',
  instagram: {
    name: 'sardar_mart_ch_39',
    handle: '@sardar_mart_ch_39',
    url: 'https://www.instagram.com/sardar_mart_ch_39?xtok=N2c2cW8xYmdzM3Fy'
  },
  hours: 'Monday – Sunday: 09:30 AM – 09:30 PM',
  branches: [
    {
      name: 'Flagship Mega Showroom (Vyasarpadi / Erukancheri)',
      address: 'No. 192, E.H Road, Cholan nagar, Vyasarpadi, Erukancheri, Chennai - 39.',
      phone: '+91 6383056338 / +91 9344623632',
      whatsapp: '916383056338',
      email: 'sardarmart64@gmail.com',
      timing: '9:30 AM - 9:30 PM (All 7 Days Open)'
    }
  ]
};
