export interface AnalyzedSegment {
  original: string;
  pronunciation: string;
  translation: string;
}

// Maps exact phrases (or sentences) to their data
export const LYRICS_DATABASE: Record<string, AnalyzedSegment> = {
  "Love me, love me": {
    original: "Love me, love me",
    pronunciation: "/lʌv miː, lʌv miː/",
    translation: "愛我，愛我"
  },
  "Hate me, hate me": {
    original: "Hate me, hate me",
    pronunciation: "/heɪt miː, heɪt miː/",
    translation: "恨我，恨我"
  },
  "Kill me, kill me": {
    original: "Kill me, kill me",
    pronunciation: "/kɪl miː, kɪl miː/",
    translation: "殺了我，殺了我"
  },
  "愛憎愛憎渦巻いて": {
    original: "愛憎愛憎渦巻いて",
    pronunciation: "aiso aiso uzumaite",
    translation: "愛憎交織漩渦之中"
  },
  "大東京狂騒歌って": {
    original: "大東京狂騒歌って",
    pronunciation: "dai-tokyo kyoso utatte",
    translation: "歌唱著大東京的狂躁"
  },
  "廻れ廻れ時代の": {
    original: "廻れ廻れ時代の",
    pronunciation: "maware maware jidai no",
    translation: "旋轉吧旋轉吧時代的"
  },
  "生き恥にずぶ濡れで": {
    original: "生き恥にずぶ濡れで",
    pronunciation: "iki-haji ni zubunure de",
    translation: "渾身濕透於活著的恥辱中"
  },
  "愛憎愛憎を喰らって": {
    original: "愛憎愛憎を喰らって",
    pronunciation: "aiso aiso o kuratte",
    translation: "吞噬著愛憎愛憎"
  },
  "参ろう大層な様で": {
    original: "参ろう大層な様で",
    pronunciation: "mairo taiso na sama de",
    translation: "前來吧以誇張的模樣"
  },
  "離れ離れで終いよ": {
    original: "離れ離れで終いよ",
    pronunciation: "hanare banare de shimai yo",
    translation: "分崩離析就此終結"
  },
  "然らば又逢いましょう": {
    original: "然らば又逢いましょう",
    pronunciation: "saraba mata aimashou",
    translation: "那麼我們再會吧"
  },
  "ドラマチックに溺れて": {
    original: "ドラマチックに溺れて",
    pronunciation: "doramachikku ni oborete",
    translation: "沉溺於戲劇性之中"
  },
  "未完成な私を認めて": {
    original: "未完成な私を認めて",
    pronunciation: "mikansei na watashi o mitomete",
    translation: "認可未完成的我吧"
  },
  "気休めのフィクション": {
    original: "気休めのフィクション",
    pronunciation: "kiyasume no fikushon",
    translation: "自我安慰的虛構故事"
  },
  "嘘と真の不協和音": {
    original: "嘘と真の不協和音",
    pronunciation: "uso to makoto no fukyowaon",
    translation: "謊言與真實的不協調音"
  },
  "出来損な愛でも許して": {
    original: "出来損な愛でも許して",
    pronunciation: "dekisokona ai demo yurushite",
    translation: "即使是殘缺的愛也請原諒"
  },
  "構わない 此の舞台生き抜いて": {
    original: "構わない 此の舞台生き抜いて",
    pronunciation: "kamawanai kono butai ikinuite",
    translation: "沒關係 在這舞台倖存下來"
  },
  "咬ませ狗の武者震い": {
    original: "咬ませ狗の武者震い",
    pronunciation: "kamaseinu no mushaburui",
    translation: "敗犬的武者震(戰慄)"
  },
  "ヤラレっぱなしじゃ": {
    original: "ヤラレっぱなしじゃ",
    pronunciation: "yarareppanashi ja",
    translation: "若總是被打壓"
  },
  "大人しくはなれない": {
    original: "大人しくはなれない",
    pronunciation: "otonashiku wa narenai",
    translation: "就無法乖乖聽話"
  },
  "正しさばかりで": {
    original: "正しさばかりで",
    pronunciation: "tadashisa bakari de",
    translation: "儘是些正確道理"
  },
  "全部奪って": {
    original: "全部奪って",
    pronunciation: "zenbu ubatte",
    translation: "奪走全部"
  },
  "愛憎塗れで": {
    original: "愛憎塗れで",
    pronunciation: "aiso mamire de",
    translation: "渾身沾滿愛憎"
  },
  "此処を連れ出して": {
    original: "此処を連れ出して",
    pronunciation: "koko o tsuredashite",
    translation: "帶我離開這裡"
  },
  "愛憎愛憎抱き合って": {
    original: "愛憎愛憎抱き合って",
    pronunciation: "aiso aiso dakiatte",
    translation: "愛憎相互擁抱"
  },
  "最高潮よ何時だって": {
    original: "最高潮よ何時だって",
    pronunciation: "saikocho yo itsudatte",
    translation: "無論何時都是最高潮"
  },
  "騙し騙しで良いの": {
    original: "騙し騙しで良いの",
    pronunciation: "damashi damashi de ii no",
    translation: "互相欺騙也可以"
  },
  "代償なんて気にしないよ": {
    original: "代償なんて気にしないよ",
    pronunciation: "daisho nante kinishinai yo",
    translation: "不在乎什麼代價"
  },
  "愛憎愛憎に足宛いて": {
    original: "愛憎愛憎に足宛いて",
    pronunciation: "aiso aiso ni agaite",
    translation: "在愛憎中掙扎"
  },
  "外交愛想振り撒いて": {
    original: "外交愛想振り撒いて",
    pronunciation: "gaiko aiso furimaite",
    translation: "對外展現虛偽的笑容"
  },
  "万物問答無用で終いよ": {
    original: "万物問答無用で終いよ",
    pronunciation: "banbutsu mondo muyo de shimai yo",
    translation: "萬物問答無用就此終結"
  },
  "夢見心地で嘘みたいだろう?": {
    original: "夢見心地で嘘みたいだろう?",
    pronunciation: "yumemigokochi de uso mitai darou?",
    translation: "如夢似幻像謊言一樣對吧?"
  },
  "今の東京では正気じゃ居られない": {
    original: "今の東京では正気じゃ居られない",
    pronunciation: "ima no tokyo dewa shoki ja irarenai",
    translation: "在現在的東京無法保持清醒"
  },
  "甘い言葉で疼かせて": {
    original: "甘い言葉で疼かせて",
    pronunciation: "amai kotoba de uzukasete",
    translation: "用甜言蜜語讓我疼痛"
  },
  "今が最高とそう思わせて": {
    original: "今が最高とそう思わせて",
    pronunciation: "ima ga saiko to so omawasete",
    translation: "讓我以為現在是最棒的"
  },
  "情けは無用ね": {
    original: "情けは無用ね",
    pronunciation: "nasake wa muyo ne",
    translation: "不需要同情"
  },
  "世情無常で一生平行線ね": {
    original: "世情無常で一生平行線ね",
    pronunciation: "sejo mujo de issho heikosen ne",
    translation: "世事無常一生平行線"
  },
  "今日も無情いね": {
    original: "今日も無情いね",
    pronunciation: "kyo mo mujo ine", // Note: "無情い" usually read as mujo-i or nasakenai depending on context, assuming standard here
    translation: "今天也依然無情"
  },
  "心剥き出しで": {
    original: "心剥き出しで",
    pronunciation: "kokoro mukidashi de",
    translation: "赤裸裸的心"
  }
};

export const DEFAULT_LYRICS = `Love me, love me
Hate me, hate me
Love me, love me
Kill me, kill me
愛憎愛憎渦巻いて
大東京狂騒歌って
廻れ廻れ時代の
生き恥にずぶ濡れで
愛憎愛憎を喰らって
参ろう大層な様で
離れ離れで終いよ
然らば又逢いましょう
ドラマチックに溺れて
未完成な私を認めて
気休めのフィクション
嘘と真の不協和音
出来損な愛でも許して
構わない 此の舞台生き抜いて
咬ませ狗の武者震い
ヤラレっぱなしじゃ
大人しくはなれない
Love me, love me
正しさばかりで
Hate me, hate me
全部奪って
Love me, love me
愛憎塗れで
Kill me, kill me
此処を連れ出して
愛憎愛憎抱き合って
最高潮よ何時だって
騙し騙しで良いの
代償なんて気にしないよ
愛憎愛憎に足宛いて
外交愛想振り撒いて
万物問答無用で終いよ
然らば又逢いましょう
夢見心地で嘘みたいだろう?
今の東京では正気じゃ居られない
甘い言葉で疼かせて
今が最高とそう思わせて
情けは無用ね
世情無常で一生平行線ね
愛憎塗れで
此処を連れ出して
正しさばかりで
Hate me, hate me
今日も無情いね
Love me, love me
愛憎塗れで
Kill me, kill me
心剥き出しで
愛憎愛憎渦巻いて
大東京狂騒歌って
廻れ廻れ時代の
生き恥にずぶ濡れで
愛憎愛憎を喰らって
参ろう大層な様で
離れ離れで終いよ
然らば又逢いましょう
愛憎愛憎抱き合って
最高潮よ何時だって
騙し騙しで良いの
代償なんて気にしないよ
愛憎愛憎に足宛いて
外交愛想振り撒いて
万物問答無用で終いよ
然らば又逢いましょう
Love me, love me
正しさばかりで
Hate me, hate me
全部奪って
Love me, love me
愛憎塗れで
Kill me, kill me
此処を連れ出して
Love me, love me
正しさばかりで
Hate me, hate me
今日も無情いね
Love me, love me
愛憎塗れで
Kill me, kill me
心剥き出しで`;
