
import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ShoppingBag, 
  Users, 
  MessageCircle, 
  TrendingUp, 
  ShieldCheck, 
  BadgeCheck, 
  Plus, 
  Minus, 
  X, 
  ShoppingCart, 
  MapPin, 
  Phone, 
  Facebook, 
  Instagram, 
  ArrowRight,
  GraduationCap,
  Gem,
  CheckCircle2,
  Clock,
  Target
} from 'lucide-react';

const WHATSAPP_NUMBER = "96171047685";
// شعار الشركة الرسمي الذي أرسلته
const DXN_LOGO_URL = "https://raw.githubusercontent.com/mustafa-moussa-dxn/assets/main/dxn-logo.png";
// صورتك الشخصية (الرجل ذو اللحية والسترة السوداء)
const DISTRIBUTOR_IMAGE_URL = "https://raw.githubusercontent.com/mustafa-moussa-dxn/assets/main/mustafa.jpg";

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  priceNonMember: number;
  priceMember: number;
  image: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "قهوة لينجزي 3 في 1",
    category: "مشروبات صحية",
    description: "مزيج فاخر من أجود أنواع القهوة مع فطر الريشي الصحي، قليلة الكافيين.",
    priceNonMember: 15.00,
    priceMember: 12.00,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    name: "مسحوق فطر الريشي (RG/GL)",
    category: "مكملات غذائية",
    description: "ملك الأعشاب الطبيعي لتعزيز المناعة وطرد السموم وتجديد الخلايا.",
    priceNonMember: 45.00,
    priceMember: 36.00,
    image: "https://images.unsplash.com/photo-1596131412316-d444498308c3?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    name: "اسبيرولينا (غذاء السوبر)",
    category: "مكملات غذائية",
    description: "منجم من الفيتامينات والمعادن والبروتينات الطبيعية من الطحالب الخضراء.",
    priceNonMember: 35.00,
    priceMember: 28.00,
    image: "https://images.unsplash.com/photo-1622353381656-559d1df52331?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    name: "عصير مورينزي (النوني)",
    category: "مشروبات صحية",
    description: "فاكهة النوني الاستوائية الغنية بالأنزيمات الهاضمة ومضادات الأكسدة.",
    priceNonMember: 22.00,
    priceMember: 17.00,
    image: "https://images.unsplash.com/photo-1610472403986-e028122d561a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    name: "فطر عرف الأسد",
    category: "مكملات غذائية",
    description: "غذاء الجهاز العصبي، يساعد في تقوية الذاكرة والتركيز والأعصاب.",
    priceNonMember: 40.00,
    priceMember: 32.00,
    image: "https://images.unsplash.com/photo-1628102422200-e7943586045d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 8,
    name: "معجون أسنان جانوزي",
    category: "عناية شخصية",
    description: "عناية فائقة بالفم واللثة طبيعي 100% بدون فلورايد أو مواد كيميائية.",
    priceNonMember: 10.00,
    priceMember: 8.00,
    image: "https://images.unsplash.com/photo-1559594806-193496724967?auto=format&fit=crop&q=80&w=800"
  }
];

const App = () => {
  const [filter, setFilter] = useState('الكل');
  const [cart, setCart] = useState<{productId: number, quantity: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({ address: '', phone: '' });

  const categories = ['الكل', ...new Set(PRODUCTS.map(p => p.category))];

  const openWhatsApp = (msg: string) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) return prev.filter(item => item.productId !== productId);
        return prev.map(item => item.productId === productId ? { ...item, quantity: newQty } : item);
      }
      if (delta > 0) return [...prev, { productId, quantity: 1 }];
      return prev;
    });
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      if (!product) return acc;
      const price = isMember ? product.priceMember : product.priceNonMember;
      return acc + (price * item.quantity);
    }, 0);
  }, [cart, isMember]);

  const generateInvoiceMessage = () => {
    if (cart.length === 0) return;
    let msg = `*طلب شراء جديد من موقع مصطفى موسى*\n`;
    msg += `نوع السعر: ${isMember ? 'سعر عضو' : 'سعر زبون'}\n`;
    msg += `--------------------------\n`;
    cart.forEach((item, index) => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      if (product) {
        const price = isMember ? product.priceMember : product.priceNonMember;
        msg += `${index + 1}. ${product.name} | كمية: ${item.quantity} | السعر: ${price}$\n`;
      }
    });
    msg += `--------------------------\n`;
    msg += `*الإجمالي: ${cartTotal.toFixed(2)}$*\n`;
    msg += `📍 العنوان: ${deliveryDetails.address}\n`;
    msg += `📞 الهاتف: ${deliveryDetails.phone}`;
    openWhatsApp(msg);
  };

  const handleJoinTeam = () => {
    const msg = `السلام عليكم أستاذ مصطفى، تابعت موقعكم وأرغب في الانضمام لفريقكم والبدء في التدريبات المجانية لتحقيق دخل إضافي محترم. أريد التعرف على التفاصيل.`;
    openWhatsApp(msg);
  };

  const filteredProducts = filter === 'الكل' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="min-h-screen font-['Tajawal'] bg-white text-gray-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl z-[100] border-b border-gray-100 py-4 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 p-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
              <img src={DXN_LOGO_URL} alt="DXN Official Logo" className="w-full h-full object-contain" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-black text-green-900 leading-none">DXN World</h1>
              <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Health & Wealth</p>
            </div>
          </div>
          <div className="hidden lg:flex gap-10 text-sm font-black">
            <a href="#products" className="hover:text-green-700 transition-colors uppercase">المتجر</a>
            <a href="#business" className="hover:text-green-700 transition-colors uppercase">فرصة العمل</a>
            <a href="#about" className="hover:text-green-700 transition-colors uppercase">من أنا؟</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-green-50 text-green-700 rounded-2xl hover:bg-green-100 transition-all active:scale-90">
              <ShoppingCart size={24} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-white font-black">{cart.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Mustafa's Square Photo */}
      <section id="about" className="pt-32 pb-20 bg-gradient-to-b from-green-50/50 to-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            
            {/* The Professional Square Image - مصطفى موسى */}
            <div className="relative shrink-0 lg:order-last">
              <div className="absolute -inset-6 bg-gradient-to-tr from-green-600 to-green-300 rounded-[3rem] blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] bg-gray-200 rounded-[2.5rem] overflow-hidden border-[12px] border-white shadow-2xl shadow-green-900/10 transform hover:rotate-2 transition-transform duration-500">
                <img 
                  src={DISTRIBUTOR_IMAGE_URL} 
                  alt="مصطفى موسى - عضو موزع معتمد" 
                  className="w-full h-full object-cover object-top scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"; }}
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-green-700 text-white px-8 py-6 rounded-[2rem] shadow-2xl border-4 border-white flex items-center gap-3">
                <BadgeCheck size={32} />
                <div>
                  <p className="font-black text-xl leading-none">مصطفى موسى</p>
                  <p className="text-xs font-bold text-green-100 mt-1">قائد فريق دولي معتمد</p>
                </div>
              </div>
            </div>

            <div className="text-right flex-1">
              <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-100 text-green-700 rounded-full text-sm font-black mb-8 border border-green-200 shadow-sm">
                <Target size={18} /> شريكك نحو النجاح في DXN
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tighter">
                صحتك وثروتك <br/> <span className="text-green-700">في مكان واحد</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-500 mb-12 leading-relaxed font-medium">
                اكتشف منتجات الطبيعة التي غيرت حياة الملايين، وابدأ معي رحلتك نحو الاستقلال المالي والتدريب المجاني الشامل لتصبح مسوقاً عالمياً.
              </p>
              <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                <a href="#products" className="px-12 py-6 bg-green-700 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-green-800 transition-all hover:-translate-y-1">تصفح المتجر</a>
                <button onClick={handleJoinTeam} className="px-12 py-6 bg-white text-green-700 border-4 border-green-700 rounded-[2rem] font-black text-xl hover:bg-green-50 transition-all flex items-center gap-3">
                   انضم لفريقي مجاناً <Users size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION FIRST */}
      <section id="products" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
            <div className="text-right">
              <h2 className="text-5xl font-black text-gray-900 mb-6 relative inline-block">
                أقوى المنتجات الطبيعية
                <div className="absolute -bottom-2 right-0 w-1/2 h-2 bg-green-500 rounded-full"></div>
              </h2>
              <p className="text-gray-400 font-bold text-xl">منتجات عضوية عالية الجودة - بأسعار حصرية للأعضاء</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-10 py-3 rounded-2xl font-black transition-all border-2 ${filter === cat ? 'bg-green-700 text-white border-green-700 shadow-xl scale-105' : 'bg-gray-50 text-gray-400 border-transparent hover:border-green-100'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-12">
            {filteredProducts.map((p) => {
              const qty = cart.find(i => i.productId === p.id)?.quantity || 0;
              return (
                <div key={p.id} className={`bg-white rounded-[3rem] overflow-hidden shadow-md hover:shadow-2xl transition-all border-2 flex flex-col h-full group ${qty > 0 ? 'border-green-600' : 'border-gray-50'}`}>
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-6 right-6 bg-white/95 px-6 py-2 rounded-2xl text-xs font-black text-green-800 shadow-lg">{p.category}</div>
                    {qty > 0 && (
                      <div className="absolute inset-0 bg-green-900/10 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-white text-green-700 w-24 h-24 rounded-full flex items-center justify-center font-black text-4xl shadow-2xl border-4 border-green-600 animate-in zoom-in">
                          {qty}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-10 flex flex-col flex-grow">
                    <h3 className="text-2xl font-black text-gray-900 mb-4 min-h-[4rem]">{p.name}</h3>
                    <p className="text-gray-500 mb-8 font-medium line-clamp-2">{p.description}</p>
                    
                    <div className="bg-green-50/50 p-6 rounded-[2.5rem] border border-green-100 mb-10 flex justify-between items-center shadow-inner">
                      <div className="text-center">
                        <p className="text-xs text-gray-400 font-bold mb-1">غير عضو</p>
                        <p className="font-black text-2xl text-gray-900">{p.priceNonMember}$</p>
                      </div>
                      <div className="w-px h-12 bg-green-200"></div>
                      <div className="text-center">
                        <p className="text-xs text-green-700 font-bold mb-1">للعضو (خصم)</p>
                        <p className="font-black text-3xl text-green-800">{p.priceMember}$</p>
                      </div>
                    </div>

                    <div className="mt-auto space-y-4">
                      {qty === 0 ? (
                        <button onClick={() => updateQuantity(p.id, 1)} className="w-full py-5 bg-green-700 text-white rounded-[1.5rem] font-black text-lg hover:bg-green-800 transition-all flex items-center justify-center gap-3 shadow-xl">
                          <Plus size={24} /> أضف للطلبية
                        </button>
                      ) : (
                        <div className="flex items-center justify-between bg-green-50 p-2 rounded-[1.5rem] border-2 border-green-200">
                          <button onClick={() => updateQuantity(p.id, -1)} className="w-14 h-14 bg-white text-green-700 rounded-2xl flex items-center justify-center shadow-md active:scale-90"><Minus size={24} /></button>
                          <span className="font-black text-3xl text-green-900">{qty}</span>
                          <button onClick={() => updateQuantity(p.id, 1)} className="w-14 h-14 bg-green-700 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90"><Plus size={24} /></button>
                        </div>
                      )}
                      <button 
                        onClick={() => openWhatsApp(`مرحباً أستاذ مصطفى، أعجبني منتج [${p.name}] وأرغب في الحصول عليه بسعر العضو المخفض. كيف يمكنني التسجيل معكم؟`)}
                        className="w-full text-center text-green-700 font-black text-sm py-2 hover:underline transition-all"
                      >
                        كيف أحصل على سعر العضو المخفض؟
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BUSINESS OPPORTUNITY - THE "PROCESS" SECTION */}
      <section id="business" className="py-24 bg-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-400 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black mb-10 leading-tight">حقق دخلاً إضافياً <br/> <span className="text-green-400">300-500 دولار شهرياً</span></h2>
            <p className="text-2xl text-green-100 font-medium leading-relaxed opacity-80">
              مشروع DXN ليس مجرد بيع منتجات، بل هو "نظام ذكي" لبناء عمل حر بدون رأس مال وبدعم كامل من فريقنا.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 mb-24">
            <div className="bg-white/10 backdrop-blur-md p-10 rounded-[3rem] border border-white/20 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 bg-green-400 text-green-900 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                <GraduationCap size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4">تدريبات مجانية</h3>
              <p className="text-green-100 font-bold leading-relaxed opacity-70">سوف أتولى تدريبك شخصياً عبر جلسات أونلاين مجانية لتعلم فنون التسويق وجذب العملاء باحترافية.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-10 rounded-[3rem] border border-white/20 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 bg-green-400 text-green-900 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4">دخل متنامي</h3>
              <p className="text-green-100 font-bold leading-relaxed opacity-70">ابدأ بعمولات بسيطة وشاهد دخلك ينمو ليصل لمئات الدولارات مع توسع فريقك وجهدك الشخصي المستمر.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-10 rounded-[3rem] border border-white/20 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 bg-green-400 text-green-900 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                <Clock size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4">حرية كاملة</h3>
              <p className="text-green-100 font-bold leading-relaxed opacity-70">لا يوجد مدير، لا يوجد التزام بساعات محددة. اعمل من هاتفك، في أي مكان وفي أي وقت يناسبك.</p>
            </div>
          </div>

          <div className="bg-white rounded-[4rem] p-12 md:p-20 text-center text-gray-900 shadow-3xl">
            <h3 className="text-4xl md:text-5xl font-black mb-8">هل أنت مستعد لتغيير حياتك؟</h3>
            <p className="text-2xl text-gray-500 mb-12 font-medium">ابدأ الآن معي، التدريب مجاني تماماً ولا تحتاج لأي خبرة سابقة.</p>
            <button 
              onClick={handleJoinTeam}
              className="px-16 py-8 bg-green-700 text-white rounded-[2.5rem] text-2xl font-black shadow-2xl hover:bg-green-800 transition-all flex items-center justify-center gap-6 mx-auto group"
            >
              انضم لفريقي الآن مجاناً <ArrowRight size={32} className="rotate-180 group-hover:-translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* CART OVERLAY */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-10 animate-slide-left border-l border-gray-100">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-4">
                <ShoppingCart size={36} className="text-green-700" />
                <h2 className="text-4xl font-black text-gray-900">طلبياتك</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-4 hover:bg-gray-100 rounded-full transition-all"><X size={36} /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-40">
                  <ShoppingBag size={80} className="text-gray-100 mx-auto mb-8" />
                  <p className="text-gray-400 font-black text-2xl">سلة مشترياتك فارغة</p>
                </div>
              ) : (
                cart.map(item => {
                  const product = PRODUCTS.find(p => p.id === item.productId);
                  if (!product) return null;
                  const price = isMember ? product.priceMember : product.priceNonMember;
                  return (
                    <div key={item.productId} className="flex gap-6 items-center bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100">
                      <img src={product.image} className="w-24 h-24 rounded-2xl object-cover shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-gray-900 text-lg truncate mb-2">{product.name}</h4>
                        <p className="text-green-700 font-black text-2xl">{price}$</p>
                        <div className="flex items-center gap-4 mt-3">
                          <button onClick={() => updateQuantity(item.productId, -1)} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400"><Minus size={18} /></button>
                          <span className="font-black text-xl">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, 1)} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400"><Plus size={18} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="mt-12 border-t border-gray-100 pt-10">
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <p className="text-gray-400 font-bold mb-1">الإجمالي الكلي للطلب</p>
                    <span className="text-6xl font-black text-green-800 leading-none">{cartTotal.toFixed(2)}$</span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-10">
                  <div className="flex items-center justify-between p-6 bg-green-50 rounded-3xl border-2 border-green-100 shadow-inner">
                    <span className="font-black text-green-900 text-lg">تفعيل سعر العضو (تخفيض)</span>
                    <button 
                      onClick={() => setIsMember(!isMember)}
                      className={`relative inline-flex h-10 w-18 items-center rounded-full transition-all ${isMember ? 'bg-green-600' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${isMember ? 'translate-x-1' : 'translate-x-9'}`} />
                    </button>
                  </div>
                  <input type="text" placeholder="عنوان التوصيل الكامل" className="w-full p-6 bg-gray-50 rounded-3xl border-none focus:ring-4 focus:ring-green-100 font-bold text-lg" value={deliveryDetails.address} onChange={(e) => setDeliveryDetails({...deliveryDetails, address: e.target.value})} />
                  <input type="tel" placeholder="رقم هاتفك للتواصل" className="w-full p-6 bg-gray-50 rounded-3xl border-none focus:ring-4 focus:ring-green-100 font-bold text-lg" value={deliveryDetails.phone} onChange={(e) => setDeliveryDetails({...deliveryDetails, phone: e.target.value})} />
                </div>
                
                <button onClick={generateInvoiceMessage} className="w-full py-7 bg-green-700 text-white rounded-[2.5rem] text-2xl font-black shadow-2xl hover:bg-green-800 transition-all flex items-center justify-center gap-5 active:scale-95">
                  <MessageCircle size={36} /> إتمام الطلب عبر واتساب
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white py-24 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-6 mb-12">
             <div className="w-20 h-20 overflow-hidden flex items-center justify-center p-3 border-2 border-green-50 rounded-[1.5rem] bg-white shadow-lg">
              <img src={DXN_LOGO_URL} alt="DXN Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-4xl font-black text-gray-900 tracking-tighter">DXN Official</span>
          </div>
          <div className="max-w-2xl mx-auto mb-16">
            <p className="text-gray-400 font-bold text-xl leading-relaxed mb-4">المندوب الموزع المعتمد والمدرب المعتمد: </p>
            <span className="text-gray-900 font-black text-5xl block underline decoration-green-500 decoration-8 underline-offset-[12px]">مصطفى موسى</span>
          </div>
          <div className="flex justify-center gap-8 mb-16">
            <a href="#" className="p-6 bg-blue-50 text-blue-600 rounded-[2rem] hover:bg-blue-100 transition-all shadow-sm hover:scale-110"><Facebook size={36} /></a>
            <a href="#" className="p-6 bg-pink-50 text-pink-600 rounded-[2rem] hover:bg-pink-100 transition-all shadow-sm hover:scale-110"><Instagram size={36} /></a>
            <button onClick={() => openWhatsApp("مرحباً أستاذ مصطفى")} className="p-6 bg-green-50 text-green-600 rounded-[2rem] hover:bg-green-100 transition-all shadow-sm hover:scale-110"><MessageCircle size={36} /></button>
          </div>
          <p className="text-gray-300 text-sm font-black uppercase tracking-[0.5em]">© 2024 MUSTAFA MOUSSA - DXN LEADER</p>
        </div>
      </footer>

      {/* Floating Action Cart Button for Mobile */}
      <div className="fixed bottom-10 left-10 z-[150] md:hidden">
        <button 
          onClick={() => setIsCartOpen(true)}
          className="bg-green-700 text-white p-6 rounded-full shadow-2xl border-4 border-white relative active:scale-90 transition-transform"
        >
          <ShoppingCart size={32} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-white font-black">
              {cart.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
