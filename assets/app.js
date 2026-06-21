const products = window.BANUB_PRODUCTS || [];
const money = n => `£${Number(n || 0).toFixed(2)}`;
const productAliases = {
  organiser:'desk-organiser', 'minimal-desk-organiser':'desk-organiser',
  lamp:'ambient-lamp', 'ambient-table-lamp':'ambient-lamp',
  basket:'storage-basket', 'cotton-storage-basket':'storage-basket',
  ceramic:'ceramic-set', 'ceramic-serving-set':'ceramic-set',
  pouch:'carry-pouch', 'everyday-carry-pouch':'carry-pouch',
  bottle:'travel-bottle', 'reusable-travel-bottle':'travel-bottle'
};
function resolveProduct(item){
  if(!item)return null;
  const rawId=String(item.id ?? item.productId ?? item.slug ?? '').trim();
  const id=productAliases[rawId] || rawId;
  const byId=products.find(p=>String(p.id)===id);
  if(byId)return byId;
  if(item.name){const byName=products.find(p=>p.name.toLowerCase()===String(item.name).toLowerCase());if(byName)return byName;}
  if(item.image||item.price||item.name){return {id:id||`saved-${Date.now()}`,name:item.name||'Selected product',price:Number(item.price)||0,image:item.image||'assets/images/prod-organiser.jpg',category:item.category||'other'};}
  return null;
}
function getCart(){
  let raw=[];
  try{raw=JSON.parse(localStorage.getItem('banub_cart')||'[]')}catch(e){raw=[]}
  if(!Array.isArray(raw))raw=[];
  return raw.map(item=>{
    const p=resolveProduct(item);
    if(!p)return null;
    return {id:p.id,qty:Math.max(1,Number(item.qty||item.quantity||1)),name:p.name,price:Number(p.price)||0,image:p.image,category:p.category||''};
  }).filter(Boolean);
}
const saveCart = cart => {localStorage.setItem('banub_cart', JSON.stringify(cart)); updateCartCount();};
function addToCart(id, qty=1){
  const p=resolveProduct({id}); if(!p){toast('Unable to add this product');return;}
  const cart=getCart();
  const amount=Math.max(1,Number(qty)||1);
  const item=cart.find(x=>String(x.id)===String(p.id));
  if(item)item.qty=Number(item.qty||0)+amount;
  else cart.push({id:p.id,qty:amount,name:p.name,price:Number(p.price)||0,image:p.image,category:p.category||''});
  saveCart(cart);
  window.dispatchEvent(new CustomEvent('banub:cart-updated'));
  toast('Added to cart');
}
function removeFromCart(id){saveCart(getCart().filter(x=>x.id!==id));renderCart?.();}
function updateQty(id,qty){const cart=getCart();const item=cart.find(x=>x.id===id);if(item){item.qty=Math.max(1,Number(qty)||1);saveCart(cart);renderCart?.();}}
function updateCartCount(){const c=getCart().reduce((s,x)=>s+Number(x.qty||0),0);document.querySelectorAll('.cart-count').forEach(el=>el.textContent=c)}
function toast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function header(){return `<div class="announcement">Free UK delivery on orders over £60</div><header class="site-header"><div class="container header-inner"><a class="brand-lockup" href="index.html" aria-label="BANUB home"><img class="brand-mark" src="assets/images/logo-mark.png" alt="BANUB logo mark"><img class="brand-wordmark" src="assets/images/logo-wordmark.png" alt="BANUB"></a><nav class="nav" id="mainNav"><a href="index.html">Home</a><a href="shop.html">Shop</a><a href="shop.html?filter=new">New Arrivals</a><a href="about.html">About</a><a href="contact.html">Contact</a></nav><div class="header-actions"><button class="icon-btn" data-open-search aria-label="Search">⌕ <span class="label">Search</span></button><button class="icon-btn" data-open-account aria-label="Account">♙ <span class="label">Account</span></button><a class="icon-btn cart-link" href="cart.html" aria-label="Cart"><svg class="header-cart-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="20" r="1.35"></circle><circle cx="18" cy="20" r="1.35"></circle><path d="M2.5 3.5h2.4l2 10a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.95-1.52L21 7H6.2"></path></svg><span class="label">Cart</span> <span class="cart-count">0</span></a><button class="icon-btn mobile-toggle" id="mobileToggle" aria-label="Menu">☰</button></div></div></header>`}
function footer(){return `<section class="newsletter"><div class="container newsletter-inner"><div><h3>Stay up to date</h3><p>New arrivals, offers and everyday inspiration.</p></div><form class="newsletter-form"><input type="email" required placeholder="Enter your email address"><button class="btn accent">Subscribe</button></form></div></section><footer class="site-footer"><div class="container"><div class="footer-grid"><div><a class="footer-brand" href="index.html" aria-label="BANUB home"><img class="footer-brand-mark" src="assets/images/logo-mark.png" alt="BANUB logo mark"><img class="footer-brand-wordmark" src="assets/images/logo-wordmark.png" alt="BANUB"></a><a class="footer-email" href="mailto:banub.shop@inbox.eu">banub.shop@inbox.eu</a></div><div><h4>Shop</h4><a href="shop.html">All products</a><a href="shop.html?category=home">Home & Living</a><a href="shop.html?category=workspace">Desk & Workspace</a><a href="shop.html?category=accessories">Everyday Accessories</a></div><div><h4>Help</h4><a href="delivery.html">Delivery</a><a href="returns.html">Returns & refunds</a><a href="contact.html">Contact</a><a href="faq.html">FAQ</a></div><div><h4>Legal</h4><a href="privacy.html">Privacy policy</a><a href="terms.html">Terms & conditions</a><a href="cookies.html">Cookie policy</a></div></div><div class="footer-bottom"><span>© 2026 BANUB LTD. All rights reserved.</span><span>Secure checkout · GBP pricing</span></div></div></footer><div class="modal" id="searchModal"><div class="modal-box"><button class="modal-close" data-close-modal>×</button><h2>Search BANUB</h2><input id="searchInput" style="width:100%;padding:14px;border:1px solid var(--line)" placeholder="Search products"><div class="search-results" id="searchResults"></div></div></div><div class="modal" id="accountModal"><div class="modal-box"><button class="modal-close" data-close-modal>×</button><h2>Customer account</h2><p style="color:var(--muted)">Account login is prepared for future integration with your payment or e-commerce platform.</p><form class="form-grid" id="loginForm"><div class="field full"><label>Email</label><input type="email" required></div><div class="field full"><label>Password</label><input type="password" required></div><div class="field full"><button class="btn">Sign in</button></div></form></div></div><div class="support-chat" id="supportChat"><button class="support-chat-toggle" id="supportChatToggle" type="button" aria-label="Open customer support chat"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.4 9.4 0 0 1-3.8-.8L3 20.5l1.5-4.3A8.2 8.2 0 1 1 21 11.5Z"></path><path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01"></path></svg></button><div class="support-chat-panel" id="supportChatPanel" hidden><div class="support-chat-head"><div><strong>Customer support</strong><span>Ask us a question</span></div><button type="button" id="supportChatClose" aria-label="Close chat">×</button></div><div class="support-chat-body"><div class="support-chat-message">Hello! How can we help you today?</div><form id="supportChatForm"><label for="supportChatInput">Your question</label><textarea id="supportChatInput" rows="4" placeholder="Write your question here..." required></textarea><small id="supportChatError"></small><button class="btn accent" type="submit">Send message</button></form><div class="support-chat-success" id="supportChatSuccess" hidden><div class="support-chat-success-icon">✓</div><strong>Message sent</strong><p>Please wait, a member of our team will contact you shortly.</p><button class="btn ghost" type="button" id="supportChatNew">Ask another question</button></div></div></div></div><div class="toast"></div>`}
function injectShell(){const h=document.querySelector('[data-site-header]');const f=document.querySelector('[data-site-footer]');if(h)h.innerHTML=header();if(f)f.innerHTML=footer();updateCartCount();const toggle=document.getElementById('mobileToggle');toggle?.addEventListener('click',()=>document.getElementById('mainNav').classList.toggle('open'));document.querySelectorAll('[data-open-search]').forEach(b=>b.onclick=()=>document.getElementById('searchModal').classList.add('open'));document.querySelectorAll('[data-open-account]').forEach(b=>b.onclick=()=>document.getElementById('accountModal').classList.add('open'));document.querySelectorAll('[data-close-modal]').forEach(b=>b.onclick=()=>b.closest('.modal').classList.remove('open'));document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')}));document.querySelectorAll('.newsletter-form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();form.reset();toast('Thank you for subscribing')}));document.getElementById('loginForm')?.addEventListener('submit',e=>{e.preventDefault();toast('Demo account form submitted');document.getElementById('accountModal').classList.remove('open')});const search=document.getElementById('searchInput');search?.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();const out=document.getElementById('searchResults');out.innerHTML=q?products.filter(p=>p.name.toLowerCase().includes(q)||p.description.toLowerCase().includes(q)).map(p=>`<a class="search-result" href="product.html?id=${p.id}"><img src="${p.image}"><div><strong>${p.name}</strong><div>${money(p.price)}</div></div></a>`).join('')||'<p>No products found.</p>':''});document.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(!b)return;e.preventDefault();addToCart(b.dataset.add,Number(b.dataset.qty||1))});initSupportChat();if(document.getElementById('cartItems'))setTimeout(renderCart,0)}

function initSupportChat(){
  const panel=document.getElementById('supportChatPanel');
  const toggle=document.getElementById('supportChatToggle');
  const close=document.getElementById('supportChatClose');
  const form=document.getElementById('supportChatForm');
  const input=document.getElementById('supportChatInput');
  const error=document.getElementById('supportChatError');
  const success=document.getElementById('supportChatSuccess');
  const again=document.getElementById('supportChatNew');
  if(!panel||!toggle||!form)return;
  const open=()=>{panel.hidden=false;toggle.classList.add('active');setTimeout(()=>input?.focus(),80)};
  const shut=()=>{panel.hidden=true;toggle.classList.remove('active')};
  toggle.addEventListener('click',()=>panel.hidden?open():shut());
  close?.addEventListener('click',shut);
  form.addEventListener('submit',e=>{e.preventDefault();const value=input.value.trim();if(value.length<3){error.textContent='Please enter your question.';input.classList.add('invalid');return}error.textContent='';input.classList.remove('invalid');localStorage.setItem('banub_last_support_question',value);form.hidden=true;success.hidden=false});
  input?.addEventListener('input',()=>{error.textContent='';input.classList.remove('invalid')});
  again?.addEventListener('click',()=>{success.hidden=true;form.hidden=false;form.reset();input.focus()});
}
function productCard(p){return `<article class="product-card" data-category="${p.category}">${p.badge?`<span class="badge">${p.badge}</span>`:''}<a class="image-wrap" href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a><div class="product-card-body"><h3><a href="product.html?id=${p.id}">${p.name}</a></h3><div class="price">${money(p.price)}</div><div class="product-actions"><a class="btn ghost" href="product.html?id=${p.id}">View</a><button class="btn" data-add="${p.id}">Add to cart</button></div></div></article>`}
function renderProductGrid(el,items=products){if(el)el.innerHTML=items.map(productCard).join('')}
function renderCart(){
  const list=document.getElementById('cartItems');if(!list)return;let cart=getCart();
  // Persist the normalised cart only after reading it, without re-entering rendering.
  try{localStorage.setItem('banub_cart',JSON.stringify(cart))}catch(e){}
  list.innerHTML='<div class="cart-loading">Loading your cart…</div>';
  const subtotalEl=document.getElementById('subtotal'),totalEl=document.getElementById('total');
  if(!cart.length){list.innerHTML='<div class="empty-state"><h2>Your cart is empty</h2><p>Discover practical products for everyday living.</p><a class="btn" href="shop.html">Continue shopping</a></div>';subtotalEl.textContent='£0.00';totalEl.textContent='£0.00';return}
  let subtotal=0;
  list.innerHTML=cart.map(i=>{const p=resolveProduct(i)||i;const price=Number(p.price||i.price||0);subtotal+=price*i.qty;return `<article class="cart-item"><a href="product.html?id=${encodeURIComponent(p.id)}"><img src="${p.image}" alt="${p.name}"></a><div><a href="product.html?id=${encodeURIComponent(p.id)}"><strong>${p.name}</strong></a><div class="price">${money(price)}</div><div class="quantity"><button type="button" onclick="updateQty('${p.id}',${i.qty-1})">−</button><input value="${i.qty}" readonly><button type="button" onclick="updateQty('${p.id}',${i.qty+1})">+</button></div></div><div><strong>${money(price*i.qty)}</strong><br><button class="icon-btn" type="button" onclick="removeFromCart('${p.id}')">Remove</button></div></article>`}).join('');
  subtotalEl.textContent=money(subtotal);totalEl.textContent=money(subtotal)
}
window.addEventListener('banub:cart-updated',()=>{updateCartCount();if(document.getElementById('cartItems'))renderCart()});
document.addEventListener('DOMContentLoaded',injectShell);
