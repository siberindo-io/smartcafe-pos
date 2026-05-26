const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
});

const elements = {
  authScreen: document.getElementById('authScreen'),
  appShell: document.getElementById('appShell'),
  mainNav: document.getElementById('mainNav'),
  pageTitle: document.getElementById('pageTitle'),
  pageSubtitle: document.getElementById('pageSubtitle'),
  adminNavLink: document.getElementById('adminNavLink'),
  adminTablesNavLink: document.getElementById('adminTablesNavLink'),
  pageDashboard: document.getElementById('pageDashboard'),
  pagePos: document.getElementById('pagePos'),
  pageOrders: document.getElementById('pageOrders'),
  pageReports: document.getElementById('pageReports'),
  pageSettings: document.getElementById('pageSettings'),
  pageAdmin: document.getElementById('pageAdmin'),
  pageAdminTables: document.getElementById('pageAdminTables'),
  loginForm: document.getElementById('loginForm'),
  loginUsername: document.getElementById('loginUsername'),
  loginPassword: document.getElementById('loginPassword'),
  logoutBtn: document.getElementById('logoutBtn'),
  currentUserLabel: document.getElementById('currentUserLabel'),
  exportRange: document.getElementById('exportRange'),
  exportDate: document.getElementById('exportDate'),
  exportExcelBtn: document.getElementById('exportExcelBtn'),
  reportRange: document.getElementById('reportRange'),
  reportDate: document.getElementById('reportDate'),
  applyReportFilterBtn: document.getElementById('applyReportFilterBtn'),
  resetReportFilterBtn: document.getElementById('resetReportFilterBtn'),
  reportWindowLabel: document.getElementById('reportWindowLabel'),
  currentDate: document.getElementById('currentDate'),
  summaryRevenue: document.getElementById('summaryRevenue'),
  summaryRevenueHint: document.getElementById('summaryRevenueHint'),
  summaryTransactions: document.getElementById('summaryTransactions'),
  summaryActiveOrders: document.getElementById('summaryActiveOrders'),
  summaryBestSeller: document.getElementById('summaryBestSeller'),
  categoryTabs: document.getElementById('categoryTabs'),
  productGrid: document.getElementById('productGrid'),
  productSearch: document.getElementById('productSearch'),
  cartItems: document.getElementById('cartItems'),
  cartTotal: document.getElementById('cartTotal'),
  tableSelect: document.getElementById('tableSelect'),
  checkoutBtn: document.getElementById('checkoutBtn'),
  tableGrid: document.getElementById('tableGrid'),
  tableDetail: document.getElementById('tableDetail'),
  orderHistoryBody: document.getElementById('orderHistoryBody'),
  orderLogPanel: document.getElementById('orderLogPanel'),
  inventoryBody: document.getElementById('inventoryBody'),
  reportTotalRevenue: document.getElementById('reportTotalRevenue'),
  reportTransactions: document.getElementById('reportTransactions'),
  reportMonthly: document.getElementById('reportMonthly'),
  topProducts: document.getElementById('topProducts'),
  salesChart: document.getElementById('salesChart'),
  categoryDonut: document.getElementById('categoryDonut'),
  donutMainValue: document.getElementById('donutMainValue'),
  categoryLegend: document.getElementById('categoryLegend'),
  adminNoAccessPanel: document.getElementById('adminNoAccessPanel'),
  adminSection: document.getElementById('adminSection'),
  menuForm: document.getElementById('menuForm'),
  menuName: document.getElementById('menuName'),
  menuCategory: document.getElementById('menuCategory'),
  menuPrice: document.getElementById('menuPrice'),
  menuStock: document.getElementById('menuStock'),
  menuMinStock: document.getElementById('menuMinStock'),
  menuPhotoUrl: document.getElementById('menuPhotoUrl'),
  menuPhotoFile: document.getElementById('menuPhotoFile'),
  menuIcon: document.getElementById('menuIcon'),
  menuDescription: document.getElementById('menuDescription'),
  menuIsActive: document.getElementById('menuIsActive'),
  menuSubmitBtn: document.getElementById('menuSubmitBtn'),
  menuFormResetBtn: document.getElementById('menuFormResetBtn'),
  menuFormModeLabel: document.getElementById('menuFormModeLabel'),
  menuTableBody: document.getElementById('menuTableBody'),
  ingredientForm: document.getElementById('ingredientForm'),
  ingredientName: document.getElementById('ingredientName'),
  ingredientCategory: document.getElementById('ingredientCategory'),
  ingredientUnit: document.getElementById('ingredientUnit'),
  ingredientStockQty: document.getElementById('ingredientStockQty'),
  ingredientMinStockQty: document.getElementById('ingredientMinStockQty'),
  ingredientCostPerUnit: document.getElementById('ingredientCostPerUnit'),
  ingredientPhotoUrl: document.getElementById('ingredientPhotoUrl'),
  ingredientPhotoFile: document.getElementById('ingredientPhotoFile'),
  ingredientDescription: document.getElementById('ingredientDescription'),
  ingredientIsActive: document.getElementById('ingredientIsActive'),
  ingredientSubmitBtn: document.getElementById('ingredientSubmitBtn'),
  ingredientFormResetBtn: document.getElementById('ingredientFormResetBtn'),
  ingredientFormModeLabel: document.getElementById('ingredientFormModeLabel'),
  ingredientTableBody: document.getElementById('ingredientTableBody'),
  createUserForm: document.getElementById('createUserForm'),
  newUserUsername: document.getElementById('newUserUsername'),
  newUserFullName: document.getElementById('newUserFullName'),
  newUserRole: document.getElementById('newUserRole'),
  newUserPassword: document.getElementById('newUserPassword'),
  usersTableBody: document.getElementById('usersTableBody'),
  createBackupBtn: document.getElementById('createBackupBtn'),
  backupAutoInfo: document.getElementById('backupAutoInfo'),
  backupTableBody: document.getElementById('backupTableBody'),
  dbTableSelect: document.getElementById('dbTableSelect'),
  dbTableLimit: document.getElementById('dbTableLimit'),
  dbTableLoadBtn: document.getElementById('dbTableLoadBtn'),
  dbTableRefreshBtn: document.getElementById('dbTableRefreshBtn'),
  dbTableMeta: document.getElementById('dbTableMeta'),
  dbTableHead: document.getElementById('dbTableHead'),
  dbTableBody: document.getElementById('dbTableBody'),
  toast: document.getElementById('toast')
};

const iconMap = {
  Coffee: '☕',
  'Non Coffee': '🥤',
  Snack: '🥐',
  'Add On': '✨'
};

const categoryColorMap = {
  Coffee: '#9f5f2e',
  'Non Coffee': '#ce8247',
  Snack: '#ebaf5d',
  'Add On': '#f1d5ad'
};

const routeConfig = {
  dashboard: {
    path: '/dashboard',
    title: 'Dashboard',
    subtitle: 'Ringkasan performa harian POI Coffee',
    pageElement: () => elements.pageDashboard
  },
  pos: {
    path: '/pos',
    title: 'POS & POI Map',
    subtitle: 'Pilih meja dulu, lalu pilih menu untuk checkout',
    pageElement: () => elements.pagePos
  },
  orders: {
    path: '/orders',
    title: 'Orders',
    subtitle: 'Lacak order, status, dan stok inventory',
    pageElement: () => elements.pageOrders
  },
  reports: {
    path: '/reports',
    title: 'Reports',
    subtitle: 'Rekap penjualan dan export laporan',
    pageElement: () => elements.pageReports
  },
  settings: {
    path: '/settings',
    title: 'Settings',
    subtitle: 'Informasi sistem dan konfigurasi dasar',
    pageElement: () => elements.pageSettings
  },
  admin: {
    path: '/admin',
    title: 'Admin',
    subtitle: 'Kelola menu, bahan, user, dan backup sistem',
    pageElement: () => elements.pageAdmin
  },
  'admin-tables': {
    path: '/admin-tables',
    title: 'DB Tables',
    subtitle: 'Lihat isi tabel database SQLite',
    pageElement: () => elements.pageAdminTables
  }
};

function defaultReportFilter() {
  return {
    range: 'daily',
    date: formatLocalDateInput(new Date())
  };
}

function normalizeRouteKey(routeKey) {
  return Object.prototype.hasOwnProperty.call(routeConfig, routeKey) ? routeKey : 'dashboard';
}

function routeFromPath(pathname) {
  const source = typeof pathname === 'string' ? pathname : '/dashboard';
  const trimmed = source.replace(/\/+$/, '') || '/';

  if (trimmed === '/poi-map') {
    return 'pos';
  }

  for (const [key, config] of Object.entries(routeConfig)) {
    if (trimmed === config.path) return key;
  }

  if (trimmed === '/') return 'dashboard';
  return 'dashboard';
}

function pathForRoute(routeKey) {
  const key = normalizeRouteKey(routeKey);
  return routeConfig[key].path;
}

const app = {
  data: null,
  user: null,
  selectedCategory: 'All',
  selectedTableId: null,
  searchKeyword: '',
  cart: new Map(),
  reportFilter: defaultReportFilter(),
  selectedOrderForLog: null,
  adminUsers: [],
  backups: [],
  adminMenus: [],
  adminIngredients: [],
  menuEditingId: null,
  ingredientEditingId: null,
  dbTables: [],
  selectedDbTable: '',
  dbTableColumns: [],
  dbTableRows: [],
  dbTableTotal: 0,
  currentRoute: routeFromPath(window.location.pathname),
  loadingAdminData: false
};

function formatRupiah(value) {
  return formatter.format(value).replace('Rp', 'Rp ');
}

function formatQty(value) {
  const numeric = Number(value || 0);
  if (!Number.isFinite(numeric)) return '0';
  return numeric % 1 === 0 ? String(numeric) : numeric.toFixed(3).replace(/\.?0+$/, '');
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 2600);
}

function formatLocalDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateTime(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function showAppShell() {
  elements.authScreen.classList.add('hidden');
  elements.appShell.classList.remove('hidden');
}

function showAuthScreen() {
  elements.appShell.classList.add('hidden');
  elements.authScreen.classList.remove('hidden');
}

function syncReportFilterInputs() {
  elements.reportRange.value = app.reportFilter.range;
  elements.reportDate.value = app.reportFilter.date;
}

function isAdminUser() {
  return Boolean(app.user && app.user.role === 'admin');
}

function renderRoute() {
  const routeKey = normalizeRouteKey(app.currentRoute);
  const route = routeConfig[routeKey];

  for (const config of Object.values(routeConfig)) {
    config.pageElement().classList.add('hidden');
  }
  route.pageElement().classList.remove('hidden');

  elements.mainNav.querySelectorAll('.nav-link[data-route]').forEach((link) => {
    const active = link.dataset.route === routeKey;
    link.classList.toggle('active', active);
  });

  elements.pageTitle.textContent = route.title;
  elements.pageSubtitle.textContent = route.subtitle;

  if (isAdminUser()) {
    elements.adminNavLink.classList.remove('hidden');
    elements.adminTablesNavLink.classList.remove('hidden');
    elements.adminSection.classList.remove('hidden');
    elements.adminNoAccessPanel.classList.add('hidden');
  } else {
    elements.adminNavLink.classList.add('hidden');
    elements.adminTablesNavLink.classList.add('hidden');
    elements.adminSection.classList.add('hidden');
    elements.adminNoAccessPanel.classList.remove('hidden');
  }

  if (app.data && routeKey === 'dashboard') {
    window.requestAnimationFrame(() => {
      drawSalesChart();
    });
  }
}

function navigateToRoute(routeKey, options = {}) {
  const push = options.push !== false;
  const silentBlockedNotice = options.silentBlockedNotice === true;

  let nextRoute = normalizeRouteKey(routeKey);
  let blocked = false;

  if ((nextRoute === 'admin' || nextRoute === 'admin-tables') && !isAdminUser()) {
    blocked = true;
    nextRoute = 'dashboard';
  }

  app.currentRoute = nextRoute;
  const nextPath = pathForRoute(nextRoute);
  const hasDifferentPath = window.location.pathname !== nextPath;

  if (hasDifferentPath) {
    if (push) {
      window.history.pushState({}, '', nextPath);
    } else {
      window.history.replaceState({}, '', nextPath);
    }
  }

  renderRoute();

  if (nextRoute === 'admin-tables' && isAdminUser() && app.dbTables.length === 0) {
    loadDbTables({ silent: true });
  }

  if (blocked && !silentBlockedNotice) {
    showToast('Halaman admin hanya untuk role admin');
  }
}

function resetAppState() {
  app.data = null;
  app.user = null;
  app.selectedCategory = 'All';
  app.selectedTableId = null;
  app.searchKeyword = '';
  app.cart = new Map();
  app.reportFilter = defaultReportFilter();
  app.selectedOrderForLog = null;
  app.adminUsers = [];
  app.backups = [];
  app.adminMenus = [];
  app.adminIngredients = [];
  app.menuEditingId = null;
  app.ingredientEditingId = null;
  app.dbTables = [];
  app.selectedDbTable = '';
  app.dbTableColumns = [];
  app.dbTableRows = [];
  app.dbTableTotal = 0;

  elements.currentUserLabel.textContent = '-';
  elements.productSearch.value = '';
  elements.exportRange.value = 'daily';
  elements.exportDate.value = formatLocalDateInput(new Date());
  elements.exportExcelBtn.disabled = true;
  elements.exportRange.disabled = true;
  elements.exportDate.disabled = true;
  elements.exportExcelBtn.title = 'Login sebagai admin untuk export';

  elements.reportWindowLabel.textContent = 'Periode: -';
  elements.orderLogPanel.textContent = 'Pilih order untuk melihat riwayat status.';
  elements.adminNavLink.classList.add('hidden');
  elements.adminTablesNavLink.classList.add('hidden');
  elements.adminSection.classList.add('hidden');
  elements.backupAutoInfo.textContent = 'Auto backup: -';
  elements.dbTableMeta.textContent = 'Belum ada data tabel.';
  elements.dbTableSelect.innerHTML = '<option value="">Pilih tabel</option>';
  elements.dbTableHead.innerHTML = '';
  elements.dbTableBody.innerHTML = '<tr><td class="empty">Belum ada data</td></tr>';

  syncReportFilterInputs();
  resetMenuForm();
  resetIngredientForm();
  renderMenuTable();
  renderIngredientTable();
  renderCart();
  renderRoute();
}

async function apiFetch(url, options = {}, { allowUnauthorized = false } = {}) {
  const response = await fetch(url, options);
  if (response.status === 401 && !allowUnauthorized) {
    showToast('Sesi login habis. Silakan login kembali.');
    resetAppState();
    showAuthScreen();
    throw new Error('Unauthorized');
  }

  return response;
}

function productById(productId) {
  return app.data.products.find((product) => product.id === productId);
}

function totalCartValue() {
  return Array.from(app.cart.values()).reduce((sum, item) => sum + item.qty * item.price, 0);
}

function hasSelectedTable() {
  if (!app.data) return false;
  if (app.selectedTableId === 'Take Away') return true;
  return app.data.tables.some((table) => table.id === app.selectedTableId);
}

function renderDate() {
  const now = new Date();
  elements.currentDate.textContent = now.toLocaleString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function renderCurrentUser() {
  if (!app.user) {
    elements.currentUserLabel.textContent = '-';
    renderRoute();
    return;
  }

  elements.currentUserLabel.textContent = `${app.user.fullName} (${app.user.role})`;

  const isAdmin = app.user.role === 'admin';
  elements.exportExcelBtn.disabled = !isAdmin;
  elements.exportRange.disabled = !isAdmin;
  elements.exportDate.disabled = !isAdmin;
  elements.exportExcelBtn.title = isAdmin ? '' : 'Hanya admin yang bisa export';

  if (!isAdmin && (app.currentRoute === 'admin' || app.currentRoute === 'admin-tables')) {
    navigateToRoute('dashboard', { push: false, silentBlockedNotice: true });
    return;
  }

  renderRoute();
}

function renderReportWindow() {
  if (!app.data || !app.data.reportWindow) {
    elements.reportWindowLabel.textContent = 'Periode: -';
    return;
  }

  const windowInfo = app.data.reportWindow;
  elements.reportWindowLabel.textContent = `Periode: ${windowInfo.label} (${windowInfo.range})`;

  app.reportFilter.range = windowInfo.range;
  app.reportFilter.date = windowInfo.baseDate;
  syncReportFilterInputs();
}

function renderSummary() {
  const summary = app.data.summary;
  elements.summaryRevenue.textContent = formatRupiah(summary.totalRevenue);
  elements.summaryRevenueHint.textContent = `${summary.activeOrders} order aktif`;
  elements.summaryTransactions.textContent = `${summary.transactions}`;
  elements.summaryActiveOrders.textContent = `${summary.activeOrders}`;
  elements.summaryBestSeller.textContent = summary.bestSeller;
}

function renderCategoryTabs() {
  const categories = ['All', ...app.data.categories];
  elements.categoryTabs.innerHTML = categories
    .map((category) => {
      const activeClass = app.selectedCategory === category ? 'active' : '';
      return `<button class="tab ${activeClass}" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`;
    })
    .join('');

  elements.categoryTabs.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      app.selectedCategory = tab.dataset.category;
      renderCategoryTabs();
      renderProducts();
    });
  });
}

function filteredProducts() {
  return app.data.products.filter((product) => {
    const sameCategory = app.selectedCategory === 'All' || product.category === app.selectedCategory;
    const sameKeyword =
      app.searchKeyword.length === 0 ||
      product.name.toLowerCase().includes(app.searchKeyword.toLowerCase());
    return sameCategory && sameKeyword;
  });
}

function renderProducts() {
  if (!hasSelectedTable()) {
    elements.productGrid.innerHTML =
      '<div class="empty">Pilih meja dulu pada POI Map sebelum memilih menu.</div>';
    return;
  }

  const products = filteredProducts();

  if (products.length === 0) {
    elements.productGrid.innerHTML = '<div class="empty">Menu tidak ditemukan.</div>';
    return;
  }

  elements.productGrid.innerHTML = products
    .map((product) => {
      const icon = iconMap[product.category] || '🍽️';
      const photo = typeof product.photoUrl === 'string' ? product.photoUrl.trim() : '';
      const mediaHtml = photo
        ? `<img class="product-photo" src="${escapeHtml(photo)}" alt="${escapeHtml(product.name)}" />`
        : `<div class="product-ico">${icon}</div>`;
      return `
        <article class="product-card">
          ${mediaHtml}
          <h4>${escapeHtml(product.name)}</h4>
          <p>${escapeHtml(product.category)}</p>
          <strong>${formatRupiah(product.price)}</strong>
          <button class="btn-add" data-product-id="${escapeHtml(product.id)}">+ Tambah</button>
        </article>
      `;
    })
    .join('');

  elements.productGrid.querySelectorAll('.btn-add').forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(button.dataset.productId);
    });
  });
}

function renderTableSelect() {
  const tableOptions = app.data.tables
    .map((table) => `<option value="${escapeHtml(table.id)}">${escapeHtml(table.id)} (${escapeHtml(table.area)})</option>`)
    .join('');

  elements.tableSelect.innerHTML = `
    <option value="">Pilih meja dulu</option>
    ${tableOptions}
    <option value="Take Away">Take Away</option>
  `;

  if (!hasSelectedTable()) {
    app.selectedTableId = null;
    if (app.cart.size > 0) {
      app.cart.clear();
    }
  }

  elements.tableSelect.value = app.selectedTableId || '';
}

function renderCart() {
  const tableSelected = hasSelectedTable();
  elements.checkoutBtn.disabled = !tableSelected;

  if (!tableSelected) {
    elements.cartItems.innerHTML =
      '<div class="empty">Pilih meja dulu. Setelah itu menu bisa ditambahkan ke keranjang.</div>';
    elements.cartTotal.textContent = formatRupiah(0);
    return;
  }

  const items = Array.from(app.cart.values());
  if (!items.length) {
    elements.cartItems.innerHTML = '<div class="empty">Keranjang masih kosong.</div>';
    elements.cartTotal.textContent = formatRupiah(0);
    return;
  }

  elements.cartItems.innerHTML = items
    .map(
      (item) => `
      <div class="cart-row">
        <div>
          <p><strong>${escapeHtml(item.name)}</strong></p>
          <small>${formatRupiah(item.price)} / item</small>
        </div>
        <div>
          <div class="qty-actions">
            <button data-op="dec" data-id="${escapeHtml(item.productId)}">-</button>
            <button>${item.qty}</button>
            <button data-op="inc" data-id="${escapeHtml(item.productId)}">+</button>
          </div>
          <small>${formatRupiah(item.qty * item.price)}</small>
        </div>
      </div>
    `
    )
    .join('');

  elements.cartTotal.textContent = formatRupiah(totalCartValue());

  elements.cartItems.querySelectorAll('button[data-op]').forEach((button) => {
    button.addEventListener('click', () => {
      const op = button.dataset.op;
      const productId = button.dataset.id;
      if (op === 'inc') changeCartQty(productId, 1);
      if (op === 'dec') changeCartQty(productId, -1);
    });
  });
}

function addToCart(productId) {
  if (!hasSelectedTable()) {
    showToast('Pilih meja dulu sebelum menambah menu');
    return;
  }

  const product = productById(productId);
  if (!product) return;

  const prev = app.cart.get(productId);
  if (prev) {
    app.cart.set(productId, { ...prev, qty: prev.qty + 1 });
  } else {
    app.cart.set(productId, {
      productId,
      name: product.name,
      price: product.price,
      qty: 1
    });
  }

  renderCart();
  showToast(`${product.name} ditambahkan`);
}

function changeCartQty(productId, delta) {
  const prev = app.cart.get(productId);
  if (!prev) return;

  const nextQty = prev.qty + delta;
  if (nextQty <= 0) {
    app.cart.delete(productId);
  } else {
    app.cart.set(productId, { ...prev, qty: nextQty });
  }

  renderCart();
}

function renderTables() {
  elements.tableGrid.innerHTML = app.data.tables
    .map((table) => {
      const activeClass = table.id === app.selectedTableId ? 'active' : '';
      return `
        <button class="table-btn ${escapeHtml(table.status)} ${activeClass}" data-table-id="${escapeHtml(table.id)}">
          <strong>${escapeHtml(table.id)}</strong>
          <small>${escapeHtml(table.area)}</small>
        </button>
      `;
    })
    .join('');

  elements.tableGrid.querySelectorAll('.table-btn').forEach((button) => {
    button.addEventListener('click', () => {
      app.selectedTableId = button.dataset.tableId;
      elements.tableSelect.value = app.selectedTableId;
      renderTableSelect();
      renderTables();
      renderProducts();
      renderCart();
    });
  });

  renderTableDetail();
}

function renderTableDetail() {
  if (!app.selectedTableId) {
    elements.tableDetail.textContent = 'Silakan klik meja terlebih dahulu untuk mulai transaksi POS.';
    return;
  }

  if (app.selectedTableId === 'Take Away') {
    elements.tableDetail.textContent = 'Mode Take Away dipilih. Order tidak terikat ke meja.';
    return;
  }

  const table = app.data.tables.find((item) => item.id === app.selectedTableId);
  if (!table) {
    elements.tableDetail.textContent = 'Meja tidak ditemukan. Pilih meja kembali.';
    return;
  }

  const statusText =
    table.status === 'available' ? 'Kosong' : table.status === 'occupied' ? 'Terisi' : 'Reservasi';
  elements.tableDetail.textContent = `Meja ${table.id} (${table.area}) saat ini berstatus: ${statusText}.`;
}

function renderOrderLogPlaceholder(message = 'Pilih order untuk melihat riwayat status.') {
  elements.orderLogPanel.textContent = message;
}

function renderOrderLogDetails(orderCode, logs) {
  if (!Array.isArray(logs) || logs.length === 0) {
    renderOrderLogPlaceholder(`Belum ada log perubahan status untuk ${orderCode}.`);
    return;
  }

  const html = logs
    .map((log) => {
      const fromLabel = log.fromStatus || '-';
      const noteText = log.note ? ` | Catatan: ${log.note}` : '';
      return `<div><strong>${escapeHtml(log.toStatus)}</strong> dari ${escapeHtml(fromLabel)} | ${escapeHtml(log.changedByName)} | ${formatDateTime(log.changedAt)}${escapeHtml(noteText)}</div>`;
    })
    .join('');

  elements.orderLogPanel.innerHTML = `<strong>Riwayat ${escapeHtml(orderCode)}</strong><br />${html}`;
}

function renderOrderHistory() {
  const rows = app.data.orders.slice(0, 20);

  if (!rows.length) {
    elements.orderHistoryBody.innerHTML = '<tr><td colspan="7" class="empty">Belum ada order</td></tr>';
    renderOrderLogPlaceholder();
    return;
  }

  elements.orderHistoryBody.innerHTML = rows
    .map((order) => {
      const itemLabel = order.items[0]
        ? `${order.items[0].name}${order.items.length > 1 ? ` +${order.items.length - 1}` : ''}`
        : '-';
      const statusClass = String(order.status || '').toLowerCase();
      const actionButtons = order.canTransition
        ? `
          <button data-action="done" data-order-code="${escapeHtml(order.id)}">Done</button>
          <button data-action="cancel" data-order-code="${escapeHtml(order.id)}">Cancel</button>
        `
        : '';

      return `
        <tr>
          <td>${escapeHtml(order.id)}</td>
          <td>${escapeHtml(order.tableId)}</td>
          <td>${escapeHtml(order.cashierName || '-')}</td>
          <td>${escapeHtml(itemLabel)}</td>
          <td>${formatRupiah(order.total)}</td>
          <td><span class="status ${escapeHtml(statusClass)}">${escapeHtml(order.status)}</span></td>
          <td>
            <div class="status-actions">
              <button data-action="log" data-order-code="${escapeHtml(order.id)}">Log</button>
              ${actionButtons}
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  elements.orderHistoryBody.querySelectorAll('button[data-action]').forEach((button) => {
    button.addEventListener('click', async () => {
      const action = button.dataset.action;
      const orderCode = button.dataset.orderCode;

      if (action === 'log') {
        await fetchOrderLogs(orderCode);
        return;
      }

      if (action === 'done') {
        await updateOrderStatus(orderCode, 'Done');
        return;
      }

      if (action === 'cancel') {
        await updateOrderStatus(orderCode, 'Cancel');
      }
    });
  });
}

function renderInventory() {
  const rows = app.data.inventory
    .map((stockItem) => {
      const product = productById(stockItem.productId);
      const lowStock = stockItem.stock <= stockItem.minStock;
      return `
        <tr>
          <td>${escapeHtml(product ? product.name : stockItem.productId)}</td>
          <td>${stockItem.stock}</td>
          <td>${stockItem.minStock}</td>
          <td class="${lowStock ? 'stock-low' : 'stock-ok'}">${lowStock ? 'Low' : 'OK'}</td>
        </tr>
      `;
    })
    .join('');

  elements.inventoryBody.innerHTML = rows;
}

function renderReports() {
  const summary = app.data.summary;
  const monthlyProjection = summary.totalRevenue * 30;

  elements.reportTotalRevenue.textContent = formatRupiah(summary.totalRevenue);
  elements.reportTransactions.textContent = `${summary.transactions}`;
  elements.reportMonthly.textContent = formatRupiah(monthlyProjection);

  elements.topProducts.innerHTML = app.data.productStats
    .slice(0, 5)
    .map((item) => `<li><span>${escapeHtml(item.name)}</span><strong>${item.sold} cup</strong></li>`)
    .join('');
}

function drawSalesChart() {
  const canvas = elements.salesChart;
  const ctx = canvas.getContext('2d');
  const data = app.data.dailySales;

  const width = canvas.clientWidth;
  const height = 240;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  const padding = { top: 22, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((item) => item.amount), 1);
  const minValue = Math.min(...data.map((item) => item.amount), 0);

  ctx.strokeStyle = '#ebdbc9';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  const points = data.map((item, index) => {
    const x = padding.left + (index / (data.length - 1 || 1)) * chartWidth;
    const ratio = (item.amount - minValue) / (maxValue - minValue || 1);
    const y = padding.top + chartHeight - ratio * chartHeight;
    return { x, y };
  });

  const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
  gradient.addColorStop(0, 'rgba(159, 95, 46, 0.35)');
  gradient.addColorStop(1, 'rgba(159, 95, 46, 0.03)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const current = points[i];
    const cx = (prev.x + current.x) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, cx, (prev.y + current.y) / 2);
  }

  const lastPoint = points[points.length - 1];
  ctx.lineTo(lastPoint.x, padding.top + chartHeight);
  ctx.lineTo(points[0].x, padding.top + chartHeight);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.strokeStyle = '#9f5f2e';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  ctx.fillStyle = '#6d3f20';
  ctx.font = '11px Segoe UI';
  data.forEach((item, index) => {
    const x = padding.left + (index / (data.length - 1 || 1)) * chartWidth;
    ctx.fillText(item.hour, x - 14, height - 10);
  });
}

function buildCategoryDistribution() {
  const totals = Object.fromEntries(app.data.categories.map((category) => [category, 0]));

  for (const stat of app.data.categoryStats || []) {
    totals[stat.category] = Number(stat.amount || 0);
  }

  const totalValue = Object.values(totals).reduce((sum, value) => sum + value, 0);

  return Object.entries(totals)
    .map(([name, value]) => {
      const pct = totalValue > 0 ? value / totalValue : 0;
      return {
        name,
        value,
        pct,
        color: categoryColorMap[name] || '#dfc4a9'
      };
    })
    .sort((a, b) => b.value - a.value);
}

function renderDonut() {
  const distributions = buildCategoryDistribution();
  const top = distributions[0] || { name: 'Coffee', pct: 0 };

  let degreeCursor = 0;
  const segments = [];
  distributions.forEach((item) => {
    const next = degreeCursor + item.pct * 360;
    segments.push(`${item.color} ${degreeCursor}deg ${next}deg`);
    degreeCursor = next;
  });

  if (degreeCursor < 360) {
    segments.push(`#f2dfcb ${degreeCursor}deg 360deg`);
  }

  elements.categoryDonut.style.background = `conic-gradient(${segments.join(',')})`;
  elements.donutMainValue.textContent = `${Math.round(top.pct * 100)}%`;
  elements.categoryDonut.querySelector('small').textContent = top.name;

  elements.categoryLegend.innerHTML = distributions
    .map(
      (item) => `
      <div class="legend-item">
        <span class="legend-name">
          <span class="legend-color" style="background:${item.color}"></span>${escapeHtml(item.name)}
        </span>
        <strong>${Math.round(item.pct * 100)}%</strong>
      </div>
    `
    )
    .join('');
}

function renderUsersTable() {
  if (!app.adminUsers.length) {
    elements.usersTableBody.innerHTML = '<tr><td colspan="5" class="empty">Belum ada user</td></tr>';
    return;
  }

  elements.usersTableBody.innerHTML = app.adminUsers
    .map((user) => {
      const isCurrentUser = app.user && user.id === app.user.id;
      const statusClass = user.isActive ? 'done' : 'cancel';
      const statusText = user.isActive ? 'Aktif' : 'Nonaktif';
      const lockLabel = user.lockedUntil ? ` (Terkunci hingga ${formatDateTime(user.lockedUntil)})` : '';

      const switchRoleLabel = user.role === 'admin' ? 'Jadikan Kasir' : 'Jadikan Admin';
      const switchActiveLabel = user.isActive ? 'Nonaktifkan' : 'Aktifkan';

      return `
        <tr>
          <td>${escapeHtml(user.username)}</td>
          <td>${escapeHtml(user.fullName)}</td>
          <td>${escapeHtml(user.role)}</td>
          <td><span class="status ${statusClass}">${statusText}</span>${escapeHtml(lockLabel)}</td>
          <td>
            <div class="status-actions">
              <button data-user-action="toggle-role" data-user-id="${user.id}">${switchRoleLabel}</button>
              <button data-user-action="toggle-active" data-user-id="${user.id}">${switchActiveLabel}</button>
              <button data-user-action="reset-password" data-user-id="${user.id}">Reset Pass</button>
              ${isCurrentUser ? '<button data-user-action="self-label" data-user-id="0" disabled>Akun Saya</button>' : ''}
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  elements.usersTableBody.querySelectorAll('button[data-user-action]').forEach((button) => {
    if (button.disabled) return;

    button.addEventListener('click', async () => {
      const userId = Number.parseInt(button.dataset.userId, 10);
      const action = button.dataset.userAction;

      if (!Number.isInteger(userId) || userId <= 0) return;

      if (action === 'toggle-role') {
        const user = app.adminUsers.find((item) => item.id === userId);
        if (!user) return;

        const nextRole = user.role === 'admin' ? 'cashier' : 'admin';
        const confirmed = window.confirm(
          `Ubah role ${user.username} menjadi ${nextRole.toUpperCase()}?`
        );
        if (!confirmed) return;

        await updateUser(userId, { role: nextRole });
        return;
      }

      if (action === 'toggle-active') {
        const user = app.adminUsers.find((item) => item.id === userId);
        if (!user) return;

        const nextActive = !user.isActive;
        const confirmed = window.confirm(
          `${nextActive ? 'Aktifkan' : 'Nonaktifkan'} user ${user.username}?`
        );
        if (!confirmed) return;

        await updateUser(userId, { isActive: nextActive });
        return;
      }

      if (action === 'reset-password') {
        await resetUserPassword(userId);
      }
    });
  });
}

function renderBackupsTable() {
  if (!app.backups.length) {
    elements.backupTableBody.innerHTML =
      '<tr><td colspan="5" class="empty">Belum ada backup tersedia</td></tr>';
    return;
  }

  elements.backupTableBody.innerHTML = app.backups
    .map((backup) => {
      const restoreLabel = backup.restoredAt ? `Sudah restore: ${formatDateTime(backup.restoredAt)}` : '-';
      return `
        <tr>
          <td>
            <strong>${escapeHtml(backup.fileName)}</strong><br />
            <small>${escapeHtml(restoreLabel)}</small>
          </td>
          <td>${formatDateTime(backup.createdAt)}</td>
          <td>${escapeHtml(backup.sizeHuman || '-')}</td>
          <td>${escapeHtml(backup.triggerType)}</td>
          <td>
            <button class="btn-export" data-backup-action="restore" data-file-name="${escapeHtml(backup.fileName)}">
              Restore
            </button>
          </td>
        </tr>
      `;
    })
    .join('');

  elements.backupTableBody.querySelectorAll('button[data-backup-action="restore"]').forEach((button) => {
    button.addEventListener('click', async () => {
      const fileName = button.dataset.fileName;
      await restoreBackup(fileName);
    });
  });
}

function renderDbTableSelector() {
  if (!app.dbTables.length) {
    elements.dbTableSelect.innerHTML = '<option value="">Tidak ada tabel</option>';
    elements.dbTableMeta.textContent = 'Tidak ada tabel yang tersedia.';
    elements.dbTableHead.innerHTML = '';
    elements.dbTableBody.innerHTML = '<tr><td class="empty">Belum ada data</td></tr>';
    return;
  }

  elements.dbTableSelect.innerHTML = app.dbTables
    .map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`)
    .join('');

  if (!app.selectedDbTable || !app.dbTables.includes(app.selectedDbTable)) {
    app.selectedDbTable = app.dbTables[0];
  }

  elements.dbTableSelect.value = app.selectedDbTable;
}

function renderDbTableData() {
  if (!app.selectedDbTable) {
    elements.dbTableMeta.textContent = 'Pilih tabel terlebih dahulu.';
    elements.dbTableHead.innerHTML = '';
    elements.dbTableBody.innerHTML = '<tr><td class="empty">Belum ada data</td></tr>';
    return;
  }

  const columns = app.dbTableColumns || [];
  const rows = app.dbTableRows || [];

  elements.dbTableMeta.textContent = `Tabel: ${app.selectedDbTable} | Total baris: ${app.dbTableTotal}`;

  if (!columns.length) {
    elements.dbTableHead.innerHTML = '';
    elements.dbTableBody.innerHTML = '<tr><td class="empty">Kolom tabel tidak ditemukan.</td></tr>';
    return;
  }

  elements.dbTableHead.innerHTML = `<tr>${columns
    .map((column) => `<th>${escapeHtml(column)}</th>`)
    .join('')}</tr>`;

  if (!rows.length) {
    elements.dbTableBody.innerHTML = `<tr><td colspan="${columns.length}" class="empty">Tidak ada data.</td></tr>`;
    return;
  }

  elements.dbTableBody.innerHTML = rows
    .map((row) => {
      const cells = columns
        .map((column) => {
          const value = row[column];
          const printable =
            value === null || value === undefined
              ? 'NULL'
              : typeof value === 'object'
                ? JSON.stringify(value)
                : String(value);
          return `<td class="db-cell" title="${escapeHtml(printable)}">${escapeHtml(printable)}</td>`;
        })
        .join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');
}

async function loadDbTableRows(tableName, options = {}) {
  const silent = Boolean(options.silent);
  const limitInput = Number.parseInt(elements.dbTableLimit.value, 10);
  const limit = Number.isInteger(limitInput) && limitInput > 0 ? Math.min(limitInput, 500) : 100;
  elements.dbTableLimit.value = String(limit);

  try {
    const response = await apiFetch(
      `/api/admin/db/tables/${encodeURIComponent(tableName)}?limit=${limit}&offset=0`
    );
    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Gagal memuat isi tabel');
    }

    app.selectedDbTable = body.table;
    app.dbTableColumns = Array.isArray(body.columns) ? body.columns : [];
    app.dbTableRows = Array.isArray(body.rows) ? body.rows : [];
    app.dbTableTotal = Number(body.total || 0);
    renderDbTableData();
  } catch (error) {
    if (error.message !== 'Unauthorized' && !silent) {
      showToast(error.message);
    }
  }
}

async function loadDbTables(options = {}) {
  const silent = Boolean(options.silent);

  try {
    const response = await apiFetch('/api/admin/db/tables');
    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Gagal memuat daftar tabel');
    }

    app.dbTables = Array.isArray(body.tables) ? body.tables : [];
    renderDbTableSelector();

    if (app.selectedDbTable) {
      await loadDbTableRows(app.selectedDbTable, { silent: true });
    } else {
      renderDbTableData();
    }
  } catch (error) {
    if (error.message !== 'Unauthorized' && !silent) {
      showToast(error.message);
    }
  }
}

function resetMenuForm() {
  app.menuEditingId = null;
  elements.menuName.value = '';
  elements.menuCategory.value = '';
  elements.menuPrice.value = '';
  elements.menuStock.value = '';
  elements.menuMinStock.value = '';
  elements.menuPhotoUrl.value = '';
  elements.menuPhotoFile.value = '';
  elements.menuIcon.value = '';
  elements.menuDescription.value = '';
  elements.menuIsActive.checked = true;
  elements.menuSubmitBtn.textContent = 'Tambah Menu';
  elements.menuFormModeLabel.textContent = 'Mode: tambah menu baru';
}

function fillMenuForm(menuId) {
  const menu = app.adminMenus.find((item) => item.id === menuId);
  if (!menu) return;

  app.menuEditingId = menu.id;
  elements.menuName.value = menu.name || '';
  elements.menuCategory.value = menu.category || '';
  elements.menuPrice.value = menu.price || '';
  elements.menuStock.value = menu.stock || 0;
  elements.menuMinStock.value = menu.minStock || 0;
  elements.menuPhotoUrl.value = menu.photoUrl || '';
  elements.menuPhotoFile.value = '';
  elements.menuIcon.value = menu.icon || '';
  elements.menuDescription.value = menu.description || '';
  elements.menuIsActive.checked = Boolean(menu.isActive);
  elements.menuSubmitBtn.textContent = 'Simpan Perubahan';
  elements.menuFormModeLabel.textContent = `Mode: edit menu ${menu.id}`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Gagal membaca file foto'));
    reader.readAsDataURL(file);
  });
}

function resetIngredientForm() {
  app.ingredientEditingId = null;
  elements.ingredientName.value = '';
  elements.ingredientCategory.value = '';
  elements.ingredientUnit.value = '';
  elements.ingredientStockQty.value = '';
  elements.ingredientMinStockQty.value = '';
  elements.ingredientCostPerUnit.value = '';
  elements.ingredientPhotoUrl.value = '';
  elements.ingredientPhotoFile.value = '';
  elements.ingredientDescription.value = '';
  elements.ingredientIsActive.checked = true;
  elements.ingredientSubmitBtn.textContent = 'Tambah Bahan';
  elements.ingredientFormModeLabel.textContent = 'Mode: tambah bahan baru';
}

function fillIngredientForm(ingredientId) {
  const ingredient = app.adminIngredients.find((item) => item.id === ingredientId);
  if (!ingredient) return;

  app.ingredientEditingId = ingredient.id;
  elements.ingredientName.value = ingredient.name || '';
  elements.ingredientCategory.value = ingredient.category || '';
  elements.ingredientUnit.value = ingredient.unit || '';
  elements.ingredientStockQty.value = ingredient.stockQty ?? 0;
  elements.ingredientMinStockQty.value = ingredient.minStockQty ?? 0;
  elements.ingredientCostPerUnit.value = ingredient.costPerUnit ?? 0;
  elements.ingredientPhotoUrl.value = ingredient.photoUrl || '';
  elements.ingredientPhotoFile.value = '';
  elements.ingredientDescription.value = ingredient.description || '';
  elements.ingredientIsActive.checked = Boolean(ingredient.isActive);
  elements.ingredientSubmitBtn.textContent = 'Simpan Perubahan';
  elements.ingredientFormModeLabel.textContent = `Mode: edit bahan ${ingredient.id}`;
}

function renderIngredientTable() {
  if (!app.adminIngredients.length) {
    elements.ingredientTableBody.innerHTML =
      '<tr><td colspan="8" class="empty">Belum ada bahan terdaftar</td></tr>';
    return;
  }

  elements.ingredientTableBody.innerHTML = app.adminIngredients
    .map((ingredient) => {
      const statusClass = ingredient.isActive ? 'done' : 'cancel';
      const statusText = ingredient.isActive ? 'Aktif' : 'Nonaktif';
      const photo = typeof ingredient.photoUrl === 'string' ? ingredient.photoUrl.trim() : '';
      const photoCell = photo
        ? `<img class="ingredient-table-photo" src="${escapeHtml(photo)}" alt="${escapeHtml(ingredient.name)}" />`
        : '<div class="ingredient-table-photo"></div>';

      return `
        <tr>
          <td>${photoCell}</td>
          <td><span class="menu-table-id">${escapeHtml(ingredient.id)}</span></td>
          <td>
            <strong>${escapeHtml(ingredient.name)}</strong><br />
            <small>${escapeHtml(ingredient.description || '-')}</small>
          </td>
          <td>${escapeHtml(ingredient.category)}</td>
          <td>${formatQty(ingredient.stockQty)} ${escapeHtml(ingredient.unit)} / min ${formatQty(
        ingredient.minStockQty
      )}</td>
          <td>${formatRupiah(ingredient.costPerUnit)}</td>
          <td><span class="status ${statusClass}">${statusText}</span></td>
          <td>
            <div class="status-actions">
              <button data-ingredient-action="edit" data-ingredient-id="${escapeHtml(ingredient.id)}">Edit</button>
              <button data-ingredient-action="toggle-active" data-ingredient-id="${escapeHtml(ingredient.id)}">
                ${ingredient.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
              <button data-ingredient-action="delete" data-ingredient-id="${escapeHtml(ingredient.id)}">Hapus</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  elements.ingredientTableBody
    .querySelectorAll('button[data-ingredient-action]')
    .forEach((button) => {
      button.addEventListener('click', async () => {
        const action = button.dataset.ingredientAction;
        const ingredientId = button.dataset.ingredientId;
        if (!ingredientId) return;

        if (action === 'edit') {
          fillIngredientForm(ingredientId);
          return;
        }

        if (action === 'toggle-active') {
          const ingredient = app.adminIngredients.find((item) => item.id === ingredientId);
          if (!ingredient) return;

          const nextActive = !ingredient.isActive;
          const confirmed = window.confirm(
            `${nextActive ? 'Aktifkan' : 'Nonaktifkan'} bahan ${ingredient.name}?`
          );
          if (!confirmed) return;

          await updateIngredient(ingredientId, { isActive: nextActive }, 'Status bahan diperbarui');
          return;
        }

        if (action === 'delete') {
          await deleteIngredient(ingredientId);
        }
      });
    });
}

function renderMenuTable() {
  if (!app.adminMenus.length) {
    elements.menuTableBody.innerHTML =
      '<tr><td colspan="8" class="empty">Belum ada menu terdaftar</td></tr>';
    return;
  }

  elements.menuTableBody.innerHTML = app.adminMenus
    .map((menu) => {
      const statusClass = menu.isActive ? 'done' : 'cancel';
      const statusText = menu.isActive ? 'Aktif' : 'Nonaktif';
      const photo = typeof menu.photoUrl === 'string' ? menu.photoUrl.trim() : '';
      const photoCell = photo
        ? `<img class="menu-table-photo" src="${escapeHtml(photo)}" alt="${escapeHtml(menu.name)}" />`
        : '<div class="menu-table-photo"></div>';

      return `
        <tr>
          <td>${photoCell}</td>
          <td><span class="menu-table-id">${escapeHtml(menu.id)}</span></td>
          <td>
            <strong>${escapeHtml(menu.name)}</strong><br />
            <small>${escapeHtml(menu.description || '-')}</small>
          </td>
          <td>${escapeHtml(menu.category)}</td>
          <td>${formatRupiah(menu.price)}</td>
          <td>${menu.stock} / min ${menu.minStock}</td>
          <td><span class="status ${statusClass}">${statusText}</span></td>
          <td>
            <div class="status-actions">
              <button data-menu-action="edit" data-menu-id="${escapeHtml(menu.id)}">Edit</button>
              <button data-menu-action="toggle-active" data-menu-id="${escapeHtml(menu.id)}">
                ${menu.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
              <button data-menu-action="delete" data-menu-id="${escapeHtml(menu.id)}">Hapus</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  elements.menuTableBody.querySelectorAll('button[data-menu-action]').forEach((button) => {
    button.addEventListener('click', async () => {
      const action = button.dataset.menuAction;
      const menuId = button.dataset.menuId;
      if (!menuId) return;

      if (action === 'edit') {
        fillMenuForm(menuId);
        return;
      }

      if (action === 'toggle-active') {
        const menu = app.adminMenus.find((item) => item.id === menuId);
        if (!menu) return;

        const nextActive = !menu.isActive;
        const confirmed = window.confirm(
          `${nextActive ? 'Aktifkan' : 'Nonaktifkan'} menu ${menu.name}?`
        );
        if (!confirmed) return;

        await updateMenu(menuId, { isActive: nextActive }, 'Status menu diperbarui');
        return;
      }

      if (action === 'delete') {
        await deleteMenu(menuId);
      }
    });
  });
}

async function createOrUpdateMenu(event) {
  event.preventDefault();

  if (!isAdminUser()) {
    showToast('Fitur ini hanya untuk admin');
    return;
  }

  const name = elements.menuName.value.trim();
  const category = elements.menuCategory.value.trim();
  const price = Number.parseInt(elements.menuPrice.value, 10);
  const stock = Number.parseInt(elements.menuStock.value, 10);
  const minStock = Number.parseInt(elements.menuMinStock.value, 10);
  const icon = elements.menuIcon.value.trim();
  const description = elements.menuDescription.value.trim();
  const manualPhotoUrl = elements.menuPhotoUrl.value.trim();
  const isActive = elements.menuIsActive.checked;

  if (!name || !category || !Number.isInteger(price) || price <= 0) {
    showToast('Nama, kategori, dan harga menu wajib valid');
    return;
  }

  if (!Number.isInteger(stock) || stock < 0 || !Number.isInteger(minStock) || minStock < 0) {
    showToast('Stok dan minimum stok harus angka >= 0');
    return;
  }

  let photoUrl = manualPhotoUrl;
  const file = elements.menuPhotoFile.files && elements.menuPhotoFile.files[0];
  if (file) {
    try {
      photoUrl = await readFileAsDataUrl(file);
    } catch (error) {
      showToast(error.message || 'Gagal membaca file foto');
      return;
    }
  }

  const payload = {
    name,
    category,
    price,
    stock,
    minStock,
    photoUrl,
    icon,
    description,
    isActive
  };

  try {
    const isEdit = Boolean(app.menuEditingId);
    const endpoint = isEdit
      ? `/api/admin/menus/${encodeURIComponent(app.menuEditingId)}`
      : '/api/admin/menus';
    const method = isEdit ? 'PATCH' : 'POST';

    const response = await apiFetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Gagal menyimpan menu');
    }

    resetMenuForm();
    showToast(isEdit ? 'Menu berhasil diperbarui' : 'Menu baru berhasil ditambahkan');
    await loadState({ preserveOrderLog: true });
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      showToast(error.message);
    }
  }
}

async function updateMenu(menuId, payload, successMessage = 'Menu berhasil diperbarui') {
  try {
    const response = await apiFetch(`/api/admin/menus/${encodeURIComponent(menuId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Gagal update menu');
    }

    showToast(successMessage);
    await loadState({ preserveOrderLog: true });
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      showToast(error.message);
    }
  }
}

async function deleteMenu(menuId) {
  const menu = app.adminMenus.find((item) => item.id === menuId);
  if (!menu) return;

  const confirmed = window.confirm(
    `Hapus menu ${menu.name}? Menu yang sudah pernah dipakai order tidak bisa dihapus.`
  );
  if (!confirmed) return;

  try {
    const response = await apiFetch(`/api/admin/menus/${encodeURIComponent(menuId)}`, {
      method: 'DELETE'
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Gagal menghapus menu');
    }

    if (app.menuEditingId === menuId) {
      resetMenuForm();
    }

    showToast('Menu berhasil dihapus');
    await loadState({ preserveOrderLog: true });
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      showToast(error.message);
    }
  }
}

async function createOrUpdateIngredient(event) {
  event.preventDefault();

  if (!isAdminUser()) {
    showToast('Fitur ini hanya untuk admin');
    return;
  }

  const name = elements.ingredientName.value.trim();
  const category = elements.ingredientCategory.value.trim();
  const unit = elements.ingredientUnit.value.trim().toLowerCase();
  const stockQty = Number(elements.ingredientStockQty.value);
  const minStockQty = Number(elements.ingredientMinStockQty.value);
  const costPerUnit = Number.parseInt(elements.ingredientCostPerUnit.value, 10);
  const description = elements.ingredientDescription.value.trim();
  const manualPhotoUrl = elements.ingredientPhotoUrl.value.trim();
  const isActive = elements.ingredientIsActive.checked;

  if (!name || !category || !unit) {
    showToast('Nama, kategori, dan satuan bahan wajib diisi');
    return;
  }

  if (!Number.isFinite(stockQty) || stockQty < 0 || !Number.isFinite(minStockQty) || minStockQty < 0) {
    showToast('Stok dan min stok bahan harus angka >= 0');
    return;
  }

  if (!Number.isInteger(costPerUnit) || costPerUnit < 0) {
    showToast('Harga modal per unit harus angka >= 0');
    return;
  }

  let photoUrl = manualPhotoUrl;
  const file = elements.ingredientPhotoFile.files && elements.ingredientPhotoFile.files[0];
  if (file) {
    try {
      photoUrl = await readFileAsDataUrl(file);
    } catch (error) {
      showToast(error.message || 'Gagal membaca file foto');
      return;
    }
  }

  const payload = {
    name,
    category,
    unit,
    stockQty,
    minStockQty,
    costPerUnit,
    photoUrl,
    description,
    isActive
  };

  try {
    const isEdit = Boolean(app.ingredientEditingId);
    const endpoint = isEdit
      ? `/api/admin/ingredients/${encodeURIComponent(app.ingredientEditingId)}`
      : '/api/admin/ingredients';
    const method = isEdit ? 'PATCH' : 'POST';

    const response = await apiFetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Gagal menyimpan bahan');
    }

    resetIngredientForm();
    showToast(isEdit ? 'Bahan berhasil diperbarui' : 'Bahan baru berhasil ditambahkan');
    await loadState({ preserveOrderLog: true });
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      showToast(error.message);
    }
  }
}

async function updateIngredient(ingredientId, payload, successMessage = 'Bahan berhasil diperbarui') {
  try {
    const response = await apiFetch(`/api/admin/ingredients/${encodeURIComponent(ingredientId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Gagal update bahan');
    }

    showToast(successMessage);
    await loadState({ preserveOrderLog: true });
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      showToast(error.message);
    }
  }
}

async function deleteIngredient(ingredientId) {
  const ingredient = app.adminIngredients.find((item) => item.id === ingredientId);
  if (!ingredient) return;

  const confirmed = window.confirm(`Hapus bahan ${ingredient.name}?`);
  if (!confirmed) return;

  try {
    const response = await apiFetch(`/api/admin/ingredients/${encodeURIComponent(ingredientId)}`, {
      method: 'DELETE'
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Gagal menghapus bahan');
    }

    if (app.ingredientEditingId === ingredientId) {
      resetIngredientForm();
    }

    showToast('Bahan berhasil dihapus');
    await loadState({ preserveOrderLog: true });
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      showToast(error.message);
    }
  }
}

async function checkout() {
  if (!hasSelectedTable()) {
    showToast('Pilih meja terlebih dahulu sebelum checkout');
    return;
  }

  const cartItems = Array.from(app.cart.values());
  if (!cartItems.length) {
    showToast('Keranjang masih kosong');
    return;
  }

  try {
    const response = await apiFetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tableId: app.selectedTableId || 'Take Away',
        items: cartItems.map((item) => ({ productId: item.productId, qty: item.qty }))
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Checkout gagal');
    }

    app.cart.clear();
    renderCart();
    await loadState({ preserveOrderLog: false });
    showToast('Order berhasil dibuat');
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      showToast(error.message);
    }
  }
}

async function updateOrderStatus(orderCode, status) {
  const label = status === 'Done' ? 'selesaikan' : 'batalkan';
  const confirmed = window.confirm(`Yakin ingin ${label} order ${orderCode}?`);
  if (!confirmed) return;

  const note = window.prompt('Catatan perubahan status (opsional):', '');
  if (note === null) {
    return;
  }

  try {
    const response = await apiFetch(`/api/orders/${encodeURIComponent(orderCode)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal memperbarui status order');
    }

    await loadState({ preserveOrderLog: true });
    await fetchOrderLogs(orderCode, { silent: true });
    showToast(`Status order ${orderCode} menjadi ${status}`);
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      showToast(error.message);
    }
  }
}

async function fetchOrderLogs(orderCode, options = {}) {
  const silent = Boolean(options.silent);

  try {
    const response = await apiFetch(`/api/orders/${encodeURIComponent(orderCode)}/logs`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal memuat log order');
    }

    app.selectedOrderForLog = orderCode;
    renderOrderLogDetails(orderCode, result.logs || []);
  } catch (error) {
    if (error.message !== 'Unauthorized' && !silent) {
      showToast(error.message);
    }
  }
}

async function exportExcel() {
  if (!app.user || app.user.role !== 'admin') {
    showToast('Export hanya tersedia untuk admin');
    return;
  }

  try {
    const range = elements.exportRange.value || 'daily';
    const date = elements.exportDate.value || formatLocalDateInput(new Date());
    const params = new URLSearchParams({ range, date });
    const response = await apiFetch(`/api/export/orders.xlsx?${params.toString()}`);
    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.message || 'Gagal export Excel');
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get('Content-Disposition') || '';
    const matchedName = contentDisposition.match(/filename="?([^\"]+)"?/i);
    const filename = matchedName ? matchedName[1] : 'orders.xlsx';

    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);

    showToast('File Excel berhasil diunduh');
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      showToast(error.message);
    }
  }
}

async function loadAdminData() {
  if (!app.user || app.user.role !== 'admin') {
    app.adminUsers = [];
    app.backups = [];
    app.adminMenus = [];
    app.adminIngredients = [];
    app.dbTables = [];
    app.selectedDbTable = '';
    app.dbTableColumns = [];
    app.dbTableRows = [];
    app.dbTableTotal = 0;
    resetMenuForm();
    resetIngredientForm();
    renderMenuTable();
    renderIngredientTable();
    renderUsersTable();
    renderBackupsTable();
    renderDbTableSelector();
    renderDbTableData();
    elements.backupAutoInfo.textContent = 'Auto backup: -';
    return;
  }

  if (app.loadingAdminData) {
    return;
  }

  app.loadingAdminData = true;

  try {
    const [menusResponse, ingredientsResponse, usersResponse, backupsResponse] = await Promise.all([
      apiFetch('/api/admin/menus'),
      apiFetch('/api/admin/ingredients'),
      apiFetch('/api/admin/users'),
      apiFetch('/api/admin/backups')
    ]);

    const menusBody = await menusResponse.json();
    const ingredientsBody = await ingredientsResponse.json();
    const usersBody = await usersResponse.json();
    const backupsBody = await backupsResponse.json();

    if (!menusResponse.ok) {
      throw new Error(menusBody.message || 'Gagal memuat data menu');
    }

    if (!ingredientsResponse.ok) {
      throw new Error(ingredientsBody.message || 'Gagal memuat data bahan');
    }

    if (!usersResponse.ok) {
      throw new Error(usersBody.message || 'Gagal memuat data user');
    }

    if (!backupsResponse.ok) {
      throw new Error(backupsBody.message || 'Gagal memuat data backup');
    }

    app.adminMenus = Array.isArray(menusBody.menus) ? menusBody.menus : [];
    app.adminIngredients = Array.isArray(ingredientsBody.ingredients)
      ? ingredientsBody.ingredients
      : [];
    app.adminUsers = Array.isArray(usersBody.users) ? usersBody.users : [];
    app.backups = Array.isArray(backupsBody.backups) ? backupsBody.backups : [];

    renderMenuTable();
    renderIngredientTable();
    renderUsersTable();
    renderBackupsTable();
    await loadDbTables({ silent: true });

    if (app.data && app.data.backupConfig) {
      const interval = app.data.backupConfig.autoBackupIntervalHours;
      const maxFiles = app.data.backupConfig.maxBackupFiles;
      elements.backupAutoInfo.textContent = `Auto backup setiap ${interval} jam | simpan max ${maxFiles} file`;
    }
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      showToast(error.message);
    }
  } finally {
    app.loadingAdminData = false;
  }
}

async function updateUser(userId, payload) {
  try {
    const response = await apiFetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Gagal update user');
    }

    showToast('User berhasil diperbarui');
    await loadState({ preserveOrderLog: true });
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      showToast(error.message);
    }
  }
}

async function resetUserPassword(userId) {
  const useCustomPassword = window.confirm(
    'Klik OK untuk isi password manual. Klik Cancel untuk generate password sementara otomatis.'
  );

  let password;
  if (useCustomPassword) {
    password = window.prompt('Masukkan password baru (minimal 6 karakter):', '');
    if (password === null) return;
    if (password.trim().length < 6) {
      showToast('Password minimal 6 karakter');
      return;
    }
  }

  try {
    const response = await apiFetch(`/api/admin/users/${userId}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(password ? { password } : {})
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Gagal reset password');
    }

    if (body.temporaryPassword) {
      window.alert(`Password sementara user ID ${userId}: ${body.temporaryPassword}`);
    }

    showToast('Password user berhasil direset');
    await loadState({ preserveOrderLog: true });
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      showToast(error.message);
    }
  }
}

async function createUserFromForm(event) {
  event.preventDefault();

  const username = elements.newUserUsername.value.trim();
  const fullName = elements.newUserFullName.value.trim();
  const role = elements.newUserRole.value;
  const password = elements.newUserPassword.value;

  if (!username || !fullName || !password) {
    showToast('Username, nama, dan password wajib diisi');
    return;
  }

  try {
    const response = await apiFetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, fullName, role, password })
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Gagal menambah user');
    }

    elements.newUserUsername.value = '';
    elements.newUserFullName.value = '';
    elements.newUserPassword.value = '';
    elements.newUserRole.value = 'cashier';

    if (body.user && body.user.temporaryPassword) {
      window.alert(`Password sementara user baru: ${body.user.temporaryPassword}`);
    }

    showToast('User baru berhasil ditambahkan');
    await loadState({ preserveOrderLog: true });
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      showToast(error.message);
    }
  }
}

async function createBackup() {
  if (!app.user || app.user.role !== 'admin') {
    showToast('Hanya admin yang dapat membuat backup');
    return;
  }

  try {
    const response = await apiFetch('/api/admin/backups', {
      method: 'POST'
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Gagal membuat backup');
    }

    showToast(`Backup berhasil: ${body.backup.fileName}`);
    await loadState({ preserveOrderLog: true });
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      showToast(error.message);
    }
  }
}

async function restoreBackup(fileName) {
  if (!fileName) return;

  const confirmed = window.confirm(
    `Restore backup ${fileName}? Sistem akan masuk maintenance sementara.`
  );
  if (!confirmed) return;

  try {
    const response = await apiFetch('/api/admin/backups/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName })
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Gagal restore backup');
    }

    showToast('Restore berhasil, memuat ulang data...');
    await loadState({ preserveOrderLog: false });
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      showToast(error.message);
    }
  }
}

async function loadState(options = {}) {
  const preserveOrderLog = Boolean(options.preserveOrderLog);

  const params = new URLSearchParams({
    range: app.reportFilter.range,
    date: app.reportFilter.date
  });

  const response = await apiFetch(`/api/state?${params.toString()}`);
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message || 'Gagal memuat data');
  }

  app.data = await response.json();
  app.user = app.data.currentUser || app.user;

  renderCurrentUser();
  renderReportWindow();
  renderSummary();
  renderCategoryTabs();
  renderTableSelect();
  renderTables();
  renderProducts();
  renderCart();
  renderOrderHistory();
  renderInventory();
  renderReports();
  renderDonut();
  drawSalesChart();

  if (preserveOrderLog && app.selectedOrderForLog) {
    await fetchOrderLogs(app.selectedOrderForLog, { silent: true });
  } else if (!app.selectedOrderForLog) {
    renderOrderLogPlaceholder();
  }

  if (app.user && app.user.role === 'admin') {
    await loadAdminData();
  } else {
    app.adminMenus = [];
    app.adminIngredients = [];
    app.adminUsers = [];
    app.backups = [];
    app.dbTables = [];
    app.selectedDbTable = '';
    app.dbTableColumns = [];
    app.dbTableRows = [];
    app.dbTableTotal = 0;
    resetMenuForm();
    resetIngredientForm();
    renderMenuTable();
    renderIngredientTable();
    renderUsersTable();
    renderBackupsTable();
    renderDbTableSelector();
    renderDbTableData();
  }
}

async function login(username, password) {
  const response = await apiFetch(
    '/api/auth/login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    },
    { allowUnauthorized: true }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Login gagal');
  }

  app.user = result.user;
  renderCurrentUser();
  showAppShell();
  navigateToRoute(app.currentRoute, { push: false, silentBlockedNotice: true });
  await loadState();
}

async function logout() {
  try {
    await apiFetch('/api/auth/logout', {
      method: 'POST'
    });
  } catch (_) {
    // No-op: tetap lanjut reset UI
  }

  resetAppState();
  showAuthScreen();
  showToast('Logout berhasil');
}

async function checkSession() {
  const response = await apiFetch('/api/auth/me', {}, { allowUnauthorized: true });
  if (!response.ok) {
    return null;
  }

  const result = await response.json();
  return result.user || null;
}

function bindEvents() {
  elements.productSearch.addEventListener('input', (event) => {
    app.searchKeyword = event.target.value.trim();
    renderProducts();
  });

  elements.tableSelect.addEventListener('change', (event) => {
    app.selectedTableId = event.target.value || null;
    if (!app.selectedTableId && app.cart.size > 0) {
      app.cart.clear();
    }
    renderTableSelect();
    renderTables();
    renderProducts();
    renderCart();
  });

  elements.checkoutBtn.addEventListener('click', checkout);
  elements.exportExcelBtn.addEventListener('click', exportExcel);
  elements.logoutBtn.addEventListener('click', logout);

  elements.applyReportFilterBtn.addEventListener('click', async () => {
    app.reportFilter = {
      range: elements.reportRange.value || 'daily',
      date: elements.reportDate.value || formatLocalDateInput(new Date())
    };

    try {
      await loadState({ preserveOrderLog: false });
      showToast('Filter dashboard diterapkan');
    } catch (error) {
      showToast(error.message || 'Gagal menerapkan filter');
    }
  });

  elements.resetReportFilterBtn.addEventListener('click', async () => {
    app.reportFilter = defaultReportFilter();
    syncReportFilterInputs();

    try {
      await loadState({ preserveOrderLog: false });
      showToast('Filter dashboard direset');
    } catch (error) {
      showToast(error.message || 'Gagal reset filter');
    }
  });

  elements.createUserForm.addEventListener('submit', createUserFromForm);
  elements.createBackupBtn.addEventListener('click', createBackup);
  elements.menuForm.addEventListener('submit', createOrUpdateMenu);
  elements.menuFormResetBtn.addEventListener('click', resetMenuForm);
  elements.ingredientForm.addEventListener('submit', createOrUpdateIngredient);
  elements.ingredientFormResetBtn.addEventListener('click', resetIngredientForm);
  elements.dbTableLoadBtn.addEventListener('click', async () => {
    if (!app.selectedDbTable) {
      showToast('Pilih tabel database terlebih dahulu');
      return;
    }
    await loadDbTableRows(app.selectedDbTable);
  });
  elements.dbTableRefreshBtn.addEventListener('click', async () => {
    await loadDbTables();
  });
  elements.dbTableSelect.addEventListener('change', async (event) => {
    app.selectedDbTable = event.target.value || '';
    if (!app.selectedDbTable) {
      renderDbTableData();
      return;
    }
    await loadDbTableRows(app.selectedDbTable);
  });

  elements.loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = elements.loginUsername.value.trim();
    const password = elements.loginPassword.value;

    try {
      await login(username, password);
      elements.loginPassword.value = '';
      showToast('Login berhasil');
    } catch (error) {
      showToast(error.message);
    }
  });

  elements.mainNav.addEventListener('click', (event) => {
    const link = event.target.closest('.nav-link[data-route]');
    if (!link) return;

    event.preventDefault();
    navigateToRoute(link.dataset.route, { push: true });
  });

  window.addEventListener('popstate', () => {
    const route = routeFromPath(window.location.pathname);
    navigateToRoute(route, { push: false, silentBlockedNotice: true });
  });

  window.addEventListener('resize', () => {
    if (app.data) drawSalesChart();
  });
}

async function init() {
  bindEvents();
  renderDate();
  app.currentRoute = routeFromPath(window.location.pathname);
  renderRoute();

  app.reportFilter = defaultReportFilter();
  syncReportFilterInputs();
  resetMenuForm();
  resetIngredientForm();
  renderMenuTable();
  renderIngredientTable();
  elements.dbTableLimit.value = '100';
  renderDbTableSelector();
  renderDbTableData();

  elements.exportRange.value = 'daily';
  elements.exportDate.value = formatLocalDateInput(new Date());
  elements.exportExcelBtn.disabled = true;
  elements.exportRange.disabled = true;
  elements.exportDate.disabled = true;
  elements.exportExcelBtn.title = 'Login sebagai admin untuk export';

  setInterval(renderDate, 60 * 1000);

  try {
    const user = await checkSession();
    if (!user) {
      showAuthScreen();
      return;
    }

    app.user = user;
    showAppShell();
    navigateToRoute(app.currentRoute, { push: false, silentBlockedNotice: true });
    await loadState();
  } catch (error) {
    showAuthScreen();
    showToast(error.message || 'Terjadi error saat inisialisasi aplikasi');
  }
}

init();
