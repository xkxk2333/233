// game.js (修正ID键名问题 - Part 1)
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const screens = {};
    const screenIdKeysKebab = [ // HTML ID 应该是 kebab-case + '-screen'
        'main', 'warehouse', 'market', 'mercenary', 'character-progression',
        'world-selection', 'preparation', 'map', 'status', 'encounter',
        'combat', 'mission-success', 'mission-failure'
    ];
    screenIdKeysKebab.forEach(idKeyKebab => {
        const element = document.getElementById(idKeyKebab + '-screen');
        const camelCaseKey = idKeyKebab.replace(/-([a-z])/g, g => g[1].toUpperCase());
        if (element) {
            screens[camelCaseKey] = element; // Store with camelCase key: screens.characterProgression
        } else {
            console.error(`CRITICAL: Screen element with ID '${idKeyKebab}-screen' not found!`);
        }
    });

    const popups = {};
    const popupIdKeysKebab = ['loot', 'safebox-selection', 'tasks', 'evacuation-confirm'];
    popupIdKeysKebab.forEach(idKeyKebab => {
        const element = document.getElementById(idKeyKebab + '-popup');
        const camelCaseKey = idKeyKebab.replace(/-([a-z])/g, g => g[1].toUpperCase());
        if (element) {
            popups[camelCaseKey] = element; // Store with camelCase key: popups.safeboxSelection
        } else {
            console.warn(`Warning: Popup element with ID '${idKeyKebab}-popup' not found.`);
        }
    });

    console.log("Initialized screens object:", screens);
    console.log("Initialized popups object:", popups);

    // Player UI elements (进行空检查)
    const playerLevelDisplay = document.getElementById('player-level');
    const playerCurrencyDisplay = document.getElementById('player-currency');
    const mainWeaponDisplay = document.getElementById('main-weapon-display');
    const chestArmorDisplay = document.getElementById('chest-armor-display');

    // Warehouse UI
    const playerEquipmentSlotsUI = {
        head: document.getElementById('eq-head'), body: document.getElementById('eq-body'),
        legs: document.getElementById('eq-legs'), feet: document.getElementById('eq-feet'),
        mainhand: document.getElementById('eq-mainhand'), offhand: document.getElementById('eq-offhand'),
        backpack: document.getElementById('eq-backpack')
    };
    const warehouseEquipmentItemsGrid = document.getElementById('warehouse-equipment-items');
    const warehouseConsumableItemsGrid = document.getElementById('warehouse-consumable-items');
    const warehouseSafeboxItemsGrid = document.getElementById('warehouse-safebox-items');
    const safeboxSizeDisplay = document.getElementById('safebox-size-display');
    const safeboxCapacityDisplay = document.getElementById('safebox-capacity-display');
    const detailedStatsPanel = document.getElementById('detailed-stats-panel');
    const statHpDisplay = document.getElementById('stat-hp');
    const statMaxHpDisplay = document.getElementById('stat-maxhp');

    // Market UI Elements
    const marketBuyListUI = document.getElementById('market-buy-list');
    const marketSellListUI = document.getElementById('market-sell-list');

    // Mercenary UI Elements
    const mercenaryListUI = document.getElementById('mercenary-list');

    // World Selection UI
    const worldListContainer = document.getElementById('world-list');

    // Preparation UI
    const prepWorldNameUI = document.getElementById('prep-world-name');
    const prepMainhandUI = document.getElementById('prep-mainhand');
    const prepArmorUI = document.getElementById('prep-armor');
    const prepBackpackUI = document.getElementById('prep-backpack');
    const prepSafeboxUI = document.getElementById('prep-safebox');
    const prepReqTextUI = document.getElementById('prep-req-text');
    const prepValueUI = document.getElementById('prep-value');
    const prepCoordCostUI = document.getElementById('prep-coord-cost');
    const prepFuelCostUI = document.getElementById('prep-fuel-cost');

    // Map UI
    const mapCurrentWorldNameUI = document.getElementById('map-current-world-name');
    const mapPlayerHpUI = document.getElementById('map-player-hp');
    const mapPlayerMaxHpUI = document.getElementById('map-player-maxhp');
    const mapMovesUI = document.getElementById('map-moves');
    const mapEventLogUI = document.getElementById('map-event-log');
    const mapCurrentLocationNameUI = document.getElementById('map-current-location-name');
    const mapNodesContainer = document.getElementById('map-nodes-container');

    // Loot Popup UI
    const lootPopupTitle = document.getElementById('loot-popup-title');
    const lootValueDisplay = document.getElementById('loot-value');
    const lootItemsGrid = document.getElementById('loot-items-grid');

    // Status Screen UI
    const statusTotalHpUI = document.getElementById('status-total-hp');
    const statusTotalMaxHpUI = document.getElementById('status-total-maxhp');
    const bodyPartStatusUIs = { /* Populated in initializeBodyParts */ };
    const availableMedsListUI = document.getElementById('available-meds-list');

    // Encounter Screen UI
    const encounterTitleUI = document.getElementById('encounter-title');
    const encounterDescriptionUI = document.getElementById('encounter-description');
    const encounterDistanceUI = document.getElementById('encounter-distance');
    const encounterEnemyGearUI = document.getElementById('encounter-enemy-gear');
    const encounterOptionsUI = document.getElementById('encounter-options');

    // Combat Screen UI
    const combatTargetNameUI = document.getElementById('combat-target-name');
    const combatPlayerHpUI = document.getElementById('combat-player-hp');
    const combatPlayerMpUI = document.getElementById('combat-player-mp');
    const combatPlayerWeaponUI = document.getElementById('combat-player-weapon');
    const combatWeaponRangeUI = document.getElementById('combat-weapon-range');
    const combatEnemyHpUI = document.getElementById('combat-enemy-hp');
    const combatEnemyActualHpUI = document.getElementById('combat-enemy-actual-hp');
    const combatCurrentDistanceUI = document.getElementById('combat-current-distance');
    const combatLogUI = document.getElementById('combat-log');
    const targetPartsUI = document.getElementById('target-parts');

    // Mission Success UI
    const successTotalValueUI = document.getElementById('success-total-value');
    const successKillsUI = document.getElementById('success-kills');
    const successAchievementsUI = document.getElementById('success-achievements');
    const successExpUI = document.getElementById('success-exp');
    const successBackpackLootUI = document.getElementById('tab-loot-backpack');
    const successSafeboxLootUI = document.getElementById('tab-loot-safebox');


    // --- Game State --- (Same as previous full game.js)
    let currentPlayer = {
        level: 1, currency: 2000, baseStats: { ...GAME_DATA.PLAYER_BASE_STATS },
        currentHp: GAME_DATA.PLAYER_BASE_STATS.maxHp, currentMp: GAME_DATA.PLAYER_BASE_STATS.maxMp,
        experience: 0, expToNextLevel: GAME_DATA.CULTIVATION_RANKS[0].expNeeded, skillPoints: 0,
        equipment: { head: null, body: "破旧皮甲", legs: null, feet: null, mainhand: "新手手枪", offhand: null, backpack: "标准背包" },
        inventory: [], safebox: { type: null, capacity: 0, items: [] }, skills: [],
        activeGongfa: ["《电弧吐纳法》Lv.1"], activeBloodline: null, installedCybernetics: {},
        bodyPartConditions: {}, activeTasks: {}, completedTasks: []
    };
    let currentMissionState = { world: null, currentMapNodeId: null, mapNodesState: {}, movesMade: 0, tempInventory: [], keyItemsFound: [], enemiesKilled: 0, missionValue: 0 };
    let currentCombatState = { enemy: null, distance: 30, playerTurn: true, log: [], round: 0 };
    let activeScreen = 'main'; // Stores camelCase key
    let previousScreenForWarehouse = null; // Stores camelCase key
    let hiredMercenaries = [];


    // --- Utility Functions ---
    function showScreen(screenIdKeyCamelCase) {
        Object.values(screens).forEach(s => { if (s && typeof s.classList !== 'undefined') s.classList.add('hidden'); });
        Object.values(popups).forEach(p => { if (p && typeof p.classList !== 'undefined') p.classList.add('hidden'); });

        const targetScreenElement = screens[screenIdKeyCamelCase];
        if (targetScreenElement && typeof targetScreenElement.classList !== 'undefined') {
            targetScreenElement.classList.remove('hidden');
            activeScreen = screenIdKeyCamelCase;
        } else {
            console.error(`Screen element for key '${screenIdKeyCamelCase}' not found or invalid. Element:`, targetScreenElement);
            const mainScreenElement = screens['main'];
            if (mainScreenElement && typeof mainScreenElement.classList !== 'undefined') {
                 mainScreenElement.classList.remove('hidden'); activeScreen = 'main';
                 console.log("Fallback to main screen due to error showing:", screenIdKeyCamelCase);
            } else { console.error("CRITICAL: Main screen also not found for fallback!"); }
        }
    }

    function showPopup(popupIdKeyCamelCase) {
        const targetPopupElement = popups[popupIdKeyCamelCase];
        if (targetPopupElement && typeof targetPopupElement.classList !== 'undefined') targetPopupElement.classList.remove('hidden');
        else console.error(`Popup element for key '${popupIdKeyCamelCase}' not found or invalid.`);
    }
    function hidePopup(popupIdKeyCamelCase) {
        const targetPopupElement = popups[popupIdKeyCamelCase];
        if (targetPopupElement && typeof targetPopupElement.classList !== 'undefined') targetPopupElement.classList.add('hidden');
    }
    // ... (updatePlayerUIDisplay, logTo, addItemToInventory, renderInventoryGrid, equipItem, unequipItem, updatePlayerEquipmentUI - same as previous full game.js, just ensure they use camelCase keys if they ever directly access screens/popups object by string, which they mostly don't)
    function updatePlayerUIDisplay() {
        if (playerLevelDisplay) playerLevelDisplay.textContent = GAME_DATA.CULTIVATION_RANKS[currentPlayer.level-1]?.rankName || `等级 ${currentPlayer.level}`;
        if (playerCurrencyDisplay) playerCurrencyDisplay.textContent = currentPlayer.currency;
        if (mainWeaponDisplay) mainWeaponDisplay.textContent = currentPlayer.equipment.mainhand ? getItemData(currentPlayer.equipment.mainhand)?.name || '-' : '-';
        if (chestArmorDisplay) chestArmorDisplay.textContent = currentPlayer.equipment.body ? getItemData(currentPlayer.equipment.body)?.name || '-' : '-';
        if (detailedStatsPanel && !detailedStatsPanel.classList.contains('hidden')) {
            if(statHpDisplay) statHpDisplay.textContent = currentPlayer.currentHp;
            if(statMaxHpDisplay) statMaxHpDisplay.textContent = currentPlayer.baseStats.maxHp;
            const statStrEl = document.getElementById('stat-str'); if(statStrEl) statStrEl.textContent = currentPlayer.baseStats.strength;
            const statAgiEl = document.getElementById('stat-agi'); if(statAgiEl) statAgiEl.textContent = currentPlayer.baseStats.agility;
            const statConEl = document.getElementById('stat-con'); if(statConEl) statConEl.textContent = currentPlayer.baseStats.constitution;
            const statPerEl = document.getElementById('stat-per'); if(statPerEl) statPerEl.textContent = currentPlayer.baseStats.perception;
            const statIntEl = document.getElementById('stat-int'); if(statIntEl) statIntEl.textContent = currentPlayer.baseStats.intelligence;
            const statMpEl = document.getElementById('stat-mp'); if(statMpEl) statMpEl.textContent = currentPlayer.currentMp;
            const statMaxMpEl = document.getElementById('stat-maxmp'); if(statMaxMpEl) statMaxMpEl.textContent = currentPlayer.baseStats.maxMp;
        }
        const charProgScreen = screens['characterProgression']; // Use camelCase key
        if (charProgScreen && !charProgScreen.classList.contains('hidden')) {
            renderCharacterProgressionScreen();
        }
        if (activeScreen === 'map' && mapPlayerHpUI && mapPlayerMaxHpUI) { mapPlayerHpUI.textContent = currentPlayer.currentHp; mapPlayerMaxHpUI.textContent = currentPlayer.baseStats.maxHp; }
    }
    function logTo(logElement, message, type = 'info') {
        if (!logElement) return; const p = document.createElement('p');
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        p.textContent = `[${timestamp}] ${message}`;
        if (type === 'error') p.style.color = '#f56565'; if (type === 'success') p.style.color = '#68d391';
        if (type === 'combat') p.style.color = '#f6e05e'; if (type === 'system') p.style.color = '#a0aec0';
        logElement.appendChild(p); logElement.scrollTop = logElement.scrollHeight;
    }
    function addItemToInventory(inventoryArray, itemId, quantity = 1) {
        const itemData = getItemData(itemId); if (!itemData) { console.error("Unknown item to add:", itemId); return false; }
        const existingItem = inventoryArray.find(i => i.id === itemId && i.data.type !== 'weapon' && i.data.type !== 'armor' && i.data.type !== 'backpack');
        if (existingItem) { existingItem.quantity += quantity; } else { inventoryArray.push({ id: itemId, quantity: quantity, data: JSON.parse(JSON.stringify(itemData)) }); }
        return true;
    }
    function renderInventoryGrid(gridElement, inventoryArray, clickCallback, context = null) {
        if (!gridElement) return; gridElement.innerHTML = '';
        inventoryArray.forEach(item => {
            const itemDiv = document.createElement('div'); itemDiv.classList.add('grid-item'); if(item.data.rarity) itemDiv.classList.add(`item-${item.data.rarity}`);
            const nameSpan = document.createElement('span'); nameSpan.classList.add('item-name'); nameSpan.textContent = item.data.name; itemDiv.appendChild(nameSpan);
            if (item.quantity > 1 && item.data.type !== 'weapon' && item.data.type !== 'armor' && item.data.type !== 'backpack') { const quantitySpan = document.createElement('span'); quantitySpan.classList.add('item-quantity'); quantitySpan.textContent = `x${item.quantity}`; itemDiv.appendChild(quantitySpan); }
            itemDiv.title = `${item.data.name} (${item.data.size ? item.data.size.join('x') : '1x1'}) - ${item.data.description || '无描述'}`;
            if (clickCallback) itemDiv.addEventListener('click', () => clickCallback(item, context));
            gridElement.appendChild(itemDiv);
        });
    }
    function equipItem(itemToEquip) {
        if (!itemToEquip || !itemToEquip.data || !itemToEquip.data.slot) { console.error("Cannot equip invalid item:", itemToEquip); return; }
        const slot = itemToEquip.data.slot;
        if (currentPlayer.equipment[slot]) { const currentlyEquippedId = currentPlayer.equipment[slot]; if (currentlyEquippedId !== itemToEquip.id) addItemToInventory(currentPlayer.inventory, currentlyEquippedId, 1); }
        currentPlayer.equipment[slot] = itemToEquip.id;
        const invItemIndex = currentPlayer.inventory.findIndex(inv => inv.id === itemToEquip.id);
        if (invItemIndex > -1) { currentPlayer.inventory[invItemIndex].quantity--; if (currentPlayer.inventory[invItemIndex].quantity <= 0) currentPlayer.inventory.splice(invItemIndex, 1); }
        else { console.warn("Equipped item not found in inventory to remove:", itemToEquip.id); }
        updatePlayerEquipmentUI(); renderWarehouseTabs(); updatePlayerUIDisplay();
    }
    function unequipItem(slot) {
        if (currentPlayer.equipment[slot]) { const itemId = currentPlayer.equipment[slot]; addItemToInventory(currentPlayer.inventory, itemId, 1); currentPlayer.equipment[slot] = null; updatePlayerEquipmentUI(); renderWarehouseTabs(); updatePlayerUIDisplay(); }
    }
    function updatePlayerEquipmentUI() {
        for (const slot in playerEquipmentSlotsUI) { if (playerEquipmentSlotsUI.hasOwnProperty(slot) && playerEquipmentSlotsUI[slot]) { const itemId = currentPlayer.equipment[slot]; playerEquipmentSlotsUI[slot].textContent = itemId ? getItemData(itemId)?.name || '-' : '-'; }}
    }
    function renderWarehouseTabs() {
        if(warehouseEquipmentItemsGrid) { const eqForWh = currentPlayer.inventory.filter(i => i.data.type === 'weapon' || i.data.type === 'armor' || i.data.type === 'backpack'); renderInventoryGrid(warehouseEquipmentItemsGrid, eqForWh, (item) => { if (confirm(`装备 ${item.data.name} 到 ${item.data.slot} 槽位吗?`)) equipItem(item); });}
        if(warehouseConsumableItemsGrid) { const cons = currentPlayer.inventory.filter(i => i.data.type === 'consumable' || i.data.type === 'material' || i.data.type === 'key_item' || i.data.type === 'collectible'); renderInventoryGrid(warehouseConsumableItemsGrid, cons, (item) => { if (item.data.type === 'consumable') { if (confirm(`要使用 ${item.data.name} 吗?`)) { if (useConsumable(item.id, 'warehouse')) renderWarehouseTabs(); } } else { alert(`物品信息: ${item.data.name}\n类型: ${item.data.type}\n描述: ${item.data.description || '无'}`); } });}
        if(safeboxSizeDisplay && safeboxCapacityDisplay) { safeboxSizeDisplay.textContent = currentPlayer.safebox.type ? `${currentPlayer.safebox.type}` : "未选择"; safeboxCapacityDisplay.textContent = currentPlayer.safebox.capacity; }
        if(warehouseSafeboxItemsGrid) renderInventoryGrid(warehouseSafeboxItemsGrid, currentPlayer.safebox.items, (item) => { if (confirm(`将 ${item.data.name} 从安全箱移至主背包?`)) { if (addItemToInventory(currentPlayer.inventory, item.id, item.quantity)) { const idx = currentPlayer.safebox.items.findIndex(i=>i.id === item.id && i.quantity === item.quantity); if(idx > -1) currentPlayer.safebox.items.splice(idx,1); renderWarehouseTabs(); } else { alert("移至主背包失败！");}} });
    }
    function useConsumable(itemId, context = 'mission') {
        let inventorySource = (context === 'mission' || context === 'status_screen' || context === 'map_inventory_popup') ? currentMissionState.tempInventory : currentPlayer.inventory;
        const itemIndex = inventorySource.findIndex(i => i.id === itemId); if (itemIndex === -1) { console.error("Consumable not found:", itemId, context); return false; }
        const itemToUse = inventorySource[itemIndex]; const itemData = itemToUse.data; let used = false;
        const logTarget = (context === 'mission' || context === 'status_screen' || context === 'map_inventory_popup') ? mapEventLogUI : console;
        if (itemData.effectTarget === 'hp') { const heal = getRandomInt(itemData.effectValue[0], itemData.effectValue[1]); currentPlayer.currentHp = Math.min(currentPlayer.baseStats.maxHp, currentPlayer.currentHp + heal); logTo(logTarget, `使用了 ${itemData.name}，恢复了 ${heal}HP。`, "success"); used = true; }
        else if (itemData.effectTarget === 'hp_all_parts' && itemData.name === "高级医疗套件") {
            const healRange = itemData.effectValue || [100,150]; const totalHeal = getRandomInt(healRange[0], healRange[1]); let actualHealed = 0; logTo(logTarget, `使用 ${itemData.name}...`, "system");
            GAME_DATA.BODY_PARTS.forEach(pInf => { const part = currentPlayer.bodyPartConditions[pInf.id]; if (part && part.hp < part.maxHp) { const needed = part.maxHp - part.hp; const applied = Math.min(needed, Math.floor(totalHeal / GAME_DATA.BODY_PARTS.length) + getRandomInt(0, Math.floor(totalHeal * 0.05))); if(applied > 0){ part.hp += applied; actualHealed += applied; if (part.hp >= part.maxHp * 0.8 && (part.status === "重伤" || part.status === "损毁")) part.status = "轻伤"; if (part.hp >= part.maxHp && part.status !== "健康") part.status = "健康"; if (part.hp > part.maxHp) part.hp = part.maxHp;}}});
            let newGlobalHpSum = 0; GAME_DATA.BODY_PARTS.forEach(pI => { newGlobalHpSum += currentPlayer.bodyPartConditions[pI.id].hp; }); const avgPartHpPerc = newGlobalHpSum / GAME_DATA.BODY_PARTS.reduce((s,p)=>s+p.maxHp,0); currentPlayer.currentHp = Math.min(currentPlayer.baseStats.maxHp, Math.max(currentPlayer.currentHp, Math.round(currentPlayer.baseStats.maxHp * avgPartHpPerc) ));
            logTo(logTarget, `${itemData.name} 治疗了约 ${actualHealed}伤害。`, "success"); used = true;
        }
        if (used) { itemToUse.quantity--; if (itemToUse.quantity <= 0) inventorySource.splice(itemIndex, 1); updatePlayerUIDisplay(); if (activeScreen === 'status') renderStatusScreen(); if (activeScreen === 'map' && mapPlayerHpUI && mapPlayerMaxHpUI) { mapPlayerHpUI.textContent = currentPlayer.currentHp; mapPlayerMaxHpUI.textContent = currentPlayer.baseStats.maxHp; } if (activeScreen === 'combat') updateCombatUI(); }
        return used;
    }
    function renderMarketScreen() {
        const curTabEl = document.querySelector('#market-screen .tab-button.active'); let activeTabId = curTabEl ? curTabEl.dataset.tab : null;
        if (!activeTabId) { const firstTab = document.querySelector('#market-screen .tab-button'); if (firstTab) { firstTab.classList.add('active'); const ftc = document.getElementById(firstTab.dataset.tab); if(ftc) ftc.classList.remove('hidden'); activeTabId = firstTab.dataset.tab;} else { console.error("No tabs in market."); return; }}
        if (activeTabId === 'tab-buy') renderMarketBuyList(); else if (activeTabId === 'tab-sell') renderMarketSellList();
    }
    function renderMarketBuyList() {
        if(!marketBuyListUI) return; marketBuyListUI.innerHTML = '';
        GAME_DATA.MARKET_ITEMS.filter(item => item.type === "buy" || item.type === "both").forEach(marketItem => { const itemData = getItemData(marketItem.itemId); if (!itemData) { console.warn("Market buy item data not found:", marketItem.itemId); return; } const li = document.createElement('li'); li.className = `market-list-item item-${itemData.rarity || 'common'}`; li.innerHTML = `<span class="item-name">${itemData.name}</span> - 价格: ${marketItem.basePrice || marketItem.basePriceBuy} 灵石 (库存: ${marketItem.stock === Infinity ? '无限' : marketItem.stock}) <button class="buy-item-btn" data-item-id="${marketItem.itemId}" ${marketItem.stock === 0 && marketItem.stock !== Infinity ? 'disabled' : ''}>购买1个</button>`; marketBuyListUI.appendChild(li); });
        document.querySelectorAll('#market-buy-list .buy-item-btn').forEach(button => { button.addEventListener('click', (e) => buyItemFromMarket(e.target.dataset.itemId)); });
    }
    function buyItemFromMarket(itemId) {
        const ml = GAME_DATA.MARKET_ITEMS.find(mi => mi.itemId === itemId && (mi.type === "buy" || mi.type === "both")); const itemData = getItemData(itemId); if (!ml || !itemData) { alert("物品不存在或无法购买！"); return; }
        const price = ml.basePrice || ml.basePriceBuy; if (currentPlayer.currency < price) { alert("灵石不足！"); return; } if (ml.stock <= 0 && ml.stock !== Infinity) { alert("此物品已售罄！"); return; }
        currentPlayer.currency -= price; addItemToInventory(currentPlayer.inventory, itemId, 1); if (ml.stock !== Infinity) ml.stock--;
        alert(`购买 ${itemData.name} x1 成功！`); updatePlayerUIDisplay(); renderMarketBuyList();
    }
    function renderMarketSellList() {
        if(!marketSellListUI) return; marketSellListUI.innerHTML = '';
        const sellable = currentPlayer.inventory.filter(pItem => { const ml = GAME_DATA.MARKET_ITEMS.find(mItem => mItem.itemId === pItem.id && (mItem.type === "sell" || mItem.type === "both")); return getItemData(pItem.id) && ml && typeof ml.basePriceSell !== 'undefined'; });
        if (sellable.length === 0) { marketSellListUI.innerHTML = "<p>你的背包里没有市场商人回收的物品。</p>"; return; }
        renderInventoryGrid(marketSellListUI, sellable, (item) => sellItemToMarket(item));
    }
    function sellItemToMarket(playerItemFromGrid) {
        const ml = GAME_DATA.MARKET_ITEMS.find(mi => mi.itemId === playerItemFromGrid.id && (mi.type === "sell" || mi.type === "both")); const itemData = playerItemFromGrid.data; if (!ml || !itemData || typeof ml.basePriceSell === 'undefined') { alert("此物品无法出售！"); return; }
        if (confirm(`确定以 ${ml.basePriceSell} 灵石出售 ${itemData.name} x1 吗？`)) {
            const invItem = currentPlayer.inventory.find(i => i.id === playerItemFromGrid.id);
            if (invItem) { invItem.quantity--; if (invItem.quantity <= 0) currentPlayer.inventory = currentPlayer.inventory.filter(i => i.id !== playerItemFromGrid.id); } else { alert("错误：背包中未找到物品。"); return; }
            currentPlayer.currency += ml.basePriceSell; alert(`出售 ${itemData.name} x1 成功！`); updatePlayerUIDisplay(); renderMarketSellList();
        }
    }
    function renderMercenaryScreen() {
        if(!mercenaryListUI) return; mercenaryListUI.innerHTML = '';
        GAME_DATA.MERCENARIES_AVAILABLE.forEach(merc => { const isHired = hiredMercenaries.find(h => h.id === merc.id); const card = document.createElement('div'); card.classList.add('mercenary-card'); card.innerHTML = `<h4>${merc.name} (Lv.${merc.level} ${merc.type})</h4><p>${merc.description}</p><p>费用: ${merc.cost}灵石 | 维持: ${merc.upkeep}/次</p>${isHired ? '<button disabled>已雇佣</button> <button class="fire-merc-btn" data-merc-id="'+merc.id+'">解雇</button>' : '<button class="hire-merc-btn" data-merc-id="'+merc.id+'">雇佣</button>'}`; mercenaryListUI.appendChild(card); });
        document.querySelectorAll('#mercenary-list .hire-merc-btn').forEach(button => { button.addEventListener('click', (e) => hireMercenary(e.target.dataset.mercId)); });
        document.querySelectorAll('#mercenary-list .fire-merc-btn').forEach(button => { button.addEventListener('click', (e) => fireMercenary(e.target.dataset.mercId)); });
    }
    function hireMercenary(mercId) {
        const mercData = GAME_DATA.MERCENARIES_AVAILABLE.find(m => m.id === mercId); if (!mercData) return; if (hiredMercenaries.find(h => h.id === mercId)) { alert("已雇佣！"); return; } if (currentPlayer.currency < mercData.cost) { alert("灵石不足！"); return; }
        currentPlayer.currency -= mercData.cost; hiredMercenaries.push(JSON.parse(JSON.stringify(mercData))); alert(`成功雇佣 ${mercData.name}!`); updatePlayerUIDisplay(); renderMercenaryScreen();
    }
    function fireMercenary(mercId) {
        const idx = hiredMercenaries.findIndex(m => m.id === mercId); if (idx > -1) { const name = hiredMercenaries[idx].name; if (confirm(`解雇 ${name}？`)) { hiredMercenaries.splice(idx, 1); alert(`${name} 已解雇。`); renderMercenaryScreen(); }}
    }
    // (Continued in Part 2)
// game.js (修正ID键名问题 - Part 2)
    function checkLevelUpOrBreakthrough() {
        const btn = document.getElementById('btn-breakthrough-cultivation'); if(!btn) return;
        const currentRankIndex = Math.min(currentPlayer.level - 1, GAME_DATA.CULTIVATION_RANKS.length - 1);
        const currentRankData = GAME_DATA.CULTIVATION_RANKS[currentRankIndex];
        const nextRankData = GAME_DATA.CULTIVATION_RANKS[currentPlayer.level]; // Next is current level (index in array)
        if (currentRankData && currentPlayer.experience >= currentRankData.expNeeded && nextRankData) {
            btn.disabled = false; btn.textContent = `突破至 ${nextRankData.rankName}!`;
        } else if (!nextRankData) {
            btn.disabled = true; btn.textContent = `已达最高境界`;
        } else {
            btn.disabled = true; btn.textContent = `突破境界 (经验不足)`;
        }
    }
    function attemptBreakthrough() {
        const currentRankIndex = currentPlayer.level - 1;
        const currentRankData = GAME_DATA.CULTIVATION_RANKS[currentRankIndex];
        const nextRankData = GAME_DATA.CULTIVATION_RANKS[currentPlayer.level];
        if (!nextRankData) { alert("你已达到当前可知的最高境界！"); return; }
        if (currentRankData && currentPlayer.experience >= currentRankData.expNeeded) {
            currentPlayer.level++;
            currentPlayer.expToNextLevel = nextRankData.expNeeded; // This might be total exp for next rank or exp from current
            if (nextRankData.statBoost) {
                for (const stat in nextRankData.statBoost) {
                    if (stat === 'maxHp' || stat === 'maxMp') {
                        currentPlayer.baseStats[stat] = (currentPlayer.baseStats[stat] || 0) + nextRankData.statBoost[stat];
                        if (stat === 'maxHp') currentPlayer.currentHp = currentPlayer.baseStats.maxHp;
                        if (stat === 'maxMp') currentPlayer.currentMp = currentPlayer.baseStats.maxMp;
                    } else if (currentPlayer.baseStats.hasOwnProperty(stat)) {
                        currentPlayer.baseStats[stat] = (currentPlayer.baseStats[stat] || 0) + nextRankData.statBoost[stat];
                    }
                }
            }
            currentPlayer.skillPoints += 1;
            alert(`恭喜！成功突破至 ${nextRankData.rankName}！基础属性提升！获得1技能点。`);
            updatePlayerUIDisplay(); renderCharacterProgressionScreen(); // Will call checkLevelUpOrBreakthrough
        } else { alert("经验不足，无法突破！"); }
    }
    function renderCharacterProgressionScreen() {
        const rankEl = document.getElementById('prog-cultivation-rank');
        const expEl = document.getElementById('prog-cultivation-exp');
        const neededEl = document.getElementById('prog-cultivation-exp-needed');
        const currentRankIndex = Math.min(currentPlayer.level - 1, GAME_DATA.CULTIVATION_RANKS.length - 1);
        const currentRankData = GAME_DATA.CULTIVATION_RANKS[currentRankIndex];
        if(rankEl) rankEl.textContent = currentRankData ? currentRankData.rankName : "未知境界";
        if(expEl) expEl.textContent = currentPlayer.experience;
        if(neededEl) neededEl.textContent = currentRankData ? currentRankData.expNeeded : "---";
        checkLevelUpOrBreakthrough();
        const gongfaListUI = document.getElementById('prog-gongfa-list');
        if (gongfaListUI) {
            gongfaListUI.innerHTML = '';
            if (currentPlayer.activeGongfa.length > 0) { currentPlayer.activeGongfa.forEach(gongfaName => { const li = document.createElement('li'); li.textContent = `${gongfaName} (效果暂未实装)`; gongfaListUI.appendChild(li); }); }
            else { gongfaListUI.innerHTML = '<li>暂无已学功法</li>'; }
        }
        const geneticsActiveEl = document.getElementById('prog-genetics-active'); if(geneticsActiveEl) geneticsActiveEl.textContent = currentPlayer.activeBloodline || "无";
        const cyberSlotsUI = document.getElementById('prog-cybernetics-slots');
        if (cyberSlotsUI) {
            cyberSlotsUI.innerHTML = ''; GAME_DATA.BODY_PARTS.forEach(part => { // Assuming one slot per body part for now
                const li = document.createElement('li'); const installedCyber = currentPlayer.installedCybernetics[part.id];
                const cyberName = installedCyber ? (getItemData(installedCyber)?.name || "未知义体") : "空";
                li.textContent = `${part.name}义体槽: ${cyberName}`; cyberSlotsUI.appendChild(li);
            });
        }
        const skillPointsEl = document.getElementById('prog-skilltree-points'); if(skillPointsEl) skillPointsEl.textContent = currentPlayer.skillPoints;
    }
    function renderWorldSelection() {
        if(!worldListContainer) return; worldListContainer.innerHTML = '';
        GAME_DATA.WORLDS.forEach(world => {
            const card = document.createElement('div'); card.classList.add('world-entry-card');
            card.innerHTML = `<h3>${world.name} (Lv.${world.level})</h3><p>${world.description}</p><p>特色资源: ${world.resources.join(', ')}</p><p>风险: ${world.risk}</p><p>钥匙物品: ${world.keyItem || '无'}</p><p>要求境界: ${GAME_DATA.CULTIVATION_RANKS[ (world.entryMinLevel || 1) -1]?.rankName || `等级${world.entryMinLevel || 1}` }</p><div class="difficulty-buttons"><button class="select-world-difficulty" data-world-id="${world.id}" data-difficulty="normal">普通</button></div>`;
            worldListContainer.appendChild(card);
        });
        document.querySelectorAll('#world-list .select-world-difficulty').forEach(button => { button.addEventListener('click', (e) => { const sw = GAME_DATA.WORLDS.find(w => w.id === e.target.dataset.worldId); if (sw) startPreparation(sw); }); });
    }
    function startPreparation(world) {
        currentMissionState.world = world; if(prepWorldNameUI) prepWorldNameUI.textContent = `出战准备 - ${world.name}`;
        if(prepMainhandUI) prepMainhandUI.textContent = currentPlayer.equipment.mainhand ? getItemData(currentPlayer.equipment.mainhand).name : '-';
        if(prepArmorUI) prepArmorUI.textContent = currentPlayer.equipment.body ? getItemData(currentPlayer.equipment.body).name : '-';
        const backpackItem = currentPlayer.equipment.backpack ? getItemData(currentPlayer.equipment.backpack) : null;
        if(prepBackpackUI) prepBackpackUI.textContent = backpackItem ? `${backpackItem.name} (${backpackItem.capacity}格)` : '无背包';
        if(prepSafeboxUI) prepSafeboxUI.textContent = currentPlayer.safebox.type ? `${currentPlayer.safebox.type} (${currentPlayer.safebox.capacity}格)` : '无安全箱';
        let totalValue = 0; Object.values(currentPlayer.equipment).filter(id => id).forEach(itemId => totalValue += (getItemData(itemId)?.value || 0));
        if(prepValueUI) prepValueUI.textContent = totalValue;
        const canEnter = currentPlayer.level >= (world.entryMinLevel || 1);
        if(prepReqTextUI) prepReqTextUI.textContent = canEnter ? (world.entryRequirements || "此世界无特殊环境要求。") : `进入失败: 境界不足 (需要达到 ${GAME_DATA.CULTIVATION_RANKS[(world.entryMinLevel || 1)-1]?.rankName || `等级${world.entryMinLevel || 1}`})`;
        const startBtn = document.getElementById('btn-start-mission'); if(startBtn) startBtn.disabled = !canEnter;
        if(prepCoordCostUI) prepCoordCostUI.textContent = world.entryCost.虚空座标; if(prepFuelCostUI) prepFuelCostUI.textContent = world.entryCost.灵能燃料;
        showScreen('preparation');
    }
    function enterMission() {
        const world = currentMissionState.world;
        currentMissionState.currentMapNodeId = world.map.startNode; currentMissionState.mapNodesState = {};
        Object.keys(world.map.nodes).forEach(nodeId => { if (world.map.nodes[nodeId].type === 'clearable_enemy') currentMissionState.mapNodesState[nodeId] = { cleared: false }; if (world.map.nodes[nodeId].type === 'conditional_access') currentMissionState.mapNodesState[nodeId] = { revealed: false }; }); // Reset revealed state too
        currentMissionState.movesMade = 0; currentMissionState.tempInventory = []; currentMissionState.keyItemsFound = [];
        currentMissionState.enemiesKilled = 0; currentMissionState.missionValue = 0;
        currentPlayer.currentHp = currentPlayer.baseStats.maxHp; currentPlayer.currentMp = currentPlayer.baseStats.maxMp; initializeBodyParts();
        if(mapCurrentWorldNameUI) mapCurrentWorldNameUI.textContent = world.name;
        if(mapEventLogUI) mapEventLogUI.innerHTML = ''; logTo(mapEventLogUI, `已进入 ${world.name}。`);
        if(mapPlayerHpUI) mapPlayerHpUI.textContent = currentPlayer.currentHp; if(mapPlayerMaxHpUI) mapPlayerMaxHpUI.textContent = currentPlayer.baseStats.maxHp;
        renderMap(); showScreen('map');
    }
    function renderMap() {
        if(!mapNodesContainer || !currentMissionState.world) return; const worldData = currentMissionState.world; const currentNodeId = currentMissionState.currentMapNodeId;
        const currentNodeData = worldData.map.nodes[currentNodeId];
        if(!currentNodeData) { console.error("Current map node data is undefined for ID:", currentNodeId); return; }
        if (mapPlayerHpUI) mapPlayerHpUI.textContent = currentPlayer.currentHp; if (mapPlayerMaxHpUI) mapPlayerMaxHpUI.textContent = currentPlayer.baseStats.maxHp;
        if (mapMovesUI) mapMovesUI.textContent = currentMissionState.movesMade; if (mapCurrentLocationNameUI) mapCurrentLocationNameUI.textContent = currentNodeData.name;
        mapNodesContainer.innerHTML = '';
        currentNodeData.connections.forEach(connId => {
            const connNodeData = worldData.map.nodes[connId]; if (!connNodeData) { console.warn(`Conn node data for ${connId} not found.`); return; }
            const button = document.createElement('button'); button.textContent = connNodeData.name; button.dataset.nodeId = connId;
            if (connNodeData.type === 'search_locked' && !currentMissionState.keyItemsFound.includes(connNodeData.lockKey)) { button.classList.add('locked'); button.title = `需要: ${connNodeData.lockKey}`; button.disabled = true; }
            else if (connNodeData.type === 'clearable_enemy' && currentMissionState.mapNodesState[connId] && !currentMissionState.mapNodesState[connId].cleared) { button.textContent += " (敌人!)"; button.style.color = "#ffdddd"; }
            button.addEventListener('click', () => moveToNode(connId)); mapNodesContainer.appendChild(button);
        });
        if (currentNodeData.type === 'search' || (currentNodeData.type === 'search_locked' && currentMissionState.keyItemsFound.includes(currentNodeData.lockKey))) {
            const searchButton = document.createElement('button'); searchButton.textContent = `搜索 ${currentNodeData.name}`; searchButton.classList.add('action-button', 'map-action-search');
            searchButton.addEventListener('click', () => triggerSearch(currentNodeData)); mapNodesContainer.appendChild(searchButton);
        } else if (currentNodeData.type === 'exit') {
            const exitButton = document.createElement('button'); exitButton.textContent = `从此撤离`; exitButton.classList.add('action-button', 'map-action-exit', 'cta-button');
            exitButton.addEventListener('click', () => confirmEvacuation()); mapNodesContainer.appendChild(exitButton);
        } else if (currentNodeData.type === 'conditional_access' && !(currentMissionState.mapNodesState[currentNodeId]?.revealed)) {
            const checkButton = document.createElement('button'); checkButton.textContent = `尝试探查 (${currentNodeData.condition.replace('_check','')})`;
            checkButton.classList.add('action-button', 'map-action-conditional-check');
            checkButton.addEventListener('click', () => performConditionalCheck(currentNodeId, currentNodeData)); mapNodesContainer.appendChild(checkButton);
        }
        if (currentMissionState.mapNodesState[currentNodeId]?.revealed && currentNodeData.successNode) {
            const successNodeData = worldData.map.nodes[currentNodeData.successNode];
            if (successNodeData) {
                // Check if this connection is already displayed via normal connections
                let alreadyConnected = false;
                currentNodeData.connections.forEach(connId => { if(connId === currentNodeData.successNode) alreadyConnected = true; });

                if (!alreadyConnected) { // Only add button if not part of normal connections
                    const revealedPathButton = document.createElement('button');
                    revealedPathButton.textContent = `前往 ${successNodeData.name} (已发现)`;
                    revealedPathButton.classList.add('action-button', 'map-action-revealed-path', 'warning-button'); // Use warning color for special path
                    revealedPathButton.dataset.nodeId = currentNodeData.successNode;
                    revealedPathButton.addEventListener('click', () => moveToNode(currentNodeData.successNode));
                    mapNodesContainer.appendChild(revealedPathButton);
                }
            }
        }
    }
    function moveToNode(nodeId) {
        const targetNodeData = currentMissionState.world.map.nodes[nodeId]; if (!targetNodeData) { logTo(mapEventLogUI, `错误：目标节点 ${nodeId} 未定义。`, "error"); return; }
        currentMissionState.currentMapNodeId = nodeId; currentMissionState.movesMade++;
        logTo(mapEventLogUI, `移动到: ${targetNodeData.name}. ${targetNodeData.description || ''}`, "system"); renderMap();
        if (targetNodeData.type === 'clearable_enemy' && currentMissionState.mapNodesState[nodeId] && !currentMissionState.mapNodesState[nodeId].cleared) { const esPool = targetNodeData.enemyPool; if(esPool && esPool.length > 0){ const es = getEnemyData(esPool[getRandomInt(0, esPool.length -1)]); if(es) startEncounter(es, 20 + getRandomInt(-5,5));} }
        else if (targetNodeData.type === 'boss_enemy') { const esPool = targetNodeData.enemyPool; if(esPool && esPool.length > 0){ const es = getEnemyData(esPool[0]); if(es) startEncounter(es, 25 + getRandomInt(-5,10));} }
        else if (targetNodeData.type !== 'start' && targetNodeData.type !== 'exit' && targetNodeData.type !== 'conditional_access') {
            if (Math.random() < 0.20) { const rk = Object.keys(GAME_DATA.ENEMIES)[getRandomInt(0, Object.keys(GAME_DATA.ENEMIES).length-1)]; const es = getEnemyData(rk); if(es) {logTo(mapEventLogUI, "你遭遇了埋伏的敌人！", "error"); startEncounter(es, 10 + getRandomInt(-5,5));}}
        }
    }
    function triggerSearch(nodeData) {
        logTo(mapEventLogUI, `正在搜索 ${nodeData.name}... (耗时: ${nodeData.searchTime}秒)`, "system");
        document.querySelectorAll('#map-nodes-container button').forEach(b => b.disabled = true);
        setTimeout(() => {
            document.querySelectorAll('#map-nodes-container button').forEach(b => b.disabled = false);
            const lootFound = []; let currentLootValueForPopup = 0;
            nodeData.lootTable.forEach(lootEntry => {
                if (Math.random() < lootEntry.chance) {
                    if (lootEntry.unique_key && currentMissionState.keyItemsFound.includes(lootEntry.item)) return;
                    const qty = getRandomInt(lootEntry.quantity[0], lootEntry.quantity[1]);
                    addItemToInventory(lootFound, lootEntry.item, qty); currentLootValueForPopup += (getItemData(lootEntry.item)?.value || 0) * qty;
                }
            });
            if (lootFound.length > 0) {
                logTo(mapEventLogUI, `在 ${nodeData.name} 发现了物品!`, "success");
                if(lootPopupTitle) lootPopupTitle.textContent = "搜索结果"; if(lootValueDisplay) lootValueDisplay.textContent = currentLootValueForPopup;
                renderInventoryGrid(lootItemsGrid, lootFound, null);
                const btnTakeAllLoot = document.getElementById('btn-loot-take-all'); if(btnTakeAllLoot) btnTakeAllLoot.style.display = 'inline-block';
                if(btnTakeAllLoot) btnTakeAllLoot.onclick = () => { lootFound.forEach(item => { addItemToInventory(currentMissionState.tempInventory, item.id, item.quantity); currentMissionState.missionValue += (item.data.value || 0) * item.quantity; if(item.data.unique_key && !currentMissionState.keyItemsFound.includes(item.id)){ currentMissionState.keyItemsFound.push(item.id); logTo(mapEventLogUI, `获得了关键物品: ${item.data.name}!`, "success");} updateTaskProgress("collect", item.quantity, item.id); }); hidePopup('loot'); renderMap(); };
                const btnCloseLoot = document.getElementById('btn-loot-close'); if(btnCloseLoot) btnCloseLoot.onclick = () => hidePopup('loot');
                showPopup('loot');
            } else { logTo(mapEventLogUI, `在 ${nodeData.name} 什么也没找到。`); }
        }, nodeData.searchTime * 100);
    }
    function performConditionalCheck(nodeId, nodeData) {
        logTo(mapEventLogUI, `你开始仔细探查 ${nodeData.name} 周围的环境...`, "system"); let success = false;
        if (nodeData.condition === "perception_check") { const pp = currentPlayer.baseStats.perception || 10; const roll = pp + getRandomInt(1, 6) - getRandomInt(1, 3); success = roll >= nodeData.perceptionDC; }
        if (success) {
            logTo(mapEventLogUI, `你成功了！发现了通往 ${currentMissionState.world.map.nodes[nodeData.successNode].name} 的隐藏路径！`, "success");
            if (!currentMissionState.mapNodesState[nodeId]) currentMissionState.mapNodesState[nodeId] = {};
            currentMissionState.mapNodesState[nodeId].revealed = true;
        } else {
            logTo(mapEventLogUI, nodeData.failureMessage || "一番努力后，你没有发现任何特别之处。", "error");
            if (Math.random() < 0.15) { const rk = Object.keys(GAME_DATA.ENEMIES)[getRandomInt(0, Object.keys(GAME_DATA.ENEMIES).length-1)]; const es = getEnemyData(rk); if(es){logTo(mapEventLogUI, "你的动静似乎惊扰了什么东西！", "error"); startEncounter(es, 10 + getRandomInt(-2,2)); return;}}
        }
        renderMap();
    }
    function initializeBodyParts() {
        currentPlayer.bodyPartConditions = {}; GAME_DATA.BODY_PARTS.forEach(part => { currentPlayer.bodyPartConditions[part.id] = { name: part.name, hp: part.maxHp, maxHp: part.maxHp, status: "健康", effects: [] }; if (!bodyPartStatusUIs[part.id]) bodyPartStatusUIs[part.id] = { status: document.getElementById(`part-${part.id}-status`), hp: document.getElementById(`part-${part.id}-hp`) };});
    }
    function renderStatusScreen() {
        if(statusTotalHpUI) statusTotalHpUI.textContent = currentPlayer.currentHp; if(statusTotalMaxHpUI) statusTotalMaxHpUI.textContent = currentPlayer.baseStats.maxHp;
        for (const partId in currentPlayer.bodyPartConditions) {
            const part = currentPlayer.bodyPartConditions[partId]; const ui = bodyPartStatusUIs[partId];
            if (ui && ui.status && ui.hp) {
                 ui.status.textContent = part.status; ui.hp.textContent = `${Math.round((part.hp / part.maxHp) * 100)}%`;
                 ui.status.className = 'status-display';
                 if(part.status === '健康') ui.status.classList.add('status-healthy');
                 else if(part.status === '轻伤') ui.status.classList.add('status-injured');
                 else ui.status.classList.add('status-critical');
            }
        }
        if(availableMedsListUI) {
            availableMedsListUI.innerHTML = '';
            const meds = currentMissionState.tempInventory.filter(i => i.data.type === 'consumable' && (i.data.effectTarget === 'hp' || i.data.effectTarget === 'hp_all_parts'));
            if (meds.length > 0) meds.forEach(med => { const li = document.createElement('li'); li.textContent = `${med.data.name} x${med.quantity} (点击使用)`; li.onclick = () => { if (useConsumable(med.id, 'statusScreen')) renderStatusScreen(); }; availableMedsListUI.appendChild(li); }); // Changed context to 'statusScreen' for clarity
            else availableMedsListUI.innerHTML = '<li>无可用医疗品</li>';
        }
    }
    function applyDamageToBodyPart(partIdToHit, damageAmount) {
        const part = currentPlayer.bodyPartConditions[partIdToHit]; if (!part) { currentPlayer.currentHp = Math.max(0, currentPlayer.currentHp - damageAmount); return; }
        const oldStatus = part.status; part.hp -= damageAmount; let globalHpDamage = damageAmount;
        if (part.hp <= 0) {
            globalHpDamage += Math.abs(part.hp) * 1.2; part.hp = 0; part.status = (part.status === "损毁" || part.status === "彻底损毁") ? "彻底损毁" : "损毁";
            if(combatLogUI) logTo(combatLogUI, `${part.name} 已被彻底损毁！功能丧失！`, "error");
            if (partIdToHit === 'head' && oldStatus !== part.status) if(combatLogUI) logTo(combatLogUI, `头部重创，感知瞄准大降！`, "error");
            if ((partIdToHit === 'larm' || partIdToHit === 'rarm') && oldStatus !== part.status) if(combatLogUI) logTo(combatLogUI, `${part.name}受损，武器使用受影响！`, "error");
            if ((partIdToHit === 'lleg' || partIdToHit === 'rleg') && oldStatus !== part.status) if(combatLogUI) logTo(combatLogUI, `${part.name}残废，移动受阻！`, "error");
        } else if (part.hp < part.maxHp * 0.3) { if(part.status !== "重伤" && part.status !== "损毁" && part.status !== "彻底损毁") { part.status = "重伤"; if(combatLogUI) logTo(combatLogUI, `${part.name} 受到重伤！`, "error");}}
        else if (part.hp < part.maxHp * 0.7) { if(part.status === "健康") { part.status = "轻伤"; if(combatLogUI) logTo(combatLogUI, `${part.name} 受到轻伤。`, "error");}}
        currentPlayer.currentHp = Math.max(0, currentPlayer.currentHp - Math.round(globalHpDamage));
        updatePlayerUIDisplay(); if (activeScreen === 'status') renderStatusScreen();
    }
    function startEncounter(enemyData, initialDistance) {
        if (!enemyData) { console.error("Attempted to start encounter with no enemy data."); return; }
        currentCombatState.enemy = JSON.parse(JSON.stringify(enemyData)); currentCombatState.enemy.currentHp = currentCombatState.enemy.hp;
        currentCombatState.distance = initialDistance; currentCombatState.playerTurn = true; currentCombatState.log = []; currentCombatState.round = 0;
        if(encounterTitleUI) encounterTitleUI.textContent = `遭遇 ${currentCombatState.enemy.name}! (Lv.${currentCombatState.enemy.level})`;
        if(encounterDescriptionUI) encounterDescriptionUI.textContent = `你发现了 ${currentCombatState.enemy.name}。它看起来 ${currentCombatState.enemy.gear || '装备原始'}。`;
        if(encounterDistanceUI) encounterDistanceUI.textContent = currentCombatState.distance; if(encounterEnemyGearUI) encounterEnemyGearUI.textContent = currentCombatState.enemy.gear || '未知';
        renderEncounterOptions(); showScreen('encounter');
    }
    function renderEncounterOptions() {
        if(!encounterOptionsUI) return; encounterOptionsUI.innerHTML = '';
        const weaponData = currentPlayer.equipment.mainhand ? getItemData(currentPlayer.equipment.mainhand) : { range: 5, name:"徒手" }; const weaponRange = weaponData.range;
        const distance = currentCombatState.distance; let options = []; const rangeThreshold = 5;
        if (distance > weaponRange + rangeThreshold) { options.push({ text: "静步前压", action: "press_stealth", recommended: true}); options.push({ text: "超绝干拉", action: "press_aggressive" }); }
        if (distance >= weaponRange - rangeThreshold && distance <= weaponRange + rangeThreshold) { options.push({ text: "架枪对峙", action: "hold_position", recommended: true }); }
        if (distance < weaponRange - rangeThreshold && weaponRange > 0 && weaponData.name !== "徒手") { options.push({ text: "向后拉扯", action: "pull_back", recommended: true }); } // Prevent pull back with melee
        options.push({ text: "直接攻击", action: "direct_attack" }); options.push({ text: "尝试逃跑", action: "flee_combat" });
        options.forEach(opt => { const button = document.createElement('button'); button.textContent = opt.text + (opt.recommended ? " (推荐)" : ""); button.dataset.action = opt.action; button.addEventListener('click', handleEncounterChoice); encounterOptionsUI.appendChild(button); });
    }
    function handleEncounterChoice(event) {
        const action = event.target.dataset.action; let preCombatMessage = ""; let startCombat = true; let distanceChange = 0; let firstStrikeChance = 0;
        switch(action) {
            case "press_stealth": preCombatMessage = "你尝试悄悄接近..."; distanceChange = -getRandomInt(Math.min(currentCombatState.distance, 10), Math.min(currentCombatState.distance, 15)); if (Math.random() < (currentPlayer.baseStats.agility / 20)) firstStrikeChance = 0.3; break;
            case "press_aggressive": preCombatMessage = "你猛冲向敌人！"; distanceChange = -getRandomInt(Math.min(currentCombatState.distance, 15), Math.min(currentCombatState.distance, 20)); if (Math.random() < (currentPlayer.baseStats.strength / 25)) firstStrikeChance = 0.1; else if (Math.random() < 0.2) currentCombatState.playerTurn = false; break;
            case "hold_position": preCombatMessage = "你选择架枪等待时机。"; firstStrikeChance = 0.5; break;
            case "pull_back": preCombatMessage = "你尝试与敌人拉开距离。"; distanceChange = getRandomInt(5,10); break;
            case "flee_combat": preCombatMessage = "你决定逃离！"; if (Math.random() < 0.5 + (currentPlayer.baseStats.agility / 50)) { logTo(mapEventLogUI, "成功逃离战斗！", "success"); showScreen('map'); return; } else { preCombatMessage = "逃跑失败！敌人注意到了你！"; currentCombatState.playerTurn = false; } break;
            default: preCombatMessage = "你决定直接发起攻击！"; break;
        }
        currentCombatState.distance = Math.max(0, currentCombatState.distance + distanceChange); logTo(mapEventLogUI, preCombatMessage, "system");
        if (startCombat) {
            initializeCombatScreen(); showScreen('combat'); logTo(combatLogUI, `战斗开始！当前距离 ${currentCombatState.distance}m。`, "system");
            if (Math.random() < firstStrikeChance) logTo(combatLogUI, "你获得了先手优势！", "success");
            if (!currentCombatState.playerTurn) { logTo(combatLogUI, `${currentCombatState.enemy.name} 反应迅速，先发制人！`, "error"); setTimeout(enemyTurn, 500); }
        }
    }
    function initializeCombatScreen() {
        if(!currentCombatState.enemy) { console.error("InitializeCombatScreen called with no enemy."); showScreen('map'); return;}
        if(combatTargetNameUI) combatTargetNameUI.textContent = `战斗中 vs ${currentCombatState.enemy.name}`; if(combatLogUI) combatLogUI.innerHTML = ''; updateCombatUI(); renderTargetParts();
        if(combatEnemyActualHpUI) combatEnemyActualHpUI.textContent = currentCombatState.enemy.currentHp;
    }
    function updateCombatUI() {
        if(!currentCombatState.enemy) return;
        if(combatPlayerHpUI) combatPlayerHpUI.textContent = currentPlayer.currentHp; if(combatPlayerMpUI) combatPlayerMpUI.textContent = currentPlayer.currentMp;
        const weapon = currentPlayer.equipment.mainhand ? getItemData(currentPlayer.equipment.mainhand) : { name: "徒手", range: 2, damage: [1,3], accuracy_bonus: 0.6 };
        if(combatPlayerWeaponUI) combatPlayerWeaponUI.textContent = weapon.name; if(combatWeaponRangeUI) combatWeaponRangeUI.textContent = `${weapon.range}m`;
        const enemyHpPercent = currentCombatState.enemy.hp > 0 ? Math.round((currentCombatState.enemy.currentHp / currentCombatState.enemy.hp) * 100) : 0;
        if(combatEnemyHpUI) combatEnemyHpUI.textContent = `${enemyHpPercent}%`; if(combatEnemyActualHpUI) combatEnemyActualHpUI.textContent = currentCombatState.enemy.currentHp > 0 ? currentCombatState.enemy.currentHp : 0;
        if(combatCurrentDistanceUI) combatCurrentDistanceUI.textContent = `${currentCombatState.distance}m`;
    }
    function renderTargetParts() {
        if(!targetPartsUI) return; targetPartsUI.innerHTML = '';
        const partsToTarget = GAME_DATA.BODY_PARTS.map(p => ({id: p.id, name: p.name, baseHitMod: p.hitChanceModifier || 0}));
        partsToTarget.forEach(partInfo => {
            const button = document.createElement('button');
            const weaponAccuracy = getItemData(currentPlayer.equipment.mainhand)?.accuracy_bonus || 0.7;
            let displayChance = Math.round(Math.max(0.1, Math.min(0.95, weaponAccuracy + partInfo.baseHitMod)) * 100);
            button.textContent = `${partInfo.name} (~${displayChance}%)`; button.dataset.targetpart = partInfo.id;
            button.addEventListener('click', playerAttack); targetPartsUI.appendChild(button);
        });
    }
    function playerAttack(event) {
        if (!currentCombatState.playerTurn || !currentCombatState.enemy || currentCombatState.enemy.currentHp <= 0) return;
        const targetedPartId = event.target.dataset.targetpart;
        const weapon = currentPlayer.equipment.mainhand ? getItemData(currentPlayer.equipment.mainhand) : { name: "徒手", range: 2, damage: [1,3], accuracy_bonus: 0.6 };
        let hitChance = weapon.accuracy_bonus || 0.7;
        if (currentCombatState.distance > weapon.range) hitChance -= (currentCombatState.distance - weapon.range) * 0.03;
        else if (currentCombatState.distance < weapon.range * 0.3 && weapon.name !== "徒手") hitChance += 0.1; // Bonus for non-melee at very close range
        const partInfo = GAME_DATA.BODY_PARTS.find(p=>p.id === targetedPartId); if (partInfo) hitChance += (partInfo.hitChanceModifier || 0);
        hitChance = Math.max(0.05, Math.min(0.95, hitChance)); currentCombatState.round++;
        logTo(combatLogUI, `[回合 ${currentCombatState.round}] 你使用 ${weapon.name} 瞄准敌人的 ${partInfo?.name || targetedPartId}...`, "combat");
        if (Math.random() < hitChance) {
            let damage = getRandomInt(weapon.damage[0], weapon.damage[1]);
            if (currentCombatState.distance <= weapon.range * 0.6 && weapon.name !== "徒手") damage = Math.round(damage * 1.15);
            if (Math.random() < (currentPlayer.baseStats.perception / 100 + 0.05)) { damage = Math.round(damage * 1.5); logTo(combatLogUI, `暴击! 对 ${partInfo?.name || targetedPartId} 造成了 ${damage} 点伤害!`, "success"); }
            else { logTo(combatLogUI, `命中! 对 ${partInfo?.name || targetedPartId} 造成了 ${damage} 点伤害!`, "success"); }
            currentCombatState.enemy.currentHp -= damage;
        } else { logTo(combatLogUI, "攻击未命中。", "combat"); }
        updateCombatUI(); if (currentCombatState.enemy.currentHp <= 0) { enemyDefeated(); return; }
        currentCombatState.playerTurn = false; setTimeout(enemyTurn, 1000 + getRandomInt(-200, 200));
    }
    function enemyTurn() {
        if (!currentCombatState.enemy || currentCombatState.enemy.currentHp <= 0 || currentPlayer.currentHp <= 0) return; currentCombatState.playerTurn = false;
        const enemy = currentCombatState.enemy; const enemyAttack = enemy.attacks[getRandomInt(0, enemy.attacks.length -1)];
        logTo(combatLogUI, `[回合 ${currentCombatState.round}] ${enemy.name} 使用 ${enemyAttack.name}...`, "combat");
        const preferredDist = enemy.distancePreference || [5, 15]; let moved = false;
        if (currentCombatState.distance < preferredDist[0] && currentCombatState.distance > 0) { currentCombatState.distance += getRandomInt(2, 5); moved = true; logTo(combatLogUI, `${enemy.name} 后退了一些。`, "combat"); }
        else if (currentCombatState.distance > preferredDist[1]) { currentCombatState.distance -= getRandomInt(2, Math.min(8, currentCombatState.distance - preferredDist[1])); moved = true; logTo(combatLogUI, `${enemy.name} 前进了！`, "combat");}
        currentCombatState.distance = Math.max(0, currentCombatState.distance);
        if (enemyAttack.range && currentCombatState.distance > enemyAttack.range && !moved) { logTo(combatLogUI, `${enemy.name} 的攻击距离不够!`, "combat"); }
        else {
            if (Math.random() < (enemyAttack.accuracy || 0.6)) {
                const damage = getRandomInt(enemyAttack.damage[0], enemyAttack.damage[1]);
                const targetPlayerPartId = GAME_DATA.BODY_PARTS[getRandomInt(0, GAME_DATA.BODY_PARTS.length - 1)].id;
                applyDamageToBodyPart(targetPlayerPartId, damage);
                logTo(combatLogUI, `${enemy.name} 击中了你的 ${currentPlayer.bodyPartConditions[targetPlayerPartId]?.name || '未知部位'}，造成 ${damage} 点伤害!`, "error");
            } else { logTo(combatLogUI, `${enemy.name} 的攻击未命中。`, "combat"); }
        }
        updateCombatUI(); if (currentPlayer.currentHp <= 0) { playerDefeated(); return; } currentCombatState.playerTurn = true;
    }
    function enemyDefeated() {
        if(!currentCombatState.enemy) return; logTo(combatLogUI, `${currentCombatState.enemy.name} 被击败了!`, "success");
        const expGained = (currentCombatState.enemy.level || 1) * 25 + getRandomInt(5,15); currentPlayer.experience += expGained;
        logTo(combatLogUI, `你获得了 ${expGained} 点经验值。`, "success"); currentMissionState.enemiesKilled++;
        checkLevelUpOrBreakthrough(); updatePlayerUIDisplay(); const lootDropped = []; let totalLootValueForPopup = 0;
        currentCombatState.enemy.drops.forEach(drop => { if (Math.random() < drop.chance) { if ((drop.item_unique_key || getItemData(drop.item)?.unique_key) && currentMissionState.keyItemsFound.includes(drop.item)) return; const qty = getRandomInt(drop.quantity[0], drop.quantity[1]); addItemToInventory(lootDropped, drop.item, qty); totalLootValueForPopup += (getItemData(drop.item)?.value || 0) * qty; }});
        if (lootDropped.length > 0) {
            if(lootPopupTitle) lootPopupTitle.textContent = "敌人掉落"; if(lootValueDisplay) lootValueDisplay.textContent = totalLootValueForPopup;
            renderInventoryGrid(lootItemsGrid, lootDropped, null);
            const btnTakeAllLoot = document.getElementById('btn-loot-take-all'); if(btnTakeAllLoot) btnTakeAllLoot.style.display = 'inline-block';
            if(btnTakeAllLoot) btnTakeAllLoot.onclick = () => { lootDropped.forEach(item => { addItemToInventory(currentMissionState.tempInventory, item.id, item.quantity); currentMissionState.missionValue += (item.data.value || 0) * item.quantity; if((item.data.unique_key || item.data.item_unique_key) && !currentMissionState.keyItemsFound.includes(item.id)){ currentMissionState.keyItemsFound.push(item.id); logTo(mapEventLogUI, `从敌人处获得了关键物品: ${item.data.name}!`, "success");} updateTaskProgress("collect", item.quantity, item.id); }); hidePopup('loot'); afterCombatCleanup(); };
            const btnCloseLoot = document.getElementById('btn-loot-close'); if(btnCloseLoot) btnCloseLoot.onclick = () => { hidePopup('loot'); afterCombatCleanup(); };
            showPopup('loot');
        } else { logTo(combatLogUI, "敌人没有掉落任何有价值的东西。", "combat"); setTimeout(afterCombatCleanup, 1500); }
    }
    function afterCombatCleanup() {
        const nodeData = currentMissionState.world?.map.nodes[currentMissionState.currentMapNodeId]; // Add null check for world
        if(nodeData && nodeData.type === 'clearable_enemy' && currentMissionState.mapNodesState[currentMissionState.currentMapNodeId]) {
            if (!currentMissionState.mapNodesState[currentMissionState.currentMapNodeId].cleared) {
                currentMissionState.mapNodesState[currentMissionState.currentMapNodeId].cleared = true;
                logTo(mapEventLogUI, `${nodeData.name} 的敌人已被肃清。`, "success");
                updateTaskProgress("clear_node", 1, null, currentMissionState.world.id, currentMissionState.currentMapNodeId);
            }
        }
        currentCombatState.enemy = null; showScreen('map'); renderMap();
    }
    function playerDefeated() { logTo(combatLogUI, "你...倒下了...", "error"); currentMissionState.tempInventory = []; setTimeout(() => showScreen('missionFailure'), 2000); }
    function confirmEvacuation() { showPopup('evacuationConfirm'); }
    function processEvacuation() {
        hidePopup('evacuationConfirm'); logTo(mapEventLogUI, "撤离程序启动...", "success");
        setTimeout(() => {
            currentMissionState.tempInventory.forEach(item => addItemToInventory(currentPlayer.inventory, item.id, item.quantity));
            const missionExpGained = currentMissionState.enemiesKilled * 30 + Math.floor(currentMissionState.missionValue * 0.05) + (currentMissionState.world?.level || 1) * 75; // Add null check for world
            currentPlayer.experience += Math.round(missionExpGained);
            if(successTotalValueUI) successTotalValueUI.textContent = currentMissionState.missionValue;
            if(successKillsUI) successKillsUI.textContent = currentMissionState.enemiesKilled;
            if(successAchievementsUI) successAchievementsUI.textContent = (currentMissionState.world?.id === "lv1_war" && currentMissionState.enemiesKilled > 0) ? "首次探索『焦土前线』" : "无新成就";
            if(successExpUI) successExpUI.textContent = Math.round(missionExpGained);
            if(successBackpackLootUI) renderInventoryGrid(successBackpackLootUI, currentMissionState.tempInventory, null);
            if(successSafeboxLootUI) renderInventoryGrid(successSafeboxLootUI, currentPlayer.safebox.items, null);
            checkLevelUpOrBreakthrough(); updatePlayerUIDisplay(); showScreen('missionSuccess');
        }, 1500);
    }
    function acceptTask(taskId) {
        if (currentPlayer.activeTasks[taskId] || currentPlayer.completedTasks.includes(taskId)) return;
        const taskData = GAME_DATA.TASKS[taskId]; if (!taskData) { console.error("Unknown task ID:", taskId); return; }
        currentPlayer.activeTasks[taskId] = { progress: 0, completed: false, data: taskData };
        logTo(mapEventLogUI || console, `新任务: ${taskData.title}`, "success"); renderTasksPopup();
    }
    function updateTaskProgress(objectiveType, value, itemId = null, worldId = null, nodeId = null) {
        for (const taskId in currentPlayer.activeTasks) {
            const task = currentPlayer.activeTasks[taskId]; if (task.completed) continue; const obj = task.data.objective;
            if (obj.type === "collect" && objectiveType === "collect" && obj.itemId === itemId) { task.progress = Math.min(obj.quantity, task.progress + value); logTo(mapEventLogUI, `任务『${task.data.title}』进度: ${task.progress}/${obj.quantity}`, "system"); }
            else if (obj.type === "clear_node" && objectiveType === "clear_node" && obj.worldId === worldId && obj.nodeId === nodeId) { task.progress = 1; logTo(mapEventLogUI, `任务『${task.data.title}』目标区域已肃清！`, "system"); }
            else if (obj.type === "collect_key_item" && objectiveType === "collect" && obj.itemId === itemId ) { if (currentMissionState.keyItemsFound.includes(obj.itemId)) { task.progress = 1; logTo(mapEventLogUI, `任务『${task.data.title}』关键物品已找到！`, "system"); }}
            if (task.progress >= (obj.quantity || 1) && !task.completed ) completeTask(taskId);
        }
        renderTasksPopup();
    }
    function completeTask(taskId) {
        const task = currentPlayer.activeTasks[taskId]; if (!task || task.completed) return; task.completed = true;
        logTo(mapEventLogUI, `任务完成: ${task.data.title}!`, "success"); const reward = task.data.reward;
        if (reward.experience) currentPlayer.experience += reward.experience; if (reward.currency) currentPlayer.currency += reward.currency;
        if (reward.items) reward.items.forEach(itemReward => { addItemToInventory(currentPlayer.inventory, itemReward.id, itemReward.quantity); logTo(mapEventLogUI, `获得奖励: ${getItemData(itemReward.id)?.name || itemReward.id} x${itemReward.quantity}`, "success"); });
        currentPlayer.completedTasks.push(taskId); delete currentPlayer.activeTasks[taskId];
        checkLevelUpOrBreakthrough(); updatePlayerUIDisplay(); renderTasksPopup();
    }
    function renderTasksPopup() {
        const taskListUI = document.getElementById('task-list'); if(!taskListUI) return; taskListUI.innerHTML = ''; let hasActiveTasks = false;
        for (const taskId in currentPlayer.activeTasks) {
            const task = currentPlayer.activeTasks[taskId]; if (task.completed) continue; hasActiveTasks = true; const li = document.createElement('li');
            const progressText = task.data.objective.quantity ? `(${task.progress}/${task.data.objective.quantity})` : '(进行中)';
            li.textContent = `${task.data.title} ${progressText} - ${task.data.description}`; taskListUI.appendChild(li);
        }
        if (!hasActiveTasks) taskListUI.innerHTML = '<li>当前没有进行中的任务。</li>';
    }
    function safeAddListener(elementId, event, handler) {
        const element = document.getElementById(elementId); if (element) element.addEventListener(event, handler);
        // else { console.warn(`Listener not added: Element '${elementId}' not found.`); }
    }
    function setupEventListeners() {
        safeAddListener('btn-goto-worldselect', 'click', () => { renderWorldSelection(); showScreen('worldSelection'); });
        safeAddListener('btn-goto-warehouse', 'click', () => { renderWarehouseTabs(); updatePlayerEquipmentUI(); showScreen('warehouse'); });
        safeAddListener('btn-goto-market', 'click', () => { renderMarketScreen(); showScreen('market'); });
        safeAddListener('btn-goto-mercenary', 'click', () => { renderMercenaryScreen(); showScreen('mercenary'); });
        safeAddListener('btn-goto-stronger', 'click', () => {
            renderCharacterProgressionScreen(); showScreen('characterProgression');
            const firstProgTab = document.querySelector('#character-progression-screen .tab-button'); const firstProgContentId = firstProgTab?.dataset.tab;
            if (firstProgTab && firstProgContentId) { const el = document.getElementById(firstProgContentId); if (el) { document.querySelectorAll('#character-progression-screen .tab-button').forEach(t=>t.classList.remove('active')); document.querySelectorAll('#character-progression-screen .tab-content').forEach(c=>c.classList.add('hidden')); firstProgTab.classList.add('active'); el.classList.remove('hidden');}}
        });
        document.querySelectorAll('.back-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const currentActiveScreenKey = activeScreen; const targetScreenKeyKebab = e.target.dataset.target; // e.g., "world-selection"
                if (targetScreenKeyKebab) {
                    const targetScreenKeyCamel = targetScreenKeyKebab.replace(/-([a-z])/g, g => g[1].toUpperCase());
                    if (currentActiveScreenKey === 'warehouse' && previousScreenForWarehouse === 'preparation') { showScreen('preparation'); previousScreenForWarehouse = null; return; }
                    if (currentActiveScreenKey === 'warehouse' && targetScreenKeyCamel === 'main') previousScreenForWarehouse = null;
                    showScreen(targetScreenKeyCamel);
                } else { console.error("Back button missing data-target key:", e.target.outerHTML); showScreen('main'); }
            });
        });
        const whTabs = document.querySelectorAll('#warehouse-screen .tab-button'); const whTabContents = document.querySelectorAll('#warehouse-screen .tab-content');
        whTabs.forEach(tab => { tab.addEventListener('click', (e) => { whTabs.forEach(t => t.classList.remove('active')); whTabContents.forEach(c => c.classList.add('hidden')); e.target.classList.add('active'); const tc = document.getElementById(e.target.dataset.tab); if(tc) tc.classList.remove('hidden'); renderWarehouseTabs(); }); });
        document.querySelectorAll('.unequip-btn').forEach(btn => btn.addEventListener('click', (e) => unequipItem(e.target.dataset.slot)));
        safeAddListener('btn-show-detailed-stats', 'click', () => { if(detailedStatsPanel) detailedStatsPanel.classList.toggle('hidden'); if(detailedStatsPanel && !detailedStatsPanel.classList.contains('hidden')) updatePlayerUIDisplay(); });
        safeAddListener('btn-select-safebox', 'click', () => showPopup('safeboxSelection'));
        document.querySelectorAll('#safebox-selection-popup .safebox-option').forEach(btn => { btn.addEventListener('click', (e) => { currentPlayer.safebox.type = e.target.dataset.size; currentPlayer.safebox.capacity = parseInt(e.target.dataset.capacity); if(safeboxCapacityDisplay) safeboxCapacityDisplay.textContent = currentPlayer.safebox.capacity; if(safeboxSizeDisplay) safeboxSizeDisplay.textContent = currentPlayer.safebox.type; hidePopup('safeboxSelection'); renderWarehouseTabs(); }); });
        safeAddListener('btn-close-safebox-popup', 'click', () => hidePopup('safeboxSelection'));
        const marketScreenTabs = document.querySelectorAll('#market-screen .tab-button'); const marketScreenTabContents = document.querySelectorAll('#market-screen .tab-content');
        marketScreenTabs.forEach(tab => { tab.addEventListener('click', (e) => { marketScreenTabs.forEach(t=>t.classList.remove('active')); marketScreenTabContents.forEach(c=>c.classList.add('hidden')); e.target.classList.add('active'); const tc = document.getElementById(e.target.dataset.tab); if(tc) tc.classList.remove('hidden'); renderMarketScreen(); }); });
        const charProgScreenTabs = document.querySelectorAll('#character-progression-screen .tab-button'); const charProgScreenTabContents = document.querySelectorAll('#character-progression-screen .tab-content');
        charProgScreenTabs.forEach(tab => { tab.addEventListener('click', (e) => { charProgScreenTabs.forEach(t=>t.classList.remove('active')); charProgScreenTabContents.forEach(c=>c.classList.add('hidden')); e.target.classList.add('active'); const tc = document.getElementById(e.target.dataset.tab); if(tc) tc.classList.remove('hidden'); renderCharacterProgressionScreen(); }); });
        safeAddListener('btn-breakthrough-cultivation', 'click', attemptBreakthrough);
        safeAddListener('btn-start-mission', 'click', enterMission);
        safeAddListener('btn-change-loadout', 'click', () => { previousScreenForWarehouse = 'preparation'; renderWarehouseTabs(); updatePlayerEquipmentUI(); showScreen('warehouse'); });
        safeAddListener('map-btn-status', 'click', () => { renderStatusScreen(); showScreen('status'); });
        safeAddListener('map-btn-inventory', 'click', () => { if(lootPopupTitle) lootPopupTitle.textContent = "当前携带物品 (副本内)"; if(lootValueDisplay) lootValueDisplay.textContent = currentMissionState.missionValue; renderInventoryGrid(lootItemsGrid, currentMissionState.tempInventory, (item) => { if (item.data.type === 'consumable') { if (useConsumable(item.id, 'mapInventoryPopup')) renderInventoryGrid(lootItemsGrid, currentMissionState.tempInventory, arguments[0]); } else { alert(`物品: ${item.data.name}`); } }); const btnTakeAll = document.getElementById('btn-loot-take-all'); if(btnTakeAll) btnTakeAll.style.display = 'none'; const btnClose = document.getElementById('btn-loot-close'); if(btnClose) btnClose.onclick = () => { hidePopup('loot'); if(btnTakeAll) btnTakeAll.style.display = 'inline-block'; }; showPopup('loot'); });
        safeAddListener('map-btn-tasks', 'click', () => { renderTasksPopup(); showPopup('tasks'); });
        safeAddListener('btn-close-tasks-popup', 'click', () => hidePopup('tasks'));
        safeAddListener('btn-combat-escape', 'click', () => { if(!currentCombatState.enemy) return; logTo(combatLogUI, "你尝试逃跑...", "combat"); if (Math.random() < 0.3 + (currentPlayer.baseStats.agility / 60)) { logTo(combatLogUI, "逃跑成功！", "success"); currentCombatState.enemy = null; setTimeout(() => { showScreen('map'); renderMap(); }, 1000); } else { logTo(combatLogUI, "逃跑失败！", "error"); currentCombatState.playerTurn = false; setTimeout(enemyTurn, 500); } });
        safeAddListener('btn-combat-auto', 'click', () => alert("自动战斗功能暂未实现。"));
        safeAddListener('btn-confirm-evac', 'click', processEvacuation);
        safeAddListener('btn-cancel-evac', 'click', () => hidePopup('evacuationConfirm'));
        safeAddListener('btn-return-to-main', 'click', () => { updatePlayerUIDisplay(); showScreen('main'); });
        safeAddListener('btn-failure-return-to-main', 'click', () => { updatePlayerUIDisplay(); showScreen('main'); });
    }
    function initGame() {
        addItemToInventory(currentPlayer.inventory, "医疗包", 5);
        addItemToInventory(currentPlayer.inventory, "基础金属", 50);
        addItemToInventory(currentPlayer.inventory, "《电弧吐纳法》Lv.1", 1);
        initializeBodyParts();
        acceptTask("clear_outpost_alpha");
        acceptTask("collect_samples");
        acceptTask("retrieve_datacore_lv2");
        updatePlayerUIDisplay();
        setupEventListeners();
        showScreen('main');
        console.log("Game Initialized. Player Data:", JSON.parse(JSON.stringify(currentPlayer)));
    }
    initGame();
});