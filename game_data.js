// game_data.js (完整版 - 20231028 更新)

const GAME_DATA = {
    WORLDS: [ // GDD I.1 下层世界
        {
            id: "lv1_war",
            name: "Lv1 战争世界『焦土前线』",
            level: 1,
            description: "现代战争的残余，充满了基础的工业材料和危险的变异体。",
            keyItem: "加密硬盘",
            resources: ["基础金属", "火药", "电子元件"],
            risk: "枪械/爆炸物/变异体",
            entryCost: {虚空座标: 1, 灵能燃料: 10},
            entryMinLevel: 1,
            map: {
                startNode: "entry_zone",
                nodes: {
                    "entry_zone": { name: "空降区 (起点)", type: "start", description: "一片狼藉的空降场地，空气中弥漫着硝烟。", connections: ["checkpoint_alpha", "ruined_outpost"] },
                    "checkpoint_alpha": {
                        name: "检查站α", type: "clearable_enemy", enemyPool: ["recruit_guard", "recruit_guard_heavy"],
                        description: "曾经的军事检查站，现在被拾荒者占据。",
                        connections: ["entry_zone", "supply_depot"],
                        clearedMessage: "检查站α的敌人已被肃清。"
                    },
                    "ruined_outpost": {
                        name: "废弃前哨站", type: "search", searchTime: 8,
                        description: "摇摇欲坠的前哨建筑，里面似乎有些残余物资。",
                        lootTable: [
                            {item: "基础金属", chance: 0.8, quantity: [3,6]},
                            {item: "火药", chance: 0.5, quantity: [2,4]},
                            {item: "破旧皮甲", chance: 0.1, quantity: [1,1]},
                            {item: "医疗包", chance: 0.2, quantity: [1,1]}
                        ],
                        connections: ["entry_zone", "mutant_den", "comm_tower_ruins"]
                    },
                    "supply_depot": {
                        name: "补给仓库", type: "search_locked", lockKey: "加密硬盘",
                        description: "一个上锁的大型仓库，需要 '加密硬盘' 才能进入。",
                        searchTime: 15,
                        lootTable: [
                            {item: "电子元件", chance: 0.9, quantity: [2,5]},
                            {item: "突击步枪Mk1", chance: 0.15, quantity: [1,1]},
                            {item: "战术背心", chance: 0.1, quantity: [1,1]}
                        ],
                        connections: ["checkpoint_alpha", "exit_point_A"]
                    },
                    "mutant_den": {
                        name: "变异体巢穴", type: "boss_enemy", enemyPool: ["mutant_brute"],
                        description: "散发着恶臭的洞穴，深处传来低沉的咆哮。",
                        connections: ["ruined_outpost", "exit_point_A", "hidden_cache_entrance"]
                    },
                    "comm_tower_ruins": {
                        name: "通讯塔废墟", type: "search", searchTime: 10,
                        description: "倒塌的通讯塔，散落着电子零件。也许能找到什么有用的东西。",
                        lootTable: [
                            {item: "电子元件", chance: 0.7, quantity: [1,3]},
                            {item: "新手手枪", chance: 0.2, quantity: [1,1]},
                            {item: "加密硬盘", chance: 0.3, quantity: [1,1], unique_key: true}
                        ],
                        connections: ["ruined_outpost", "exit_point_B"]
                    },
                    "hidden_cache_entrance": {
                        name: "隐蔽入口", type: "conditional_access", condition: "perception_check",
                        perceptionDC: 15,
                        successNode: "hidden_cache",
                        failureMessage: "你仔细观察了四周，但没有发现什么特别的。",
                        description: "岩壁间似乎有些不自然的痕迹，需要敏锐的感知力才能发现。",
                        connections: ["mutant_den"]
                    },
                    "hidden_cache": {
                        name: "秘密贮藏点", type: "search", searchTime: 20,
                        description: "一个被巧妙隐藏起来的小型贮藏室，里面堆放着一些珍稀物资。",
                        lootTable: [
                            {item: "灵石碎片", chance: 1, quantity: [50,150]},
                            {item: "高级医疗套件", chance: 0.4, quantity: [1,1]},
                            {item: "功法残页·基础吐纳", chance: 0.2, quantity: [1,1]}
                        ],
                        connections: ["hidden_cache_entrance"]
                    },
                    "exit_point_A": { name: "撤离点A (仓库区)", type: "exit", description: "一个相对安全的临时撤离传送阵。", connections: ["supply_depot", "mutant_den"] },
                    "exit_point_B": { name: "撤离点B (塔下)", type: "exit", description: "通讯塔下的紧急撤离信标。", connections: ["comm_tower_ruins"] }
                }
            }
        },
        {
            id: "lv2_zombie",
            name: "Lv2 丧尸世界『腐朽都市』",
            level: 2,
            description: "病毒爆发后的死城，遍布行尸走肉和珍贵的医疗样本。",
            keyItem: "病毒源株样本",
            resources: ["变异生物样本", "医疗设备"],
            risk: "尸潮/生化毒素",
            entryCost: {虚空座标: 2, 灵能燃料: 20},
            entryMinLevel: 3, // 调整进入等级
            map: {
                startNode: "quarantine_zone",
                nodes: {
                    "quarantine_zone": { name: "隔离区入口", type: "start", description: "锈迹斑斑的铁丝网和废弃的检查哨。", connections: ["abandoned_hospital_entrance", "ruined_street"] },
                    "abandoned_hospital_entrance": { name: "废弃医院入口", type: "clearable_enemy", enemyPool: ["zombie_wanderer", "zombie_fast"], description: "医院大门敞开着，里面传来令人不安的声响。", connections: ["quarantine_zone", "hospital_lobby"] },
                    "hospital_lobby": { name: "医院大厅", type: "search", searchTime: 10, description: "散落着病床和医疗废弃物的大厅。", lootTable: [{item:"医疗设备", chance:0.6, quantity:[1,2]}, {item:"病毒源株样本", chance:0.1, quantity:[1,1], unique_key:true}, {item:"高级医疗套件", chance:0.15, quantity:[1,1]}], connections: ["abandoned_hospital_entrance", "exit_hospital"] },
                    "ruined_street": { name: "破败街道", type: "search", searchTime: 7, description: "车辆随意停放，店铺橱窗破碎的街道。", lootTable: [{item:"基础金属", chance:0.5, quantity:[2,4]}, {item:"变异生物样本", chance:0.3, quantity:[1,2]}, {item:"火药", chance:0.2, quantity:[1,2]}], connections: ["quarantine_zone", "exit_street"] },
                    "exit_hospital": { name: "撤离点 (医院后门)", type: "exit", description: "一个勉强还能运作的紧急传送装置。", connections: ["hospital_lobby"] },
                    "exit_street": { name: "撤离点 (街道尽头)", type: "exit", description: "路障后的一个临时安全区撤离点。", connections: ["ruined_street"] }
                }
            }
        }
    ],
    ITEMS: {
        // 武器
        "新手手枪": { name: "新手手枪", type: "weapon", slot: "mainhand", damage: [8, 12], range: 15, accuracy_bonus: 0.7, rarity: "common", value: 50, size: [2,1], description: "标准制式手枪，可靠性尚可。" },
        "突击步枪Mk1": { name: "突击步枪Mk1", type: "weapon", slot: "mainhand", damage: [15, 25], range: 30, accuracy_bonus: 0.75, rarity: "uncommon", value: 250, size: [3,1], description: "经过改装的早期型号突击步枪。" },
        // 护甲
        "破旧皮甲": { name: "破旧皮甲", type: "armor", slot: "body", defense: 5, rarity: "common", value: 30, size: [2,2], description: "勉强能提供一些防护的皮制护甲。" },
        "战术背心": { name: "战术背心", type: "armor", slot: "body", defense: 12, rarity: "uncommon", value: 200, size: [2,2], description: "轻便且能有效抵挡低速破片的战术装备。" },
        // 药品
        "医疗包": { name: "医疗包", type: "consumable", effectTarget: "hp", effectValue: [500, 700], useTime: 5, rarity: "common", value: 40, size: [1,1], description: "标准医疗包，能快速回复生命值。" },
        "绷带": { name: "绷带", type: "consumable", effectTarget: "bleeding", effectValue: [0,0], /* Placeholder for bleeding effect */ useTime: 3, rarity: "common", value: 15, size: [1,1], description: "用于止血和包扎小型伤口。" },
        "高级医疗套件": { name: "高级医疗套件", type: "consumable", effectTarget: "hp_all_parts", effectValue: [100, 150], /* Per part or total? Clarify if total, effectValue should be larger, e.g., [600,900] total to distribute */ useTime: 8, rarity: "rare", value: 150, size: [2,1], description: "能快速治疗多处伤势的急救包，对全身都有效果。" },
        // 材料与任务物品
        "基础金属": { name: "基础金属", type: "material", rarity: "common", value: 5, size: [1,1], description: "常见的工业金属，用途广泛。" },
        "火药": { name: "火药", type: "material", rarity: "common", value: 8, size: [1,1], description: "基础爆炸物原料，不够稳定。" },
        "电子元件": { name: "电子元件", type: "material", rarity: "uncommon", value: 20, size: [1,1], description: "修复或制造电子设备所必需的零件。" },
        "变异生物样本": { name: "变异生物样本", type: "material", rarity: "uncommon", value: 25, size: [1,1], description: "从变异生物身上提取的组织样本，具有研究价值。" },
        "医疗设备": { name: "医疗设备", type: "material", rarity: "rare", value: 100, size: [2,2], description: "可用于修复或升级医疗设施的精密仪器。" },
        "灵石碎片": { name: "灵石碎片", type: "material", rarity: "uncommon", value: 2, size: [1,1], description: "蕴含微弱灵能的石头碎片，可用于修炼或交易。" },
        // 钥匙物品
        "加密硬盘": { name: "加密硬盘", type: "key_item", rarity: "rare", value: 0, size: [1,1], description: "用于解锁特定区域的加密硬盘。", unique_key: true },
        "病毒源株样本": { name: "病毒源株样本", type: "key_item", rarity: "rare", value: 0, size: [1,1], description: "重要的生化研究样本，可能用于制作解药或更危险的东西。", unique_key: true },
        // 收藏品/功法
        "《电弧吐纳法》Lv.1": { name: "《电弧吐纳法》Lv.1", type: "gongfa", rarity: "uncommon", value: 0, size: [1,2], description: "基础的能量抗性修炼法门，装备后被动提升能量抗性。(效果暂未实装)" },
        "功法残页·基础吐纳": { name: "功法残页·基础吐纳", type: "collectible", rarity: "rare", value: 0, size: [1,1], description: "记录了基础吐纳法门部分内容的残破书页，集齐可合成完整功法。" },
        // 背包
        "标准背包": { name: "标准背包", type: "backpack", slot: "backpack", capacity: 20, rarity: "common", value: 100, size: [2,2], description: "一个普通的帆布背包，提供20格储物空间 (4x5)。" },
        "行军背包": { name: "行军背包", type: "backpack", slot: "backpack", capacity: 30, rarity: "uncommon", value: 300, size: [2,3], description: "军用规格的背包，提供30格储物空间 (5x6)。" },
    },
    ENEMIES: {
        "recruit_guard": {
            name: "新兵守卫", level: 1, hp: 80,
            attacks: [{ name: "手枪射击", damage: [10, 15], accuracy: 0.7 }],
            drops: [{ item: "基础金属", chance: 0.5, quantity: [1, 2] }, { item: "火药", chance: 0.2, quantity: [1,1] }, {item: "新手手枪", chance: 0.05, quantity: [1,1]}],
            gear: "新手手枪, 破旧制服",
            distancePreference: [10, 20]
        },
        "recruit_guard_heavy": {
            name: "重装新兵守卫", level: 2, hp: 120,
            attacks: [{ name: "重型枪械射击", damage: [15, 20], accuracy: 0.65 }],
            drops: [{ item: "基础金属", chance: 0.6, quantity: [2, 3] }, { item: "电子元件", chance: 0.2, quantity: [1,1] }, {item: "突击步枪Mk1", chance: 0.03, quantity: [1,1]}],
            gear: "突击步枪, 加厚护甲",
            distancePreference: [15, 25]
        },
        "mutant_brute": {
            name: "变异蛮兵", level: 3, hp: 250,
            attacks: [{ name: "猛击", damage: [25, 40], accuracy: 0.6 }, { name: "投掷石块", damage: [15,20], accuracy: 0.5, range: 10 }],
            drops: [{ item: "变异生物样本", chance: 0.8, quantity: [1, 1] }, { item: "基础金属", chance: 0.3, quantity: [2,4] }, {item: "灵石碎片", chance: 0.1, quantity: [5,10]}],
            gear: "厚皮, 爪子",
            distancePreference: [0, 5]
        },
        "zombie_wanderer": {
            name: "游荡丧尸", level: 2, hp: 60,
            attacks: [{ name: "抓挠", damage: [8, 12], accuracy: 0.55 }],
            drops: [{ item: "变异生物样本", chance: 0.4, quantity: [1,1] }, {item:"破旧皮甲", chance:0.05, quantity:[1,1]}],
            gear: "破烂衣物",
            distancePreference: [0, 3]
        },
        "zombie_fast": {
            name: "疾行丧尸", level: 3, hp: 90,
            attacks: [{ name: "飞扑撕咬", damage: [12, 18], accuracy: 0.65 }],
            drops: [{ item: "变异生物样本", chance: 0.5, quantity: [1,2] }, {item:"病毒源株样本", chance:0.02, quantity:[1,1], item_unique_key:true}],
            gear: "扭曲的肢体",
            distancePreference: [0, 8]
        }
    },
    MARKET_ITEMS: [
        { itemId: "医疗包", stock: 20, basePrice: 50, type: "buy" },
        { itemId: "绷带", stock: 30, basePrice: 20, type: "buy" },
        { itemId: "新手手枪", stock: 5, basePrice: 60, type: "buy" },
        { itemId: "基础金属", stock: Infinity, basePriceSell: 3, basePriceBuy: 7, type: "both" },
        { itemId: "火药", stock: Infinity, basePriceSell: 5, basePriceBuy: 10, type: "both" },
        { itemId: "电子元件", stock: 50, basePriceSell: 12, basePriceBuy: 25, type: "both"},
        { itemId: "标准背包", stock: 3, basePrice: 120, type: "buy"},
        { itemId: "突击步枪Mk1", stock: 2, basePrice: 300, type: "buy"},
    ],
    MERCENARIES_AVAILABLE: [
        {
            id: "merc_fang", name: "尖兵-阿獠", level: 3, type: "战斗型",
            description: "经验丰富的战场老兵，擅长正面突击。",
            cost: 500, upkeep: 50,
            stats: { attack_bonus: 5, hp_bonus_on_mission: 100 },
            skills: ["火力压制 (被动)"]
        },
        {
            id: "merc_ling", name: "斥候-小玲", level: 2, type: "探索型",
            description: "敏捷的斥候，能发现更多隐藏的物资。",
            cost: 300, upkeep: 30,
            stats: { search_luck_bonus: 0.1, extra_loot_chance: 0.05 },
            skills: ["陷阱解除 (被动)"]
        }
    ],
    CULTIVATION_RANKS: [ // GDD III.4
        { rankName: "数据炼气", expNeeded: 1000, levelEquivalent: 1, statBoost: { maxHp: 50, maxMp: 10 } }, // Index 0, for player.level 1
        { rankName: "固态筑基", expNeeded: 3000, levelEquivalent: 5, statBoost: { maxHp: 150, maxMp: 30, strength: 2, constitution: 2 } }, // Index 1, for player.level 2
        { rankName: "核心金丹", expNeeded: 8000, levelEquivalent: 10, statBoost: { maxHp: 300, maxMp: 50, perception: 3, intelligence: 3 } }, // Index 2, for player.level 3
        { rankName: "矩阵元婴", expNeeded: 20000, levelEquivalent: 15, statBoost: { maxHp: 500, maxMp: 100, strength: 3, agility: 3, perception: 2 } },
    ],
    PLAYER_BASE_STATS: {
        strength: 10, agility: 10, constitution: 10,
        perception: 10, intelligence: 10,
        maxHp: 2000, maxMp: 100
    },
    BODY_PARTS: [
        { id: "head", name: "头部", maxHp: 100, hitChanceModifier: -0.3 },
        { id: "torso", name: "躯干", maxHp: 250, hitChanceModifier: 0 },
        { id: "larm", name: "左臂", maxHp: 150, hitChanceModifier: -0.15 },
        { id: "rarm", name: "右臂", maxHp: 150, hitChanceModifier: -0.15 },
        { id: "lleg", name: "左腿", maxHp: 180, hitChanceModifier: -0.2 },
        { id: "rleg", name: "右腿", maxHp: 180, hitChanceModifier: -0.2 }
    ],
    TASKS: { // GDD IV.6
        "collect_samples": {
            id: "collect_samples",
            title: "收集变异样本",
            description: "为天穹市的研究部门收集5个『变异生物样本』。",
            objective: { type: "collect", itemId: "变异生物样本", quantity: 5 },
            reward: { experience: 500, currency: 200, items: [{id: "医疗包", quantity: 2}] }
        },
        "clear_outpost_alpha": {
            id: "clear_outpost_alpha",
            title: "肃清检查站α",
            description: "『焦土前线』的检查站α被敌人占据，肃清那里的所有敌人。",
            objective: { type: "clear_node", worldId: "lv1_war", nodeId: "checkpoint_alpha"},
            reward: { experience: 300, currency: 150 }
        },
        "retrieve_datacore_lv2": { // 示例：腐朽都市任务
            id: "retrieve_datacore_lv2",
            title: "寻回医院数据核心",
            description: "腐朽都市的废弃医院中可能还保存着重要的灾前数据核心。找到它并带回。",
            objective: { type: "collect_key_item", itemId: "病毒源株样本"}, // 假设病毒源株样本就是数据核心的代称或其一部分
            reward: { experience: 800, currency: 400, items: [{id:"高级医疗套件", quantity:1}] }
        }
    },
};

// 辅助函数
function getItemData(itemName) {
    if (!itemName) return null;
    return GAME_DATA.ITEMS[itemName] || null;
}

function getEnemyData(enemyName) {
    if (!enemyName) return null;
    return GAME_DATA.ENEMIES[enemyName] || null;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}