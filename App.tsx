
import React, { useState, useEffect, useMemo } from 'react';
import Customizer from './components/Customizer';
import { 
  ShoppingBag, Menu, X, ArrowRight, Instagram, Facebook, Sun, Moon, 
  Edit3, Image as ImageIcon, CreditCard, CheckCircle2, ChevronLeft, Banknote, 
  Package, Clock, User as UserIcon, LogOut, Mail, Lock, Plus, DollarSign, 
  ListOrdered, Trash2, Settings, Users as UsersIcon, ShieldCheck, 
  Search, Phone, HelpCircle, Filter, Save, LayoutGrid, Globe, MapPin, ExternalLink
} from 'lucide-react';
import { PageType, CartItem, Order, User, Product, COLORS, SIZES, Language, AdminSettings, INITIAL_DESIGN } from './types';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.88-.64-1.61-1.47-2.11-2.42v6.48c.01 1.08-.2 2.15-.62 3.14-.54 1.19-1.48 2.22-2.61 2.87-1.48.81-3.23.95-4.8.44-1.57-.48-2.9-1.64-3.56-3.11-.74-1.56-.63-3.41.3-4.87.87-1.45 2.5-2.38 4.19-2.36.21 0 .42.02.63.05v4.11c-.46-.17-.96-.19-1.42-.05-.8.25-1.39.99-1.39 1.84.01 1.15 1.13 1.99 2.25 1.67.63-.16 1.12-.66 1.25-1.3.06-.37.06-.75.05-1.12V.02z" />
  </svg>
);

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [adminTab, setAdminTab] = useState<'inventory' | 'orders' | 'users' | 'settings'>('inventory');
  
  // Persisted Data
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('threadify_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('threadify_all_users');
    return saved ? JSON.parse(saved) : [
      { email: 'admin@threadify.com', password: 'admin', name: 'Admin', role: 'admin', joinedDate: new Date().toLocaleDateString(), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' }
    ];
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('threadify_admin_settings');
    return saved ? JSON.parse(saved) : {
      email: 'admin@threadify.com',
      password: 'admin',
      instagram: 'https://instagram.com/threadify',
      facebook: 'https://facebook.com/threadify',
      tiktok: 'https://tiktok.com/@threadify',
      supportEmail: 'support@threadify.com'
    };
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('threadify_products');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Premium Heavyweight Hoodie', price: 65, type: 'hoodie', stock: 100, availableSizes: ['M', 'L', 'XL'] },
      { id: '2', title: 'Boxy Fit Essential Tee', price: 35, type: 'tshirt', stock: 200, availableSizes: ['S', 'M', 'L'] },
    ];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('threadify_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // UI States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  const [authError, setAuthError] = useState('');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingInfo, setShippingInfo] = useState({ fullName: '', phone: '', address: '', city: '', zip: '' });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItemForm, setNewItemForm] = useState({ title: '', price: '45', type: 'hoodie' as any, stock: '50', sizes: ['M'] as any, image: null as string | null, backImage: null as string | null });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // CC Handlers
  const [ccNumber, setCcNumber] = useState('');
  const [ccExpiry, setCcExpiry] = useState('');
  const [ccCvc, setCcCvc] = useState('');

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    return { revenue, orderCount: orders.length };
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('threadify_products', JSON.stringify(products));
    localStorage.setItem('threadify_orders', JSON.stringify(orders));
    localStorage.setItem('threadify_all_users', JSON.stringify(allUsers));
    localStorage.setItem('threadify_admin_settings', JSON.stringify(adminSettings));
    if (user) localStorage.setItem('threadify_user', JSON.stringify(user));
    else localStorage.removeItem('threadify_user');
  }, [products, orders, allUsers, user, adminSettings]);

  useEffect(() => {
    const isLocked = isAuthModalOpen || isCartOpen || isMobileMenuOpen || isAddItemModalOpen;
    document.body.style.overflow = isLocked ? 'hidden' : 'auto';
    document.body.style.backgroundColor = isDark ? '#000000' : '#ffffff';
    document.body.style.color = isDark ? '#ffffff' : '#000000';
  }, [isDark, isAuthModalOpen, isCartOpen, isMobileMenuOpen, isAddItemModalOpen]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (authMode === 'signup') {
      if (allUsers.find(u => u.email === authForm.email)) {
        setAuthError('Email already exists');
        return;
      }
      const newUser: User = { 
        email: authForm.email, 
        password: authForm.password, 
        name: authForm.name, 
        role: 'user', 
        joinedDate: new Date().toLocaleDateString(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authForm.email}`
      };
      setAllUsers([...allUsers, newUser]);
      setUser(newUser);
      setIsAuthModalOpen(false);
    } else {
      const found = allUsers.find(u => u.email === authForm.email);
      if (!found) { setAuthError('Incorrect Email'); return; }
      if (found.password !== authForm.password) { setAuthError('Incorrect Password'); return; }
      setUser(found);
      setIsAuthModalOpen(false);
    }
  };

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (item: CartItem) => {
    if (!user) { 
      setIsAuthModalOpen(true); 
      setAuthMode('signin'); 
      return; 
    }
    setCart(prev => {
      if (editingItem) return prev.map(i => i.id === editingItem.id ? { ...item, id: editingItem.id } : i);
      return [...prev, { ...item, id: Math.random().toString(36).substr(2, 9) }];
    });
    setEditingItem(null);
    setCheckoutStep('cart');
    setIsCartOpen(true);
  };

  const handleEditCartItem = (item: CartItem) => {
    setEditingItem(item);
    setIsCartOpen(false);
    navigateTo('studio');
  };

  const customizeShopItem = (p: Product) => {
    const item: CartItem = {
      id: p.id,
      garmentType: p.type,
      color: COLORS[1],
      size: p.availableSizes[0] || 'M',
      price: p.price,
      frontDesign: { ...INITIAL_DESIGN },
      backDesign: { ...INITIAL_DESIGN },
      baseImageFront: p.image || null,
      baseImageBack: p.backImage || null,
      view: 'front'
    };
    setEditingItem(item);
    navigateTo('studio');
  };

  const finalizeOrder = () => {
    const newOrder: Order = {
      id: `THR-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      userId: user!.email,
      date: new Date().toLocaleDateString(),
      items: [...cart],
      shipping: { ...shippingInfo },
      paymentMethod,
      total: cart.reduce((acc, i) => acc + i.price, 0),
      status: 'Processing'
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setCheckoutStep('success');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isBack = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (editingProduct) {
          if (isBack) setEditingProduct({...editingProduct, backImage: result});
          else setEditingProduct({...editingProduct, image: result});
        } else {
          if (isBack) setNewItemForm({ ...newItemForm, backImage: result });
          else setNewItemForm({ ...newItemForm, image: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCcNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 16);
    setCcNumber(val.replace(/(.{4})/g, '$1 ').trim());
  };
  const handleCcExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) val = val.substring(0, 2) + '/' + val.substring(2);
    setCcExpiry(val);
  };
  const handleCcCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCcCvc(e.target.value.replace(/\D/g, '').substring(0, 3));
  };

  const navItems = [
    { label: 'SHOP', id: 'shop' },
    { label: 'STUDIO', id: 'studio' },
    { label: 'TRACK', id: 'track' },
    { label: 'SUPPORT', id: 'support' },
    ...(user?.role === 'admin' ? [{ label: 'ADMIN', id: 'admin' }] : []),
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${isDark ? 'dark bg-black text-white' : 'bg-white text-black'}`}>
      {/* HEADER */}
      <header className={`fixed top-0 inset-x-0 h-24 z-[100] border-b ${isDark ? 'bg-black/90 border-white/10' : 'bg-white/90 border-black/5'} backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-10">
            <button onClick={() => navigateTo('home')} className="flex items-center gap-3">
              <div className={`w-10 h-10 ${isDark ? 'bg-white text-black' : 'bg-black text-white'} rounded flex items-center justify-center font-black italic text-xl`}>T</div>
              <span className="hidden sm:block heading-font text-2xl font-black tracking-tighter uppercase">THREADIFY</span>
            </button>
            <nav className="hidden lg:flex gap-8">
              {navItems.map(item => (
                <button key={item.id} onClick={() => navigateTo(item.id as PageType)} className={`text-[10px] font-black uppercase tracking-widest hover:opacity-100 transition-opacity ${currentPage === item.id ? 'opacity-100 border-b border-current' : 'opacity-40'}`}>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsDark(!isDark)} className="p-2 opacity-60 hover:opacity-100">{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
            {user ? (
              <div className="relative">
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="w-10 h-10 rounded-full border-2 border-blue-500 overflow-hidden shadow-lg"><img src={user.avatar} className="w-full h-full object-cover" /></button>
                {isUserMenuOpen && (
                  <div className={`absolute top-full right-0 mt-4 w-52 py-2 rounded-2xl border ${isDark ? 'bg-black border-white/10 shadow-2xl' : 'bg-white border-black/5 shadow-xl'} z-[120]`}>
                    <div className="px-5 py-3 border-b border-current/5"><div className="text-[9px] font-black uppercase opacity-40">{user.role}</div><div className="text-xs font-black truncate">{user.name}</div></div>
                    <button onClick={() => { setUser(null); setIsUserMenuOpen(false); navigateTo('home'); }} className="w-full px-5 py-3 flex items-center gap-3 text-red-500 text-[9px] font-black uppercase hover:bg-red-500/5 transition-colors"><LogOut size={14} /> LOGOUT</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => { setAuthMode('signin'); setIsAuthModalOpen(true); }} className="hidden sm:flex px-6 py-2.5 rounded-full border-2 border-current text-[10px] font-black tracking-widest">SIGN IN</button>
            )}
            <button onClick={() => { setCheckoutStep('cart'); setIsCartOpen(true); }} className="relative p-2"><ShoppingBag size={20} />{cart.length > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-blue-600 text-[8px] font-black rounded-full flex items-center justify-center text-white">{cart.length}</span>}</button>
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2"><Menu size={24} /></button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex flex-col p-10 lg:hidden text-white animate-fade-in">
          <div className="flex justify-between items-center mb-16">
            <span className="heading-font text-2xl font-black uppercase">THREADIFY</span>
            <button onClick={() => setIsMobileMenuOpen(false)}><X size={32} /></button>
          </div>
          <nav className="flex flex-col gap-6">
            {navItems.map(item => (
              <button key={item.id} onClick={() => navigateTo(item.id as PageType)} className="text-4xl font-black uppercase tracking-tighter text-left hover:text-blue-500 transition-colors">{item.label}</button>
            ))}
          </nav>
        </div>
      )}

      {/* PAGE CONTENT */}
      <main className="flex-1 pt-24 pb-32">
        {currentPage === 'home' && (
          <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-8 heading-font animate-fade-in">ART FOR THE <br/><span className="italic opacity-20 relative">HUMAN FORM<div className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600 opacity-50 blur-sm rounded-full" /></span></h1>
            <p className="max-w-2xl text-lg opacity-40 font-medium mb-12 uppercase tracking-widest">The premier ecosystem for custom streetwear engineering.</p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button onClick={() => navigateTo('shop')} className="bg-blue-600 text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Vault Shop</button>
              <button onClick={() => navigateTo('studio')} className="border-2 border-current/10 px-12 py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-current/5 transition-all">Studio Lab</button>
            </div>
          </section>
        )}

        {currentPage === 'shop' && (
          <div className="max-w-7xl mx-auto px-6 py-24 animate-fade-in">
             <div className="mb-20 border-b border-current/10 pb-10">
                <h2 className="text-7xl font-black heading-font uppercase tracking-tighter">Vault</h2>
                <p className="text-[10px] font-black uppercase opacity-40 mt-4 tracking-[0.4em]">Curated silhouettes</p>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                {products.map(p => (
                  <div key={p.id} className="group cursor-pointer">
                     <div className={`aspect-[3/4] ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} border-2 rounded-[40px] overflow-hidden relative transition-all group-hover:-translate-y-2`}>
                        {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center opacity-10"><Package size={80} strokeWidth={1} /></div>}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-8 transition-opacity backdrop-blur-sm">
                           <button onClick={() => customizeShopItem(p)} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl">Customize Design</button>
                        </div>
                     </div>
                     <div className="mt-6 flex justify-between items-start px-4">
                        <div><h3 className="font-black text-xs uppercase tracking-widest">{p.title}</h3><p className="text-[9px] font-black opacity-30 mt-2">{p.type} / {p.stock} units left</p></div>
                        <span className="font-mono font-black text-lg">${p.price}</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {currentPage === 'studio' && <Customizer isDark={isDark} onAddToCart={addToCart} editItem={editingItem} />}

        {currentPage === 'track' && (
          <div className="max-w-4xl mx-auto px-6 py-24 animate-fade-in">
             <h2 className="text-6xl font-black uppercase tracking-tighter mb-20 heading-font">Tracking Logs</h2>
             {!user ? (
               <div className="py-20 text-center opacity-40 font-black border-2 border-dashed border-current/10 rounded-[40px] flex flex-col items-center gap-6"><ShieldCheck size={48} /> Authorize session to track drops</div>
             ) : orders.filter(o => o.userId === user?.email).length === 0 ? (
               <div className="py-20 text-center opacity-20 font-black border-2 border-dashed border-current/10 rounded-[40px]">No active drops in registry</div>
             ) : (
               <div className="space-y-10">
                 {orders.filter(o => o.userId === user?.email).map(o => (
                   <div key={o.id} className={`p-10 border-2 rounded-[40px] ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} space-y-10`}>
                      <div className="flex justify-between items-end border-b border-current/5 pb-8">
                         <div><div className="text-[9px] font-black uppercase opacity-40">Drop ID</div><div className="text-3xl font-mono font-black">{o.id}</div></div>
                         <div className="text-right"><div className="text-xs font-black text-blue-500 uppercase mb-2">{o.status}</div><div className="font-mono font-black text-xl">${o.total}</div></div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((s, i) => {
                          const active = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].indexOf(o.status) >= i;
                          return <div key={s} className="space-y-3"><div className={`h-1.5 rounded-full ${active ? 'bg-blue-600' : 'bg-current/10'}`} /><div className={`text-[8px] font-black uppercase ${active ? 'opacity-100' : 'opacity-20'}`}>{s}</div></div>;
                        })}
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {currentPage === 'support' && (
          <div className="max-w-4xl mx-auto px-6 py-24 space-y-20 animate-fade-in">
             <div className="text-center"><h2 className="text-7xl font-black heading-font uppercase">Support</h2><p className="text-lg opacity-40 uppercase tracking-widest mt-4">The laboratory is standing by.</p></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className={`p-10 rounded-[40px] border-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} space-y-6`}>
                   <Mail className="text-blue-500" size={32} /><h3 className="text-xl font-black uppercase">Direct Comms</h3><p className="text-xs opacity-50">Reach out for technical or logistical engineering assistance.</p>
                   <a href={`mailto:${adminSettings.supportEmail}`} className="block text-blue-500 font-mono font-black">{adminSettings.supportEmail}</a>
                </div>
                <div className={`p-10 rounded-[40px] border-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} space-y-6`}>
                   <Phone className="text-blue-500" size={32} /><h3 className="text-xl font-black uppercase">Help Center</h3><p className="text-xs opacity-50">Automated systems regarding common apparel engineering questions.</p>
                   <button className="text-[10px] font-black uppercase bg-current text-current-inverse px-6 py-3 rounded-xl tracking-widest">Open Docs</button>
                </div>
             </div>
          </div>
        )}

        {currentPage === 'admin' && user?.role === 'admin' && (
          <div className="max-w-7xl mx-auto px-6 py-24 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-10">
                <h2 className="text-7xl font-black heading-font uppercase">Command</h2>
                <div className="flex gap-4">
                  <div className="bg-blue-600 px-8 py-4 rounded-3xl text-white shadow-2xl"><span className="text-[9px] font-black uppercase opacity-60">Global Revenue</span><div className="text-2xl font-mono font-black">${stats.revenue}</div></div>
                  <div className="bg-current/5 border border-current/10 px-8 py-4 rounded-3xl shadow-sm"><span className="text-[9px] font-black uppercase opacity-30">Active Drops</span><div className="text-2xl font-mono font-black">{stats.orderCount}</div></div>
                </div>
             </div>
             <div className="flex gap-10 border-b border-current/10 mb-12 overflow-x-auto pb-1">
               {['inventory', 'orders', 'users', 'settings'].map(tab => (
                 <button key={tab} onClick={() => setAdminTab(tab as any)} className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${adminTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'opacity-40 hover:opacity-100'}`}>{tab}</button>
               ))}
             </div>

             {adminTab === 'inventory' && (
               <div className="space-y-12 animate-fade-in">
                 <div className="flex justify-between items-center"><h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3"><LayoutGrid size={20} /> Archive</h3><button onClick={() => { setEditingProduct(null); setIsAddItemModalOpen(true); }} className="bg-current text-current-inverse px-6 py-3 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:scale-105 transition-all"><Plus size={16} /> Create Drop</button></div>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {products.map(p => (
                      <div key={p.id} className={`p-8 rounded-[40px] border-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/10'} space-y-6 relative group transition-all hover:border-blue-500/50 shadow-xl`}>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 z-10">
                            <button onClick={() => { setEditingProduct(p); setIsAddItemModalOpen(true); }} className="text-blue-500 p-2 bg-white/10 rounded-lg"><Edit3 size={18} /></button>
                            <button onClick={() => setProducts(products.filter(pr => pr.id !== p.id))} className="text-red-500 p-2 bg-white/10 rounded-lg"><Trash2 size={18} /></button>
                         </div>
                         <div className="aspect-square bg-current/5 rounded-2xl overflow-hidden mb-4">{p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <ImageIcon size={40} className="opacity-10 m-auto" />}</div>
                         <h4 className="font-black text-xs uppercase tracking-widest truncate">{p.title}</h4>
                         <div className="flex justify-between items-end"><span className="font-mono font-black text-lg">${p.price}</span></div>
                      </div>
                    ))}
                 </div>
               </div>
             )}

             {adminTab === 'orders' && (
               <div className="space-y-6 animate-fade-in">
                 {orders.map(o => (
                   <div key={o.id} className={`p-8 rounded-[40px] border-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-black/10'} flex flex-col md:flex-row justify-between items-center gap-8`}>
                      <div className="flex gap-6 items-center">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white">#{o.id.split('-')[1]}</div>
                        <div><div className="text-base font-black uppercase">{o.shipping.fullName}</div><div className="text-[10px] opacity-40 uppercase">{o.date} • {o.items.length} Units</div></div>
                      </div>
                      <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                        <select value={o.status} onChange={(e) => setOrders(orders.map(or => or.id === o.id ? {...or, status: e.target.value as any} : or))} className="px-6 py-4 rounded-xl text-[10px] font-black uppercase bg-transparent border border-current/20 outline-none"><option value="Processing">Processing</option><option value="Shipped">Shipped</option><option value="Out for Delivery">Out for Delivery</option><option value="Delivered">Delivered</option></select>
                        <span className="font-mono font-black text-2xl">${o.total}</span>
                      </div>
                   </div>
                 ))}
               </div>
             )}

             {adminTab === 'users' && (
               <div className={`overflow-hidden border rounded-[40px] ${isDark ? 'border-white/10' : 'border-black/10'} animate-fade-in`}>
                  <table className="w-full text-left">
                     <thead className={isDark ? 'bg-white/5' : 'bg-gray-100'}><tr className="text-[10px] font-black uppercase opacity-40"><th className="p-8">Identity</th><th className="p-8">Joined</th><th className="p-8">Role</th></tr></thead>
                     <tbody className="divide-y divide-current/5">
                        {allUsers.map(u => (
                          <tr key={u.email} className="hover:bg-blue-600/5 transition-colors">
                             <td className="p-8 flex items-center gap-4"><img src={u.avatar} className="w-12 h-12 rounded-full border-2 border-blue-500" /><div><div className="text-sm font-black uppercase">{u.name}</div><div className="text-[10px] opacity-40">{u.email}</div></div></td>
                             <td className="p-8 font-mono text-[10px] opacity-40">{u.joinedDate}</td>
                             <td className="p-8"><span className="px-4 py-2 rounded-xl text-[9px] font-black uppercase bg-blue-600/10 text-blue-600">{u.role}</span></td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
             )}

             {adminTab === 'settings' && (
               <div className="max-w-xl space-y-12 animate-fade-in">
                  <section className="space-y-6">
                    <div className="flex items-center gap-4 border-b border-current/5 pb-4"><Settings size={24}/><h3 className="text-2xl font-black uppercase tracking-tighter">Laboratory Params</h3></div>
                    <div className="space-y-4">
                       <div className="space-y-1"><label className="text-[9px] font-black uppercase opacity-40 ml-2">Admin Alias</label><input type="email" value={adminSettings.email} onChange={e => setAdminSettings({...adminSettings, email: e.target.value})} className={`w-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} border-2 rounded-2xl px-6 py-5 font-bold outline-none focus:border-blue-600`} /></div>
                       <div className="space-y-1"><label className="text-[9px] font-black uppercase opacity-40 ml-2">Master Key</label><input type="password" value={adminSettings.password} onChange={e => setAdminSettings({...adminSettings, password: e.target.value})} className={`w-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} border-2 rounded-2xl px-6 py-5 font-bold outline-none focus:border-blue-600`} /></div>
                    </div>
                  </section>
                  <section className="space-y-6">
                    <div className="flex items-center gap-4 border-b border-current/5 pb-4"><Globe size={24}/><h3 className="text-2xl font-black uppercase tracking-tighter">Social Channels</h3></div>
                    <div className="space-y-4">
                       <div className="space-y-1"><label className="text-[9px] font-black uppercase opacity-40 ml-2">Instagram Link</label><input type="text" value={adminSettings.instagram} onChange={e => setAdminSettings({...adminSettings, instagram: e.target.value})} className={`w-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} border-2 rounded-2xl px-6 py-5 font-bold outline-none focus:border-blue-600`} /></div>
                       <div className="space-y-1"><label className="text-[9px] font-black uppercase opacity-40 ml-2">Direct Support Email</label><input type="email" value={adminSettings.supportEmail} onChange={e => setAdminSettings({...adminSettings, supportEmail: e.target.value})} className={`w-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} border-2 rounded-2xl px-6 py-5 font-bold outline-none focus:border-blue-600`} /></div>
                    </div>
                  </section>
                  <button onClick={() => alert('Params synchronized.')} className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">Synchronize Laboratory</button>
               </div>
             )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className={`py-32 border-t mt-auto ${isDark ? 'bg-black border-white/10 text-white' : 'bg-white border-black/5 text-black'}`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20">
           <div className="space-y-10">
              <span className="heading-font text-3xl font-black tracking-tighter uppercase italic">THREADIFY</span>
              <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em] leading-loose max-w-xs">The premier ecosystem for custom streetwear engineering.</p>
              <div className="flex gap-8 opacity-40 hover:opacity-100 transition-opacity">
                 <a href={adminSettings.instagram} target="_blank" rel="noreferrer" className="hover:text-blue-500 hover:scale-110 transition-all"><Instagram size={24} /></a>
                 <a href={adminSettings.facebook} target="_blank" rel="noreferrer" className="hover:text-blue-500 hover:scale-110 transition-all"><Facebook size={24} /></a>
                 <a href={adminSettings.tiktok} target="_blank" rel="noreferrer" className="hover:text-blue-500 hover:scale-110 transition-all"><TikTokIcon /></a>
              </div>
           </div>
           <nav className="flex flex-col gap-6 text-[10px] font-black uppercase tracking-[0.4em]">
              <span className="opacity-10 mb-2">Explore Lab</span>
              {navItems.map(item => <button key={item.id} onClick={() => navigateTo(item.id as PageType)} className="text-left hover:text-blue-500 transition-colors">{item.label}</button>)}
           </nav>
           <div className="flex flex-col gap-6 text-[10px] font-black uppercase tracking-[0.4em]">
              <span className="opacity-10 mb-2">Synthesis</span>
              <button onClick={() => navigateTo('support')} className="text-left hover:text-blue-500 transition-colors">Support</button>
              <a href={`mailto:${adminSettings.supportEmail}`} className="text-left hover:text-blue-500 transition-colors truncate">Direct Link</a>
           </div>
           <div className="flex flex-col gap-6 text-[10px] font-black uppercase tracking-[0.4em]">
              <span className="opacity-10 mb-2">Legal</span>
              <button className="text-left opacity-40">Privacy Policy</button>
              <button className="text-left opacity-40">Terms of Synth</button>
           </div>
        </div>
      </footer>

      {/* MODALS: AUTH */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={() => setIsAuthModalOpen(false)} />
          <div className={`relative w-full max-w-md ${isDark ? 'bg-black border-white/10 text-white' : 'bg-white border-black/10 text-black'} border-2 rounded-[50px] p-12 shadow-2xl animate-fade-in`}>
            <div className="flex gap-4 mb-10 border-b border-current/5">
              <button onClick={() => setAuthMode('signin')} className={`flex-1 pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'signin' ? 'border-b-2 border-blue-600 text-blue-600' : 'opacity-40 hover:opacity-100'}`}>Sign In</button>
              <button onClick={() => setAuthMode('signup')} className={`flex-1 pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'signup' ? 'border-b-2 border-blue-600 text-blue-600' : 'opacity-40 hover:opacity-100'}`}>Sign Up</button>
            </div>
            <form onSubmit={handleAuth} className="space-y-6">
               {authMode === 'signup' && <div className="space-y-1"><label className="text-[9px] font-black uppercase opacity-40 tracking-widest ml-2">Display Name</label><input type="text" required value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} className={`w-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} border-2 rounded-2xl px-6 py-5 font-bold outline-none focus:border-blue-600`} /></div>}
               <div className="space-y-1"><label className="text-[9px] font-black uppercase opacity-40 tracking-widest ml-2">Email Address</label><input type="email" required value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} className={`w-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} border-2 rounded-2xl px-6 py-5 font-bold outline-none focus:border-blue-600`} /></div>
               <div className="space-y-1"><label className="text-[9px] font-black uppercase opacity-40 tracking-widest ml-2">Password</label><input type="password" required value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} className={`w-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} border-2 rounded-2xl px-6 py-5 font-bold outline-none focus:border-blue-600`} /></div>
               {authError && <p className="text-red-500 text-[10px] font-black uppercase text-center font-mono tracking-tighter bg-red-500/5 p-3 rounded-xl border border-red-500/10">{authError}</p>}
               <button type="submit" className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>{authMode === 'signin' ? 'Unlock Session' : 'Register Identity'}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODALS: ADD ITEM */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 text-white animate-fade-in">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setIsAddItemModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-black border border-white/10 rounded-[50px] p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-4xl font-black uppercase tracking-tighter heading-font">{editingProduct ? 'Edit Spec' : 'Create Drop'}</h2>
               <button onClick={() => setIsAddItemModalOpen(false)} className="opacity-40 hover:opacity-100 hover:rotate-90 transition-all"><X size={32}/></button>
            </div>
            <form onSubmit={handleAddItem} className="space-y-8">
               <div className="space-y-6">
                 <div className="space-y-1"><label className="text-[9px] font-black uppercase opacity-40 tracking-widest ml-2">Item Label</label><input type="text" required value={editingProduct ? editingProduct.title : newItemForm.title} onChange={e => editingProduct ? setEditingProduct({...editingProduct, title: e.target.value}) : setNewItemForm({...newItemForm, title: e.target.value})} className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-5 font-bold outline-none focus:border-blue-600" /></div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-[9px] font-black uppercase opacity-40 tracking-widest ml-2">Rate ($)</label><input type="number" required value={editingProduct ? editingProduct.price : newItemForm.price} onChange={e => editingProduct ? setEditingProduct({...editingProduct, price: parseFloat(e.target.value)}) : setNewItemForm({...newItemForm, price: e.target.value})} className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-5 font-bold outline-none focus:border-blue-600" /></div>
                    <div className="space-y-1"><label className="text-[9px] font-black uppercase opacity-40 tracking-widest ml-2">Stock</label><input type="number" required value={editingProduct ? editingProduct.stock : newItemForm.stock} onChange={e => editingProduct ? setEditingProduct({...editingProduct, stock: parseInt(e.target.value)}) : setNewItemForm({...newItemForm, stock: e.target.value})} className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-5 font-bold outline-none focus:border-blue-600" /></div>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1"><label className="text-[9px] font-black uppercase opacity-40 tracking-widest ml-2">Front Silhouette</label><div className="relative h-48 border-2 border-dashed border-white/10 rounded-[30px] flex items-center justify-center overflow-hidden hover:border-blue-600 transition-colors">{(editingProduct?.image || newItemForm.image) ? <img src={editingProduct ? editingProduct.image : (newItemForm.image || '')} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="opacity-10" />}<input type="file" onChange={(e) => handleImageUpload(e)} className="absolute inset-0 opacity-0 cursor-pointer" /></div></div>
                    <div className="space-y-1"><label className="text-[9px] font-black uppercase opacity-40 tracking-widest ml-2">Back Silhouette</label><div className="relative h-48 border-2 border-dashed border-white/10 rounded-[30px] flex items-center justify-center overflow-hidden hover:border-blue-600 transition-colors">{(editingProduct?.backImage || newItemForm.backImage) ? <img src={editingProduct ? editingProduct.backImage : (newItemForm.backImage || '')} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="opacity-10" />}<input type="file" onChange={(e) => handleImageUpload(e, true)} className="absolute inset-0 opacity-0 cursor-pointer" /></div></div>
                 </div>
               </div>
               <button type="submit" className="w-full py-6 rounded-2xl font-black uppercase bg-white text-black shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                 {editingProduct ? 'Commit Changes' : 'Create Drop'}
               </button>
            </form>
          </div>
        </div>
      )}

      {/* CHECKOUT DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[600] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className={`relative w-full max-w-lg h-full shadow-2xl flex flex-col ${isDark ? 'bg-[#050505] text-white' : 'bg-white text-black'} animate-slide-in-right`}>
            <div className="p-10 border-b border-current/5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                 {checkoutStep !== 'cart' && checkoutStep !== 'success' && <button onClick={() => setCheckoutStep(checkoutStep === 'payment' ? 'shipping' : 'cart')} className="opacity-40 hover:opacity-100"><ChevronLeft size={28} /></button>}
                 <h2 className="heading-font text-4xl font-black uppercase tracking-tighter">
                    {checkoutStep === 'cart' ? 'MY STASH' : checkoutStep === 'shipping' ? 'SHIPPING INFO' : checkoutStep === 'payment' ? 'PAYMENT INFO' : 'SUCCESS'}
                 </h2>
               </div>
               <button onClick={() => setIsCartOpen(false)} className="opacity-40 hover:opacity-100 hover:rotate-90 transition-transform"><X size={32} /></button>
            </div>
            <div className="flex-1 p-10 overflow-y-auto space-y-10 custom-scrollbar">
              {checkoutStep === 'cart' && (
                <div className="space-y-8 animate-fade-in">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-8 border-b border-current/5 pb-8">
                       <div className="w-24 h-32 rounded-3xl flex-shrink-0 shadow-xl overflow-hidden" style={{ backgroundColor: item.color.hex }}>
                          {item.baseImageFront ? <img src={item.baseImageFront} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-black/10 mix-blend-overlay" />}
                       </div>
                       <div className="flex-1 flex flex-col justify-between py-2">
                          <div><h4 className="font-black uppercase text-xs">Custom {item.garmentType}</h4><p className="text-[10px] font-black opacity-30 mt-2">{item.size} • {item.color.name}</p></div>
                          <div className="flex justify-between items-end"><span className="font-mono font-black text-2xl tracking-tighter">${item.price}</span><div className="flex gap-5"><button onClick={() => handleEditCartItem(item)} className="text-[10px] font-black text-blue-500 uppercase hover:underline">Edit</button><button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-[10px] font-black text-red-500 uppercase hover:underline">Remove</button></div></div>
                       </div>
                    </div>
                  ))}
                  {cart.length === 0 && <div className="py-20 text-center opacity-20 uppercase font-black">Stash is empty</div>}
                </div>
              )}
              {checkoutStep === 'shipping' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-1"><label className="text-[9px] font-black uppercase opacity-40 ml-2">Full Name</label><input type="text" value={shippingInfo.fullName} onChange={e => setShippingInfo({...shippingInfo, fullName: e.target.value})} className={`w-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} border-2 rounded-2xl px-6 py-5 font-bold outline-none focus:border-blue-600`} /></div>
                  <div className="space-y-1"><label className="text-[9px] font-black uppercase opacity-40 ml-2">Phone Number</label><input type="tel" value={shippingInfo.phone} onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})} className={`w-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} border-2 rounded-2xl px-6 py-5 font-bold outline-none focus:border-blue-600`} /></div>
                  <div className="space-y-1"><label className="text-[9px] font-black uppercase opacity-40 ml-2">City</label><input type="text" value={shippingInfo.city} onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})} className={`w-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} border-2 rounded-2xl px-6 py-5 font-bold outline-none focus:border-blue-600`} /></div>
                  <div className="space-y-1"><label className="text-[9px] font-black uppercase opacity-40 ml-2">Zip Code</label><input type="text" value={shippingInfo.zip} onChange={e => setShippingInfo({...shippingInfo, zip: e.target.value})} className={`w-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} border-2 rounded-2xl px-6 py-5 font-bold outline-none focus:border-blue-600`} /></div>
                </div>
              )}
              {checkoutStep === 'payment' && (
                <div className="space-y-10 animate-fade-in">
                   <div className="space-y-4">
                      <button onClick={() => setPaymentMethod('card')} className={`w-full flex items-center justify-between p-10 border-2 rounded-[40px] transition-all ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-600/5' : 'border-current/10 opacity-40'}`}><span className="font-black uppercase text-sm">Credit Card</span>{paymentMethod === 'card' && <CheckCircle2 size={24} className="text-blue-500" />}</button>
                      <button onClick={() => setPaymentMethod('cod')} className={`w-full flex items-center justify-between p-10 border-2 rounded-[40px] transition-all ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-600/5' : 'border-current/10 opacity-40'}`}><span className="font-black uppercase text-sm">Cash on Delivery</span>{paymentMethod === 'cod' && <CheckCircle2 size={24} className="text-blue-500" />}</button>
                   </div>
                   {paymentMethod === 'card' && (
                     <div className="space-y-6 pt-6 border-t border-current/5">
                       <div className="space-y-2"><label className="text-[9px] font-black uppercase opacity-40 ml-2">Card Number</label><input type="text" placeholder="0000 0000 0000 0000" value={ccNumber} onChange={handleCcNumberChange} className={`w-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} border-2 rounded-2xl px-6 py-5 font-mono font-bold outline-none focus:border-blue-600`} /></div>
                       <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2"><label className="text-[9px] font-black uppercase opacity-40 ml-2">MM / YY</label><input type="text" placeholder="MM/YY" value={ccExpiry} onChange={handleCcExpiryChange} className={`w-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} border-2 rounded-2xl px-6 py-5 font-mono font-bold outline-none focus:border-blue-600`} /></div>
                         <div className="space-y-2"><label className="text-[9px] font-black uppercase opacity-40 ml-2">CVC</label><input type="text" placeholder="000" value={ccCvc} onChange={handleCcCvcChange} className={`w-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} border-2 rounded-2xl px-6 py-5 font-mono font-bold outline-none focus:border-blue-600`} /></div>
                       </div>
                     </div>
                   )}
                </div>
              )}
              {checkoutStep === 'success' && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-12 animate-fade-in">
                   <div className="w-32 h-32 bg-green-500/10 text-green-500 rounded-[40px] flex items-center justify-center"><CheckCircle2 size={64} /></div>
                   <h3 className="text-5xl font-black heading-font uppercase tracking-tighter">Order Success</h3>
                   <button onClick={() => { setIsCartOpen(false); navigateTo('track'); }} className="bg-current text-current-inverse px-12 py-6 rounded-[30px] font-black uppercase tracking-[0.4em] shadow-2xl">Track My Drop</button>
                </div>
              )}
            </div>
            {cart.length > 0 && checkoutStep !== 'success' && (
              <div className="p-10 border-t border-current/5">
                 <button onClick={() => { if (checkoutStep === 'cart') setCheckoutStep('shipping'); else if (checkoutStep === 'shipping') { if(!shippingInfo.fullName || !shippingInfo.phone) { alert('Please fill info'); return; } setCheckoutStep('payment'); } else finalizeOrder(); }} className={`w-full py-7 rounded-[35px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-6 shadow-2xl ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                   {checkoutStep === 'cart' ? 'TO SHIPPING' : checkoutStep === 'shipping' ? 'TO PAYMENT' : 'FINALIZE ORDER'}<ArrowRight size={24} />
                 </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (editingProduct) {
       setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
       setEditingProduct(null);
    } else {
       const np: Product = {
         id: Math.random().toString(36).substr(2, 6),
         title: newItemForm.title,
         price: parseFloat(newItemForm.price),
         type: newItemForm.type,
         stock: parseInt(newItemForm.stock),
         availableSizes: newItemForm.sizes,
         image: newItemForm.image || undefined,
         backImage: newItemForm.backImage || undefined
       };
       setProducts([...products, np]);
    }
    setIsAddItemModalOpen(false);
    setNewItemForm({ title: '', price: '45', type: 'hoodie', stock: '50', sizes: ['M'], image: null, backImage: null });
  }
};

export default App;
