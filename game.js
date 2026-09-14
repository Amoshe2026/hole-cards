(() => {
  'use strict';

  const app = document.getElementById('app');
  const STORAGE_KEY = 'mulerun_poker_noir_save_v1';

  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = [2,3,4,5,6,7,8,9,10,11,12,13,14];
  const rankLabel = {11:'J',12:'Q',13:'K',14:'A'};

  const levels = [
    {
      id: 'alley', icon: '木', name: '后巷木桌', unlock: 0, buyIn: 30, blind: 1, difficulty: .08, mercy: .52,
      scene: '滴水的空调外机、垃圾桶和破损木线轴。这里的牌局像街头斗殴一样直接。',
      opponents: [
        { name:'秃顶大汉', avatar:'壮', style:'直线蛮打', aggression:.42, looseness:.72, quote:'别磨蹭，小子，快下注。' },
        { name:'朋克小混混', avatar:'钉', style:'爱诈唬', aggression:.56, looseness:.83, quote:'这把让你内裤都输掉。' }
      ],
      lose: '后巷的灯泡灭了。你被按在垃圾桶旁，口袋比来时更空。'
    },
    {
      id: 'bar', icon: '酒', name: '街角酒馆', unlock: 150, buyIn: 70, blind: 4, difficulty: .18, mercy: .34,
      scene: '廉价酒吧里霓虹灯牌忽明忽暗，点唱机只剩电流杂音。',
      opponents: [
        { name:'卡车司机', avatar:'卡', style:'疲惫跟注站', aggression:.32, looseness:.62, quote:'再来一杯，还有一手好牌。' },
        { name:'皮衣女郎', avatar:'皮', style:'冷读玩家', aggression:.52, looseness:.45, quote:'我见过不少像你这样的年轻人，最后都消失了。' }
      ],
      lose: '酒馆门口的雨水冲走你的筹码。没人记得你来过。'
    },
    {
      id: 'arcade', icon: '机', name: '地下游戏厅', unlock: 300, buyIn: 125, blind: 8, difficulty: .32,
      scene: '老式街机屏幕发出绿色荧光，筹码和游戏代币混在一起。',
      opponents: [
        { name:'棒球帽游戏宅', avatar:'帽', style:'概率派', aggression:.47, looseness:.38, quote:'这个游戏的概率，我比德州扑克算得还清楚。' },
        { name:'泡泡糖女生', avatar:'算', style:'技术派', aggression:.58, looseness:.36, quote:'你以为只有你在算牌吗？' }
      ],
      lose: '街机屏幕显示 CONTINUE? 你的口袋没有硬币。'
    },
    {
      id: 'tea', icon: '茶', name: '中国城茶馆', unlock: 650, buyIn: 260, blind: 20, difficulty: .52,
      scene: '古旧茶馆后厅，屏风和茶香掩不住牌桌上的寒意。',
      opponents: [
        { name:'老掌柜', avatar:'掌', style:'慢压价值', aggression:.36, looseness:.26, quote:'茶要慢慢品，牌要慢慢打。' },
        { name:'金链沉默男', avatar:'链', style:'突然重锤', aggression:.66, looseness:.31, quote:'你的底牌，像这茶汤一样，被我一眼看透。' }
      ],
      lose: '你被茶馆后门请出去，身上只剩一股凉掉的茶味。'
    },
    {
      id: 'ktv', icon: '歌', name: 'KTV豪华包厢', unlock: 1200, buyIn: 500, blind: 40, difficulty: .63,
      scene: '巨大屏幕无声播放老MV，皮革沙发散着烟酒味。',
      opponents: [
        { name:'房地产销售', avatar:'楼', style:'酒后疯狗', aggression:.72, looseness:.68, quote:'赢了钱，今晚全场消费我买单！' },
        { name:'陪酒女', avatar:'花', style:'笑里藏刀', aggression:.55, looseness:.42, quote:'感情深，一口闷；胆子大，全压下！' }
      ],
      lose: '包厢里的笑声压过你的呼吸。账单被推到你面前。'
    },
    {
      id: 'office', icon: '金', name: '摩天大楼办公室', unlock: 2200, buyIn: 900, blind: 80, difficulty: .76,
      scene: '顶层CEO办公室，城市夜景在落地窗外像一张冰冷的牌面。',
      opponents: [
        { name:'金融精英', avatar:'融', style:'风险模型', aggression:.61, looseness:.24, quote:'在这里，我们计算风险，也计算人心。' },
        { name:'女助理', avatar:'冷', style:'冷静猎手', aggression:.49, looseness:.19, quote:'你的筹码，够买下我几分钟的时间？' }
      ],
      lose: '电梯下行时，你看见玻璃里的自己像一张弃牌。'
    },
    {
      id: 'yacht', icon: '船', name: '私人游轮', unlock: 4500, buyIn: 1800, blind: 160, difficulty: .98, cheat: true,
      scene: '驶入公海的豪华游轮。月光照在甲板上，也照在无法证明的作弊上。',
      opponents: [
        { name:'面具庄家', avatar:'面', style:'规则制定者', aggression:.68, looseness:.16, quote:'欢迎来到终点，年轻人。规则由我制定。' },
        { name:'赌场老板', avatar:'眼', style:'从未一败', aggression:.72, looseness:.12, quote:'这里没有运气，只有必然。' }
      ],
      lose: '公海没有证人。你被迫签下一份永远还不清的契约，海风替你合上结局。'
    }
  ];

  const sceneArt = [
    'assets/scene_alley.png',
    'assets/scene_bar.png',
    'assets/scene_arcade.png',
    'assets/scene_tea.png',
    'assets/scene_ktv.png',
    'assets/scene_office.png',
    'assets/scene_yacht.png'
  ];

  const avatarArt = [
    ['assets/avatar_brute.png','assets/avatar_punk.png'],
    ['assets/avatar_trucker.png','assets/avatar_leather.png'],
    ['assets/avatar_gamer.png','assets/avatar_tech.png'],
    ['assets/avatar_shopkeeper.png','assets/avatar_chain.png'],
    ['assets/avatar_sales.png','assets/avatar_hostess.png'],
    ['assets/avatar_finance.png','assets/avatar_assistant.png'],
    ['assets/avatar_dealer.png','assets/avatar_boss.png']
  ];

  const strategyProfiles = [
    [
      { archetype:'蛮力跟注站', tight:.10, bluff:.04, trap:.02, call:.70, pressure:.16, tilt:.18, risk:'新手', read:'范围很宽，但主动加注很少；他多数时候只是在用弱对子追牌。' },
      { archetype:'街头诈唬手', tight:.04, bluff:.24, trap:.03, call:.46, pressure:.30, tilt:.42, risk:'新手', read:'会乱吓人，但下注尺寸偏小；你反击时他经常退缩。' }
    ],
    [
      { archetype:'疲惫跟注站', tight:.20, bluff:.05, trap:.04, call:.76, pressure:.14, tilt:.12, risk:'低', read:'不爱主动加注，会用中等牌跟到转牌；河牌大注通常是真牌。' },
      { archetype:'冷读紧凶', tight:.48, bluff:.16, trap:.16, call:.34, pressure:.38, tilt:.08, risk:'中低', read:'入池偏少；她会试探，但前两街不会频繁重锤。' }
    ],
    [
      { archetype:'赔率计算派', tight:.50, bluff:.14, trap:.10, call:.46, pressure:.45, tilt:.08, risk:'中', read:'按底池赔率行动，面对超额下注会弃掉边缘牌。' },
      { archetype:'技术反击手', tight:.46, bluff:.26, trap:.34, call:.42, pressure:.58, tilt:.12, risk:'中高', read:'喜欢慢打强牌，转牌圈反加注频率高。' }
    ],
    [
      { archetype:'老派坚果猎人', tight:.76, bluff:.05, trap:.48, call:.34, pressure:.44, tilt:.02, risk:'高', read:'范围很窄，沉默跟注往往是在诱捕。' },
      { archetype:'沉默重锤', tight:.62, bluff:.12, trap:.18, call:.30, pressure:.82, tilt:.06, risk:'高', read:'平时弃牌多，突然大注就是极强或极端施压。' }
    ],
    [
      { archetype:'醉酒疯狗', tight:.08, bluff:.38, trap:.06, call:.72, pressure:.78, tilt:.88, risk:'高波动', read:'随机性高，会用弱牌打大底池；价值牌要狠狠收费。' },
      { archetype:'笑里藏刀', tight:.38, bluff:.30, trap:.36, call:.58, pressure:.52, tilt:.18, risk:'中高', read:'喜欢陪你看牌，河牌突然下注不一定是真牌。' }
    ],
    [
      { archetype:'风险模型压迫者', tight:.68, bluff:.22, trap:.20, call:.32, pressure:.74, tilt:.04, risk:'很高', read:'会根据你的被动表现持续下注，反制需要选择强范围。' },
      { archetype:'冰冷极简主义', tight:.82, bluff:.10, trap:.42, call:.22, pressure:.60, tilt:.01, risk:'很高', read:'几乎不犯情绪错误；跟注代表摊牌价值，反加注代表危险。' }
    ],
    [
      { archetype:'作弊发牌者', tight:.86, bluff:.18, trap:.50, call:.28, pressure:.78, tilt:.00, risk:'不可能', read:'他不只是读牌，他在改写牌。积累破局值才能削弱作弊。' },
      { archetype:'终局老板', tight:.90, bluff:.14, trap:.58, call:.24, pressure:.86, tilt:.00, risk:'不可能', read:'接近最优且受作弊公牌保护；普通盈利策略会被碾碎。' }
    ]
  ];

  const dialogueProfiles = [
    [
      {
        intro:['别磨蹭，小子，牌不会自己翻。','坐下吧，木桌不挑人。','我只认筹码，不认故事。'],
        call:['这点钱我还跟得起。','我看看你到底有什么。','别以为我会被这点动静吓走。'],
        raise:['我手痒了，加点料。','木桌要响，牌局才像样。','你敢看下一张吗？'],
        fold:['啧，算你这次唬住了。','这破牌不值得我动手。','下把再收拾你。'],
        trap:['他把粗手按在牌上，像压着一只活物。','他忽然安静下来，只剩指节敲桌声。'],
        bluff:['他的声音很大，但筹码推得有点乱。','他故意笑出声，笑得太用力。'],
        win:['说了吧，这桌归我。','把口袋翻干净，小子。'],
        lose:['见鬼，这木桌今天不认我。','你运气好，别以为你懂牌。']
      },
      {
        intro:['这把让你连鞋带都输掉。','欢迎来到后巷，小少爷。','别盯着我头发，盯着你的筹码。'],
        call:['行啊，我陪你演。','你装得挺像。','再来一张，看看谁先露馅。'],
        raise:['街头规矩：怕就滚。','我加，你接不接？','这点火候才刚开始。'],
        fold:['切，烂牌。','这把不跟你疯。','我不是怕，是牌太臭。'],
        trap:['他吹了声口哨，却没有继续加码。','他把笑憋回去，眼睛还在发亮。'],
        bluff:['他把筹码摔得很响，像在替牌说谎。','他话突然变多，像要把空牌吵成怪物。'],
        win:['街头小子，欢迎交学费。','我就说你会交出来。'],
        lose:['不可能，我刚才气势都到了。','行，你有点东西。']
      }
    ],
    [
      {
        intro:['再来一杯，还有一手好牌。','路跑得久了，什么牌都见过。','别急，夜还长。'],
        call:['我跟，反正醒着也是醒着。','这价格还算公道。','我见过更糟的路况。'],
        raise:['那就让引擎响一点。','别睡着，加注。','我不常踩油门，但现在踩了。'],
        fold:['这趟不跑了。','油不够，牌也不够。','留点钱买咖啡。'],
        trap:['他揉了揉眼睛，只是跟注。','他看起来快睡着了，手却稳得很。'],
        bluff:['他的疲惫像是真的，下注却像硬撑。','他把杯子举起来，避开你的视线。'],
        win:['老路也能开出新钱。','年轻人，别跟疲惫的人拼耐心。'],
        lose:['今晚的路太滑。','我该早点收车。']
      },
      {
        intro:['我见过不少像你这样的年轻人。','别把运气误会成天赋。','酒吧灯暗，不代表我看不清。'],
        call:['我想听完这个故事。','继续，我还没厌倦。','你的下注有点意思。'],
        raise:['现在轮到我问问题。','你露出破绽了。','别眨眼。'],
        fold:['这局故事不好看。','你这次讲圆了。','我不追廉价谜底。'],
        trap:['她只是轻轻一笑，没有抬高价格。','她把牌边对齐，像在整理证据。'],
        bluff:['她的香烟停在半空，下注却先到了。','她看着你，不看牌。'],
        win:['我说过，很多人最后都消失了。','年轻不是护身符。'],
        lose:['这倒是新鲜。','别高兴太早，城市会把账要回去。']
      }
    ],
    [
      {
        intro:['概率先说话，人才说话。','我把这局当成隐藏关。','别按错键。'],
        call:['赔率允许，我跟。','这不是情绪，是计算。','继续采样。'],
        raise:['数值告诉我该加压。','你的范围太弱了。','这波我有优势。'],
        fold:['负期望，不玩。','这手牌删档。','我不为烂数据付费。'],
        trap:['他盯着底池，像盯着分数表。','他没有加注，像在等概率收束。'],
        bluff:['他嘴上说计算，手却比平时快。','他把帽檐压低，隐藏不了呼吸。'],
        win:['系统判定：你输了。','数学不关心你的热血。'],
        lose:['小概率事件发生了。','这局样本不足。']
      },
      {
        intro:['你以为只有你在算牌吗？','这里每个按钮都有代价。','别把荧光当成希望。'],
        call:['我接这个分支。','还没到退出条件。','继续，看转移概率。'],
        raise:['我重写节奏。','你的线太直了。','反击窗口到了。'],
        fold:['这个节点剪枝。','我不进坏分支。','让给你一次。'],
        trap:['她嚼着泡泡糖，只是跟注。','她的手停得太稳，像在存档。'],
        bluff:['她吹出一个泡泡，下注先破了。','她盯着屏幕倒影，不看你。'],
        win:['技术不是装饰。','你刚刚被读档了。'],
        lose:['有意思，你破了我的线。','这局我要记下来。']
      }
    ],
    [
      { intro:['茶要慢慢品，牌要慢慢打。'], call:['茶还热，我跟。'], raise:['火候到了。'], fold:['这泡茶不续了。'], trap:['他慢慢倒茶，只是跟注。'], bluff:['茶杯遮住了他的嘴角。'], win:['苦后回甘。'], lose:['茶凉了。'] },
      { intro:['你的底牌，被我一眼看透。'], call:['跟。'], raise:['全桌安静。'], fold:['不值。'], trap:['他沉默得像一堵墙。'], bluff:['金链轻轻碰了一下桌沿。'], win:['不用多说。'], lose:['他第一次皱眉。'] }
    ],
    [
      { intro:['赢了钱，今晚全场消费我买单！'], call:['我跟，哥有的是胆。'], raise:['气氛到了，必须加。'], fold:['这把先不买单。'], trap:['他笑着灌酒，却没加注。'], bluff:['他的嗓门盖过了牌力。'], win:['销售冠军不是白来的。'], lose:['账单先挂我名下。'] },
      { intro:['感情深，一口闷；胆子大，全压下！'], call:['姐姐陪你看。'], raise:['别小气嘛。'], fold:['这杯我不喝。'], trap:['她笑得很甜，只是跟注。'], bluff:['她把笑容推到你面前。'], win:['今晚你请客。'], lose:['小弟弟，有点胆子。'] }
    ],
    [
      { intro:['在这里，我们计算风险，也计算人心。'], call:['风险可控。'], raise:['你的资本效率太低。'], fold:['止损。'], trap:['他像签文件一样跟注。'], bluff:['他的下注像一份过度包装的报告。'], win:['市场教育完成。'], lose:['模型需要修正。'] },
      { intro:['你的筹码，够买下我几分钟的时间？'], call:['记录。'], raise:['纠偏。'], fold:['无效资产。'], trap:['她只是把钢笔合上。'], bluff:['她的语气没有变化，下注却变了。'], win:['会议结束。'], lose:['异常值。'] }
    ],
    [
      { intro:['欢迎来到终点，年轻人。规则由我制定。'], call:['规则允许我跟。'], raise:['规则正在收紧。'], fold:['这不是仁慈。'], trap:['面具后没有表情。'], bluff:['他像是在表演公平。'], win:['这里没有偶然。'], lose:['你听见规则裂开的声音。'] },
      { intro:['这里没有运气，只有必然。'], call:['继续。'], raise:['必然加速。'], fold:['这一页翻过。'], trap:['他连呼吸都像被安排过。'], bluff:['他的沉默太完美，完美得像假象。'], win:['结局早已写好。'], lose:['第一次，老板没有说话。'] }
    ]
  ];

  levels.forEach((level, i) => {
    level.art = sceneArt[i];
    level.opponents.forEach((opponent, j) => {
      opponent.avatarImg = avatarArt[i][j];
      Object.assign(opponent, strategyProfiles[i][j]);
      opponent.lines = dialogueProfiles[i][j];
    });
  });

  let state;

  function freshState() {
    return {
      screen: 'title',
      bankroll: 120,
      peak: 120,
      hands: 0,
      wins: 0,
      insight: 0,
      selected: 0,
      log: [],
      hand: null,
      ending: null
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const loaded = raw ? JSON.parse(raw) : null;
      if (loaded && Array.isArray(loaded.log)) {
        loaded.log = loaded.log.filter(line => !String(line.text || '').includes('新手缓冲') && !String(line.text || '').includes('逃命钱'));
      }
      return loaded;
    } catch {
      return null;
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function resetGame() {
    localStorage.removeItem(STORAGE_KEY);
    state = freshState();
    render();
  }

  function money(n) {
    return '$' + Math.max(0, Math.floor(n)).toLocaleString('en-US');
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function line(o, mood, fallback = '') {
    const pool = o && o.lines && o.lines[mood];
    return pool && pool.length ? choice(pool) : (fallback || (o ? o.quote : ''));
  }

  function unlockedCount() {
    return levels.filter(l => state.bankroll >= l.unlock).length;
  }

  function header(title = '底牌都市：铁人德扑') {
    return `
      <div class="topbar">
        <div class="brand">
          <b>${title}</b>
          <span>one bankroll. one city. no reload.</span>
        </div>
        <div class="stats">
          <div class="pill">资金 <strong>${money(state.bankroll)}</strong></div>
          <div class="pill">最高 <strong>${money(state.peak)}</strong></div>
          <div class="pill">破局值 <strong>${state.insight}</strong></div>
          <div class="pill">牌局 <strong>${state.hands}</strong></div>
        </div>
      </div>`;
  }

  function render() {
    if (state.ending) return renderEnding();
    if (state.screen === 'title') return renderTitle();
    if (state.screen === 'map') return renderMap();
    if (state.screen === 'table') return renderTable();
  }

  function renderTitle() {
    app.innerHTML = `
      <section class="screen">
        ${header()}
        <div class="hero">
          <h1>底牌<br>都市</h1>
          <p>像素风、剧情驱动的单人德州扑克。你是一无所有的街头小子，靠一条资金链爬过后巷、酒馆、游戏厅、茶馆、包厢和顶楼办公室，最后走上公海游轮。只有总资金彻底归零，存档才会作废。</p>
          <div class="btn-row">
            <button class="btn gold" data-action="start">进入城市地图</button>
            <button class="btn danger" data-action="reset">清空存档</button>
          </div>
        </div>
      </section>`;
  }

  function renderMap() {
    const positions = [
      [12,82],[25,66],[39,50],[54,38],[67,56],[78,30],[90,14]
    ];
    const maxUnlocked = unlockedCount();
    const nodes = levels.map((l, i) => {
      const locked = i >= maxUnlocked;
      const cls = ['node', locked ? 'locked' : 'unlocked', state.selected === i ? 'current' : ''].join(' ');
      return `<button class="${cls}" style="left:${positions[i][0]}%;top:${positions[i][1]}%" ${locked ? 'disabled' : ''} data-action="select-level" data-level="${i}">
        <span class="icon">${l.icon}</span>
        <b>${l.name}</b>
        <small>买入 ${money(l.buyIn)} / 解锁 ${money(l.unlock)}</small>
      </button>`;
    }).join('');
    const roads = positions.slice(0,-1).map((p, i) => {
      const n = positions[i+1];
      const dx = n[0] - p[0], dy = n[1] - p[1];
      const len = Math.sqrt(dx*dx + dy*dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      return `<i class="road" style="left:${p[0]}%;top:${p[1]}%;width:${len}%;transform:rotate(${angle}deg)"></i>`;
    }).join('');
    const level = levels[state.selected];
    const canPlay = state.bankroll >= level.buyIn && state.bankroll >= level.unlock;
    app.innerHTML = `
      <section class="screen">
        ${header('城市地图')}
        <div class="layout">
          <div class="panel">
            <h2 class="section-title">解锁路线</h2>
            <div class="city-map">
              ${roads}${nodes}
              <div class="fog" style="--x:${positions[Math.max(0,maxUnlocked-1)][0]}%;--y:${positions[Math.max(0,maxUnlocked-1)][1]}%"></div>
            </div>
          </div>
          <aside class="panel">
            <h2 class="section-title">${level.name}</h2>
            <div class="scene-card" style="background-image:url('${level.art}')"></div>
            <p class="copy">${level.scene}</p>
            <div class="pill">买入：<strong>${money(level.buyIn)}</strong>　盲注：<strong>${money(level.blind)}</strong></div>
            <div class="pill">难度：<strong>${level.cheat ? '不可能' : Math.round(level.difficulty * 100) + '%'}</strong></div>
            <h3 class="section-title">对手</h3>
            ${level.opponents.map(o => `<div class="seat"><div class="portrait">${avatarHtml(o)}<span><b>${o.name}</b><small>${o.archetype} / 风险 ${o.risk}</small></span></div><div class="tell">${o.read}</div></div>`).join('')}
            <div class="btn-row">
              <button class="btn gold" data-action="enter-table" ${canPlay ? '' : 'disabled'}>带着买入上桌</button>
              <button class="btn danger" data-action="reset">重新开始铁人模式</button>
            </div>
            <p class="copy">${canPlay ? '提醒：本桌买入可能全部输掉，但只有总资金归零才会永久结束。' : '资金不足。回到低级牌桌继续攒钱。'}</p>
          </aside>
        </div>
      </section>`;
  }

  function renderEnding() {
    const win = state.ending.type === 'miracle';
    app.innerHTML = `
      <section class="screen ending">
        <div class="ending-card ${win ? 'win' : ''}">
          <h1>${state.ending.title}</h1>
          <p>${state.ending.text}</p>
          <div class="pill">最终资金 <strong>${money(state.bankroll)}</strong>　胜场 <strong>${state.wins}</strong>　破局值 <strong>${state.insight}</strong></div>
          <div class="btn-row">
            <button class="btn gold" data-action="reset">从后巷重新开始</button>
          </div>
        </div>
      </section>`;
  }

  function renderCard(card, hidden = false) {
    if (hidden || !card) return `<span class="card back"><span>?</span><span class="bottom">?</span></span>`;
    const red = card.suit === '♥' || card.suit === '♦';
    const r = rankLabel[card.rank] || card.rank;
    return `<span class="card ${red ? 'red' : ''}"><span>${r}${card.suit}</span><span class="bottom">${r}${card.suit}</span></span>`;
  }

  function avatarHtml(o) {
    return `<span class="avatar img" style="background-image:url('${o.avatarImg || ''}')">${o.avatarImg ? '' : o.avatar}</span>`;
  }

  function renderTable() {
    const h = state.hand;
    if (!h) return renderMap();
    const level = levels[h.levelIndex];
    const streetNames = ['翻牌前', '翻牌圈', '转牌圈', '河牌圈', '摊牌'];
    const canAct = !h.resolved && h.playerActive && h.playerStack > 0;
    const toCall = Math.max(0, h.currentBet - h.playerContrib);
    const boardCards = [...h.community];
    while (boardCards.length < 5) boardCards.push(null);
    app.innerHTML = `
      <section class="screen">
        ${header(level.name)}
        <div class="table-scene">
          <div class="felt">
            <div class="table-art" style="background-image:url('${level.art}')"></div>
            <div class="scene-name">
              <div><h2>${level.name}</h2><p>${level.scene}</p></div>
              <div class="pill">${streetNames[h.street]} / 底池 <strong>${money(h.pot)}</strong></div>
            </div>
            <div class="opponents">
              ${h.opponents.map((o, i) => `
                <div class="seat ${o.active ? '' : 'folded'}">
                  <div class="portrait">${avatarHtml(o)}<span><b>${o.name}</b><small>${o.archetype} / 筹码 ${money(o.stack)}</small></span></div>
                  <div class="cards">${renderCard(o.cards[0], !h.showdown)}${renderCard(o.cards[1], !h.showdown)}</div>
                  <div class="tell">${o.last || '他盯着你的筹码，没有眨眼。'}</div>
                </div>`).join('')}
            </div>
            <div class="board">
              <div class="pot">公共牌 / POT ${money(h.pot)}</div>
              <div class="cards">${boardCards.map(c => renderCard(c, !c)).join('')}</div>
            </div>
            <div class="player-zone">
              <div class="hand-label">
                <span><strong>你</strong> / 桌上筹码 ${money(h.playerStack)} / 本轮需跟 ${money(toCall)}</span>
                <span>${h.playerBest || '底牌未摊开'}</span>
              </div>
              <div class="cards">${h.playerCards.map(c => renderCard(c)).join('')}</div>
              <div class="actions">
                <button class="btn" data-action="player-check" ${canAct ? '' : 'disabled'}>${toCall ? '跟注 ' + money(toCall) : '过牌'}</button>
                <button class="btn gold" data-action="player-raise" ${canAct && h.playerStack > toCall ? '' : 'disabled'}>加注</button>
                <button class="btn danger" data-action="player-allin" ${canAct ? '' : 'disabled'}>全压</button>
                <button class="btn" data-action="player-fold" ${canAct ? '' : 'disabled'}>弃牌</button>
                <button class="btn" data-action="next-hand" ${h.resolved && !state.ending ? '' : 'disabled'}>再来一手</button>
                <button class="btn" data-action="cash-out" ${h.resolved && !state.ending ? '' : 'disabled'}>离桌回地图</button>
              </div>
            </div>
          </div>
          <aside class="side">
            <div>
              <h2 class="section-title">资金链</h2>
              <div class="pill">总资金 <strong>${money(state.bankroll)}</strong></div>
              <div class="meter"><i style="width:${clamp(state.bankroll / levels[levels.length-1].unlock * 100, 2, 100)}%"></i></div>
            </div>
            <div>
              <h2 class="section-title">牌桌记录</h2>
              <div class="log">${state.log.slice(-16).map(line => `<p class="${line.kind || ''}">${line.text}</p>`).join('')}</div>
            </div>
          </aside>
        </div>
      </section>`;
  }

  function handleAction(action, data) {
    if (action === 'start') {
      state.screen = 'map';
      addLog('你把最后的现金塞进口袋，走进雨夜。', 'sys');
    }
    if (action === 'reset') return resetGame();
    if (action === 'select-level') state.selected = Number(data.level);
    if (action === 'enter-table') return enterTable(state.selected);
    if (action === 'player-check') return playerAct('call');
    if (action === 'player-raise') return playerAct('raise');
    if (action === 'player-allin') return playerAct('allin');
    if (action === 'player-fold') return playerAct('fold');
    if (action === 'next-hand') return enterTable(state.selected);
    if (action === 'cash-out') {
      state.hand = null;
      state.screen = 'map';
      addLog('你把筹码换成现金，回到城市地图。', 'sys');
    }
    saveState();
    render();
  }

  function addLog(text, kind = '') {
    state.log.push({ text, kind });
    if (state.log.length > 80) state.log = state.log.slice(-80);
  }

  function enterTable(levelIndex) {
    const level = levels[levelIndex];
    if (state.bankroll < level.buyIn || state.bankroll < level.unlock) {
      state.hand = null;
      state.screen = 'map';
      addLog(`资金不足，无法在${level.name}重新买入。`, 'bad');
      saveState();
      return renderMap();
    }
    const deck = makeDeck();
    shuffle(deck);
    const opponents = level.opponents.map(o => ({
      ...o,
      stack: level.buyIn,
      active: true,
      cards: [deck.pop(), deck.pop()],
      contrib: 0,
      last: line(o, 'intro')
    }));
    const playerCards = [deck.pop(), deck.pop()];
    state.screen = 'table';
    state.selected = levelIndex;
    state.hand = {
      levelIndex,
      deck,
      playerCards,
      playerStack: level.buyIn,
      opponents,
      community: [],
      pot: 0,
      street: 0,
      currentBet: level.blind,
      playerContrib: 0,
      playerActive: true,
      resolved: false,
      showdown: false,
      playerBest: '',
      rigged: false
    };
    state.hands += 1;
    postBlind('player', Math.min(level.blind / 2, state.hand.playerStack));
    opponents.forEach((_, i) => postBlind(i, Math.min(level.blind, opponents[i].stack)));
    addLog(`你带着 ${money(level.buyIn)} 坐上${level.name}。`, 'sys');
    addLog(`“${line(choice(level.opponents), 'intro')}”`);
    saveState();
    render();
  }

  function postBlind(who, amount) {
    const h = state.hand;
    amount = Math.floor(amount);
    if (who === 'player') {
      const paid = Math.min(amount, h.playerStack);
      h.playerStack -= paid;
      h.playerContrib += paid;
      h.pot += paid;
    } else {
      const o = h.opponents[who];
      const paid = Math.min(amount, o.stack);
      o.stack -= paid;
      o.contrib += paid;
      h.pot += paid;
    }
  }

  function payPlayer(amount) {
    const h = state.hand;
    const paid = Math.min(Math.max(0, Math.floor(amount)), h.playerStack);
    h.playerStack -= paid;
    h.playerContrib += paid;
    h.pot += paid;
    return paid;
  }

  function payOpponent(o, amount) {
    const paid = Math.min(Math.max(0, Math.floor(amount)), o.stack);
    o.stack -= paid;
    o.contrib += paid;
    state.hand.pot += paid;
    return paid;
  }

  function playerAct(type) {
    const h = state.hand;
    if (!h || h.resolved) return;
    const level = levels[h.levelIndex];
    const toCall = Math.max(0, h.currentBet - h.playerContrib);
    if (type === 'fold') {
      h.playerActive = false;
      addLog(choice(['你把牌扣下。活着离桌，有时也是一种胜利。','你松开牌角，让这手牌死在桌面上。','你没有逞强，筹码还会说下一句话。']));
      if (toCall >= level.blind * 3) state.insight += 1;
      return resolveFold();
    }
    if (type === 'call') {
      const paid = payPlayer(toCall);
      addLog(paid ? choice([`你跟注 ${money(paid)}。`,`你把 ${money(paid)} 推进底池。`,`你补齐价格，继续看这座城市怎么发牌。`]) : choice(['你敲了敲桌面，过牌。','你没有下注，只让沉默继续。','你用指节点了点桌面。']));
    }
    if (type === 'raise') {
      const raise = Math.min(h.playerStack, Math.max(level.blind * (h.street + 2), Math.floor(level.buyIn * (.08 + h.street * .03))));
      const paid = payPlayer(toCall + raise);
      h.currentBet = h.playerContrib;
      addLog(choice([`你把一摞筹码推过线：${money(paid)}。`,`你提高价格：${money(paid)}，桌面像被敲了一记。`,`你选择主动开火，下注 ${money(paid)}。`]), 'gold');
    }
    if (type === 'allin') {
      const paid = payPlayer(h.playerStack);
      h.currentBet = Math.max(h.currentBet, h.playerContrib);
      addLog(choice([`你全压 ${money(paid)}。空气像被切断。`,`你把剩下的筹码全部推入黑暗：${money(paid)}。`,`没有退路了，你全压 ${money(paid)}。`]), 'bad');
    }
    aiRespond();
    if (!h.resolved && (h.playerStack <= 0 || h.currentBet <= h.playerContrib)) advanceIfReady();
    saveState();
    render();
  }

  function resolveFold() {
    const h = state.hand;
    const level = levels[h.levelIndex];
    const loss = level.buyIn - h.playerStack;
    state.bankroll = Math.max(0, state.bankroll - loss);
    addLog(`你损失 ${money(loss)}，带着剩余筹码离桌。`, 'bad');
    h.resolved = true;
    h.showdown = false;
    finishBankrollCheck(false);
    saveState();
    render();
  }

  function aiRespond() {
    const h = state.hand;
    const level = levels[h.levelIndex];
    let raised = false;
    for (const o of h.opponents) {
      if (!o.active || h.resolved) continue;
      const toCall = Math.max(0, h.currentBet - o.contrib);
      const strength = clamp(estimateStrength([...o.cards, ...h.community], h.street) + level.difficulty * .10, 0, .99);
      const decision = opponentDecision(o, strength, toCall, raised);
      if (decision.action === 'fold') {
        o.active = false;
        o.last = decision.tell;
        addLog(`${o.name}弃牌。`);
        continue;
      }
      if (toCall > 0 || decision.action === 'call') {
        const paid = payOpponent(o, toCall);
        o.last = decision.tell || (paid ? `跟了 ${money(paid)}，眼神没有离开你。` : '过牌。');
        addLog(paid ? `${o.name}跟注 ${money(paid)}。` : `${o.name}过牌。`);
      }
      if (!raised && decision.action === 'raise' && o.stack > level.blind) {
        const raise = Math.min(o.stack, Math.floor(decision.size));
        h.currentBet += raise;
        const paid = payOpponent(o, Math.max(0, h.currentBet - o.contrib));
        o.last = `${decision.tell} 加压：${money(paid)}。`;
        addLog(`${o.name}加注到 ${money(h.currentBet)}。`, 'bad');
        raised = true;
      }
    }
    if (h.opponents.every(o => !o.active)) {
      awardPotToPlayer('所有对手弃牌。');
    }
  }

  function opponentDecision(o, strength, toCall, alreadyRaised) {
    const h = state.hand;
    const level = levels[h.levelIndex];
    const pressure = toCall / Math.max(1, level.buyIn);
    const streetWeight = h.street / 3;
    const made = h.community.length >= 3 ? evaluate7([...o.cards, ...h.community]).category : 0;
    const strongMade = made >= 2 || strength > .68;
    const nutted = made >= 5 || strength > .84;
    const chaos = (Math.random() - .5) * (o.tilt || 0) * .26;
    const effectiveStrength = clamp(strength + chaos, 0, .99);

    const mercy = level.mercy || 0;
    const foldBoost = mercy && toCall > 0 ? .10 * mercy : 0;
    const raiseBrake = 1 - (.52 * mercy);
    const bluffBrake = 1 - (.55 * mercy);
    const foldThreshold = clamp(.18 + foldBoost + pressure * (1.05 + o.tight) - o.call * .28 - (strongMade ? .22 : 0), .04, .92);
    const bluffWindow = !strongMade && Math.random() < (o.bluff * bluffBrake * (1 - streetWeight * .25));
    const trapWindow = strongMade && Math.random() < (o.trap * (.65 + streetWeight * .5));
    const pressureWindow = Math.random() < (o.pressure * raiseBrake * (.34 + effectiveStrength * .55));
    const preflopBrake = mercy > 0 && h.street === 0 && !nutted && made < 1;

    if (toCall > 0 && effectiveStrength < foldThreshold) {
      return { action:'fold', tell: line(o, 'fold') };
    }

    if (!alreadyRaised && !preflopBrake && !trapWindow && (nutted || pressureWindow || bluffWindow)) {
      const base = level.blind * (h.street + 2);
      const mult = mercy ? (nutted ? 3.2 : 2.0) : (nutted ? 4.6 : (bluffWindow ? 2.7 : 3.4));
      return { action:'raise', size: base * mult * (.75 + o.pressure), tell: bluffWindow ? line(o, 'bluff') : line(o, 'raise') };
    }

    return { action:'call', tell: trapWindow ? line(o, 'trap') : line(o, 'call') };
  }

  function advanceIfReady() {
    const h = state.hand;
    if (h.resolved) return;
    const activeOpps = h.opponents.filter(o => o.active);
    if (!activeOpps.length) return awardPotToPlayer('桌上只剩你一个人。');
    if (h.playerStack <= 0 || activeOpps.every(o => o.stack <= 0)) {
      while (h.community.length < 5) dealCommunity();
      return showdown();
    }
    if (h.street === 0) {
      dealCommunity(3);
      startStreet(1);
      addLog(choice(['翻牌落下，霓虹在牌面上碎成三块。','三张公牌翻开，桌边的人都少说了一句话。','翻牌像街灯一样亮起，照出第一层谎言。']), 'sys');
    } else if (h.street === 1) {
      dealCommunity(1);
      startStreet(2);
      addLog(choice(['转牌翻开，房间安静了一拍。','第四张牌落下，底池开始变重。','转牌像一根针，刺破桌上的假镇定。']), 'sys');
    } else if (h.street === 2) {
      if (levels[h.levelIndex].cheat) rigRiverIfNeeded();
      else dealCommunity(1);
      startStreet(3);
      addLog(choice(['河牌像判决书一样落下。','最后一张公牌翻开，所有借口都用完了。','河牌到了，城市屏住呼吸。']), 'sys');
    } else {
      showdown();
    }
  }

  function startStreet(street) {
    const h = state.hand;
    h.street = street;
    h.currentBet = 0;
    h.playerContrib = 0;
    h.opponents.forEach(o => { o.contrib = 0; });
  }

  function dealCommunity(count = 1) {
    const h = state.hand;
    while (count-- > 0 && h.community.length < 5) h.community.push(h.deck.pop());
  }

  function rigRiverIfNeeded() {
    const h = state.hand;
    const level = levels[h.levelIndex];
    if (h.community.length >= 5) return;
    if (state.insight >= 7 && Math.random() < .35) {
      dealCommunity(1);
      addLog('面具庄家的手停顿了一瞬，牌没有按他的意愿滑动。', 'gold');
      return;
    }
    if (Math.random() > .84) return dealCommunity(1);
    const currentCommunity = [...h.community];
    const playerCards = h.playerCards;
    const activeOpps = h.opponents.filter(o => o.active);
    let bestIndex = -1;
    let bestMargin = null;
    for (let i = 0; i < h.deck.length; i++) {
      const river = h.deck[i];
      const board = [...currentCommunity, river];
      const playerEval = evaluate7([...playerCards, ...board]);
      const aiBest = activeOpps.map(o => evaluate7([...o.cards, ...board])).sort(compareEval).pop();
      const cmp = compareEval(aiBest, playerEval);
      if (cmp > 0) {
        const margin = aiBest.score - playerEval.score;
        if (bestMargin === null || margin < bestMargin) {
          bestMargin = margin;
          bestIndex = i;
        }
      }
    }
    if (bestIndex >= 0) {
      const [river] = h.deck.splice(bestIndex, 1);
      h.community.push(river);
      h.rigged = true;
      addLog('你看见洗牌机的绿灯闪了一下。公海上没有裁判。', 'bad');
    } else {
      dealCommunity(1);
    }
  }

  function awardPotToPlayer(reason) {
    const h = state.hand;
    h.playerStack += h.pot;
    addLog(`${reason} 你收下底池 ${money(h.pot)}。`, 'gold');
    h.pot = 0;
    settleHand(true);
  }

  function showdown() {
    const h = state.hand;
    h.street = 4;
    h.showdown = true;
    const board = h.community;
    const playerEval = evaluate7([...h.playerCards, ...board]);
    h.playerBest = playerEval.name;
    let best = { who:'player', eval:playerEval, ref:null };
    for (const o of h.opponents.filter(x => x.active)) {
      const ev = evaluate7([...o.cards, ...board]);
      o.last = `${ev.name}。“${line(o, 'win')}”`;
      if (compareEval(ev, best.eval) > 0) best = { who:'opponent', eval:ev, ref:o };
    }
    const level = levels[h.levelIndex];
    const naturalMiracle = level.cheat && playerEval.category >= 8;
    if (level.cheat && best.who === 'player' && !naturalMiracle && state.insight < 7) {
      const villain = h.opponents.find(o => o.active) || h.opponents[0];
      best = { who:'opponent', eval:{ name:'被规则改写的一点优势', score:playerEval.score + 1 }, ref:villain };
      addLog('庄家没有换牌，却像换掉了世界的规则。', 'bad');
    }
    if (best.who === 'player') {
      h.playerStack += h.pot;
      addLog(`摊牌：你是 ${playerEval.name}，赢下 ${money(h.pot)}。`, 'gold');
      h.opponents.filter(o => o.active).forEach(o => { o.last = `“${line(o, 'lose')}”`; });
      h.pot = 0;
      const miracle = level.cheat && (state.insight >= 7 || playerEval.category >= 8);
      settleHand(true, miracle);
    } else {
      best.ref.stack += h.pot;
      addLog(`摊牌：${best.ref.name}亮出 ${best.eval.name}，拿走 ${money(h.pot)}。`, 'bad');
      h.pot = 0;
      settleHand(false);
    }
  }

  function settleHand(won, miracle = false) {
    const h = state.hand;
    if (h.resolved) return;
    const level = levels[h.levelIndex];
    const delta = h.playerStack - level.buyIn;
    state.bankroll = Math.max(0, state.bankroll + delta);
    state.peak = Math.max(state.peak, state.bankroll);
    h.resolved = true;
    if (won) {
      state.wins += 1;
      if (delta > level.blind * 8) state.insight += 1;
      addLog(`你本手${delta >= 0 ? '盈利' : '亏损'} ${money(Math.abs(delta))}。`, delta >= 0 ? 'gold' : 'bad');
    } else {
      addLog(`你本手亏损 ${money(Math.abs(delta))}。`, 'bad');
    }
    finishBankrollCheck(miracle);
  }

  function finishBankrollCheck(miracle) {
    const h = state.hand;
    const level = levels[h.levelIndex];
    if (miracle) {
      state.ending = {
        type: 'miracle',
        title: '奇迹结局：第一位破局者',
        text: '面具庄家摘下面具。游轮上的所有人第一次沉默。你不是赢了一局牌，而是证明规则可以被击穿。他递给你一枚黑色筹码，一枚真正游戏的入场券。'
      };
      saveState();
      return;
    }
    if (state.bankroll <= 0) {
      state.bankroll = 0;
      state.ending = {
        type: level.cheat ? 'despair' : 'fail',
        title: level.cheat ? '绝望结局：公海无证人' : '失败结局：资金链断裂',
        text: level.lose
      };
    } else if (h.playerStack <= 0) {
      addLog(`本桌买入归零，但你还剩 ${money(state.bankroll)} 总资金；可回地图选择更低级牌桌。`, 'sys');
    }
    saveState();
  }

  function estimateStrength(cards, street) {
    if (cards.length >= 5) {
      const ev = evaluate7(cards);
      return clamp(ev.category / 8 + ev.kickers[0] / 100, .05, .98);
    }
    const rs = cards.map(c => c.rank).sort((a,b) => b-a);
    const pair = rs[0] === rs[1] ? .28 : 0;
    const high = (rs[0] - 2) / 12 * .32;
    const suited = cards.length === 2 && cards[0].suit === cards[1].suit ? .08 : 0;
    const connected = cards.length === 2 && Math.abs(cards[0].rank - cards[1].rank) <= 2 ? .08 : 0;
    return clamp(.12 + pair + high + suited + connected + street * .06 + Math.random() * .09, .03, .95);
  }

  function makeDeck() {
    const deck = [];
    for (const suit of suits) for (const rank of ranks) deck.push({ suit, rank });
    return deck;
  }

  function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  function evaluate7(cards) {
    const byRank = new Map();
    const bySuit = new Map();
    for (const c of cards) {
      if (!byRank.has(c.rank)) byRank.set(c.rank, []);
      if (!bySuit.has(c.suit)) bySuit.set(c.suit, []);
      byRank.get(c.rank).push(c);
      bySuit.get(c.suit).push(c);
    }
    const uniqueRanks = [...byRank.keys()].sort((a,b) => b-a);
    const groups = [...byRank.entries()]
      .map(([rank, list]) => ({ rank:Number(rank), count:list.length }))
      .sort((a,b) => b.count - a.count || b.rank - a.rank);
    const flushSuit = [...bySuit.entries()].find(([, list]) => list.length >= 5);
    const flushRanks = flushSuit ? flushSuit[1].map(c => c.rank).sort((a,b) => b-a) : [];
    const straightHigh = findStraight(uniqueRanks);
    const straightFlushHigh = flushSuit ? findStraight([...new Set(flushRanks)]) : 0;

    if (straightFlushHigh) return makeEval(8, [straightFlushHigh], straightFlushHigh === 14 ? '皇家同花顺' : `${rankName(straightFlushHigh)}高同花顺`);
    const quads = groups.find(g => g.count === 4);
    if (quads) return makeEval(7, [quads.rank, ...uniqueRanks.filter(r => r !== quads.rank).slice(0,1)], `四条 ${rankName(quads.rank)}`);
    const trips = groups.filter(g => g.count === 3);
    const pairs = groups.filter(g => g.count === 2);
    if (trips.length && (pairs.length || trips.length > 1)) {
      const t = trips[0].rank;
      const p = trips.length > 1 ? trips[1].rank : pairs[0].rank;
      return makeEval(6, [t, p], `葫芦 ${rankName(t)}满${rankName(p)}`);
    }
    if (flushSuit) return makeEval(5, flushRanks.slice(0,5), `${rankName(flushRanks[0])}高同花`);
    if (straightHigh) return makeEval(4, [straightHigh], `${rankName(straightHigh)}高顺子`);
    if (trips.length) {
      const t = trips[0].rank;
      return makeEval(3, [t, ...uniqueRanks.filter(r => r !== t).slice(0,2)], `三条 ${rankName(t)}`);
    }
    if (pairs.length >= 2) {
      const hi = pairs[0].rank, lo = pairs[1].rank;
      return makeEval(2, [hi, lo, ...uniqueRanks.filter(r => r !== hi && r !== lo).slice(0,1)], `两对 ${rankName(hi)}和${rankName(lo)}`);
    }
    if (pairs.length === 1) {
      const p = pairs[0].rank;
      return makeEval(1, [p, ...uniqueRanks.filter(r => r !== p).slice(0,3)], `一对 ${rankName(p)}`);
    }
    return makeEval(0, uniqueRanks.slice(0,5), `${rankName(uniqueRanks[0])}高牌`);
  }

  function findStraight(rs) {
    const ranks2 = [...new Set(rs)].sort((a,b) => b-a);
    if (ranks2.includes(14)) ranks2.push(1);
    let run = 1;
    for (let i = 0; i < ranks2.length - 1; i++) {
      if (ranks2[i] - 1 === ranks2[i+1]) {
        run += 1;
        if (run >= 5) return ranks2[i-3] === 1 ? 5 : ranks2[i-3];
      } else if (ranks2[i] !== ranks2[i+1]) {
        run = 1;
      }
    }
    return 0;
  }

  function makeEval(category, kickers, name) {
    let score = category * 1e10;
    kickers.forEach((k, i) => { score += k * Math.pow(100, 4 - i); });
    return { category, kickers, name, score };
  }

  function compareEval(a, b) {
    return a.score === b.score ? 0 : (a.score > b.score ? 1 : -1);
  }

  function rankName(r) {
    return rankLabel[r] || String(r);
  }

  function init() {
    app.addEventListener('click', (event) => {
      const target = event.target.closest('[data-action]');
      if (!target) return;
      handleAction(target.dataset.action, target.dataset);
    });
    state = loadState() || freshState();
    render();
  }

  init();
})();
