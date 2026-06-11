window.jadeSeries = (() => {
  const imageList = (base, names) => names.map((name) => `${base}/${name}`);
  const sequence = (base, start, end, ext = "jpg") =>
    Array.from({ length: end - start + 1 }, (_, index) => `${base}/${start + index}.${ext}`);
  const numbered = (base, numbers, suffix) =>
    numbers.map((number) => `${base}/${String(number).padStart(2, "0")}-${suffix}.jpg`);

  const natural = "年份/22摄影/大二上/22，5，23广告结课";
  const whale = "年份/22摄影/大三上/2022年11月16日记录摄影与图片编辑/鲸鱼卵图像";
  const zero20 = "年份/22摄影/大三上/22.10.25【020】摄影创作实习结课/1结课/020";
  const tiao = "年份/23摄影/大三下/230320藤蔓身体/苕之华/大图照片";
  const epitaph = "年份/23摄影/大四/毕业设计/素材/final/疑树·Epitaph·jpg/预览版本";
  const hesitation = "年份/23摄影/大四/毕业设计/素材/final/纪彤心《疑树》/2展览现场图/地丁并未决定hesitation";
  const upstreamWind = "年份/23摄影/大四/毕业设计/素材/final/纪彤心《疑树》/2展览现场图/上游的风";

  return [
    {
      id: "hesitation",
      year: "2025",
      titleZh: "地丁并未决定",
      titleEn: "Hesitation",
      mediumZh: "摄影、行为影像",
      mediumEn: "Photography, Performance Video",
      cover: `${hesitation}/1.jpg`,
      videos: {
        titleZh: "行为影像",
        titleEn: "Performance Video",
        items: [
          {
            titleZh: "纸蜻蜓",
            titleEn: "Paper Dragonfly",
            embedSrc: "https://www.youtube.com/embed/9iE9hkz--Lo",
          },
          {
            titleZh: "籽",
            titleEn: "Seed",
            embedSrc: "https://www.youtube.com/embed/P_6Q5-wSdcM",
          },
        ],
      },
      statementZh: [
        `这组作品产生于一次在秦岭驻地期间的持续拍摄。创作并非源于明确的叙事计划，而是在行走、停留与反复的身体在场中逐渐显现。环境并不作为被描绘的对象出现，而更像是一种持续施加影响的条件：色彩被削弱，节奏被放慢，判断与意义不断被延后。`,
        `摄影在此并不承担确认或解释的功能。图像之间不存在明确的因果关系，它们更像是在同一状态中被并置的片段，通过靠近、疏离与间隔形成松散的关联。这种关联并不稳定，也不指向结论，而是始终处于一种未被完成的状态之中。`,
        `身体以一种低调的方式进入场所，作为感知的尺度而非叙述的主体。行走、停顿、俯视、触摸，以及对环境中细微变化的感受，构成了图像生成的核心条件。介入并非为了制造事件，而是在不确定与犹豫中留下痕迹。这些痕迹并不强调自身的意义，而是与环境共同构成一种暂时的平衡，随后又可能消散。`,
        `作品中的元素来自经验、记忆或偶然的触发，它们并未被整理为象征系统，而是保持着未被命名的状态。它们之间不构成解释关系，而是共同指向一种难以言说的感受——脆弱、迟疑、短暂，且无法被完全把握。`,
        `《地丁并未决定》并不试图回答问题。作品所保留的，是意义尚未成形之前的阶段：在判断发生之前，在结论被提出之前，摄影作为一种在场的方式，允许未决定持续存在。`,
      ],
      statementEn: [
        `This body of work emerged from an ongoing period of photographing during a residency in the Qinling Mountains. It did not begin from a clear narrative plan, but gradually surfaced through walking, pausing, and repeated bodily presence. The environment does not appear as an object to be depicted, but rather as a condition that continuously exerts influence: color is weakened, rhythm slows down, and judgment and meaning are repeatedly deferred.`,
        `Photography here does not function as confirmation or explanation. There is no clear causal relationship between the images. They are more like fragments placed side by side within the same state, forming loose associations through proximity, distance, and interval. This relation is unstable and does not point toward a conclusion; it remains in an unfinished state.`,
        `The body enters the site in a quiet way, serving as a scale of perception rather than the subject of narration. Walking, stopping, looking down, touching, and sensing subtle changes in the environment form the core conditions through which the images come into being. The intervention is not intended to create an event, but to leave traces amid uncertainty and hesitation. These traces do not emphasize their own meaning, but temporarily balance with the environment before perhaps dispersing again.`,
        `The elements in the work arise from experience, memory, or accidental triggers. They are not organized into a symbolic system, but remain unnamed. They do not explain one another; instead, together they point toward a feeling that is difficult to articulate: fragile, hesitant, brief, and impossible to fully grasp.`,
        `Hesitation does not attempt to answer a question. What the work preserves is the stage before meaning takes form: before judgment occurs, before a conclusion is proposed. Photography, as a mode of presence, allows the undecided to continue existing.`,
      ],
      sections: [
        {
          id: "images",
          titleZh: "图像",
          titleEn: "Images",
          images: sequence(hesitation, 1, 26),
        },
      ],
    },
    {
      id: "nature-of-nature",
      year: "2022",
      titleZh: "自然的自然",
      titleEn: "Nature of Nature",
      mediumZh: "摄影",
      mediumEn: "Photography",
      cover: `${natural}/6.jpg`,
      layout: "thumbnails",
      sections: [
        {
          id: "images",
          titleZh: "图像",
          titleEn: "Images",
          images: imageList(natural, ["6.jpg", "7.jpg", "9.jpg"]),
        },
      ],
    },
    {
      id: "whale-eggs",
      year: "2022",
      titleZh: "鲸鱼卵",
      titleEn: "Whale Eggs",
      mediumZh: "摄影",
      mediumEn: "Photography",
      cover: `${whale}/1.jpg`,
      layout: "thumbnails",
      sections: [
        {
          id: "images",
          titleZh: "图像",
          titleEn: "Images",
          images: sequence(whale, 1, 7),
        },
      ],
    },
    {
      id: "zero-twenty",
      year: "2022",
      titleZh: "020",
      titleEn: "020",
      mediumZh: "摄影、手工书",
      mediumEn: "Photography, Handmade Book",
      cover: `${zero20}/1.JPG`,
      layout: "thumbnails",
      video: {
        titleZh: "020",
        titleEn: "020",
        embedSrc: "https://www.youtube.com/embed/7MhzTIrHk-E",
      },
      sections: [
        {
          id: "images",
          titleZh: "图像",
          titleEn: "Images",
          images: [
            `${zero20}/1.JPG`,
            `${zero20}/2.jpg`,
            `${zero20}/3.jpg`,
            `${zero20}/4.jpg`,
            `${zero20}/JPEG/5.jpg`,
            `${zero20}/6.jpg`,
            `${zero20}/8.jpg`,
            `${zero20}/9.jpg`,
          ],
        },
      ],
    },
    {
      id: "tiao-zhi-hua",
      year: "2023",
      titleZh: "苕之华",
      titleEn: "Summoning the Flower",
      mediumZh: "摄影、行为影像",
      mediumEn: "Photography, Performance Video",
      cover: `${tiao}/1.jpg`,
      statementZh: [
        `作品名字是诗经里的一首诗。`,
        `苕之华，芸其黄矣。心之忧矣，维其伤矣。苕之华，其叶青青。知我如此，不如无生。牂羊坟首，三星在罶。人可以食，鲜可以饱。`,
        `原诗是具有现实主义精神的，和我所理解的藤蔓与框架相符合，尤其喜欢“知我如此，不如无生”，藤蔓的生长是我所羡慕的，也是我所感叹的，它如此的不管不顾的生长，但也无法逃离框架。`,
        `影像场景中，背后是密密麻麻的树林，一个人选择了一棵单薄的树攀爬上去，在上面坐、立，风正在裹挟着人，人裹挟着树，在风中，在树林中，人与树紧紧相依。身体作为媒介，攀爬在树上，体会树的温度与高度，重新感知自己与藤蔓的关系，也构造出一个凝视、聆听、感受这个时空的框架。`,
      ],
      statementEn: [
        `The title of the work is inspired by a poem from the "Book of Songs":`,
        `"The blossoms of the wild pea, yellowing gracefully. My heart is heavy, filled with sorrow. The blossoms of the wild pea, their leaves so green. To know me as I am, it might be better not to have lived at all."`,
        `The original poem embodies a realistic spirit, resonating with my understanding of the interplay between vines and frameworks. I am particularly fond of the line, "To know me as I am, it might be better not to have lived at all," which echoes the unrestrained growth of vines, yet acknowledges their inescapable constraints within a framework.`,
        `In the imagery scene, a person stands against a backdrop of dense woods. They choose a solitary, slender tree and climb it, sitting and standing atop its branches. The wind envelops the person, and in turn, the person envelops the tree. Amidst the gusts and within the forest, the person and the tree cling to each other tightly. Using their body as a medium, they climb the tree, experiencing its warmth and height, rediscovering their connection with the vines. This creates a framework for gazing, listening, and feeling the present moment and space.`,
      ],
      sections: [
        {
          id: "images",
          titleZh: "图像",
          titleEn: "Images",
          images: sequence(tiao, 1, 12),
        },
      ],
    },
    {
      id: "upstream-wind",
      year: "2023",
      titleZh: "上游的风",
      titleEn: "The Wind Upstream",
      mediumZh: "纪录片",
      mediumEn: "Documentary",
      cover: `${upstreamWind}/海报.jpg`,
      statementZh: [
        `在西安青年旅社的一些人和一些他们的故事。`,
      ],
      statementEn: [
        `A documentary about several people at a youth hostel in Xi'an and some of their stories.`,
      ],
      video: {
        titleZh: "上游的风",
        titleEn: "The Wind Upstream",
        embedSrc: "https://www.youtube.com/embed/uN6FlCbxMcs",
        poster: `${upstreamWind}/海报.jpg`,
      },
      sections: [],
    },
    {
      id: "epitaph",
      year: "2024",
      titleZh: "疑树",
      titleEn: "Epitaph",
      mediumZh: "摄影、行为影像、摄影书",
      mediumEn: "Photography, Performance Video, Photo Book",
      cover: `${epitaph}/01-呼吸时.jpg`,
      video: {
        titleZh: "种子",
        titleEn: "Seed",
        embedSrc: "https://www.youtube.com/embed/c_ILMBvMGZY",
        descriptionZh: [
          `“种子”为行为短片。将祖父的遗像使用明胶蓝晒印相在海边捡到的鹅卵石上，祖父曾经是一名火车列车员，我将印照着他最后一张照片的石头放在被植物环绕的铁轨上，反复出现的行走画面、重复出现的列车行驶，最后将鹅卵石放在铁轨上的花岗岩碎石间，我终于走进铁轨的深处。`,
        ],
        descriptionEn: [
          `"Seed" is a short performance film. Using the gelatin cyanotype process, I printed my grandfather's memorial portrait onto a pebble found by the sea. My grandfather was once a train conductor. I placed the stone bearing his final photograph on a railway track surrounded by plants. Repeated images of walking and recurring shots of passing trains appear throughout the film. Finally, I placed the pebble among the granite ballast on the tracks, and walked into the depths of the railway.`,
        ],
      },
      statementZh: [
        `《疑树》是一场情感叙事的诗化表达，从对亲人的回忆出发，将个体记忆、情绪和物像融入“春”的意象中，构建为一棵树在春天的故事。它源自创作者在春天中的四篇随笔。将创作者的隐蔽性记忆解构使用编排式摄影的工作方式进行建构。创作者以祖父和外婆的两处埋葬地点作为拍摄线索，通过多媒介的表达语言进行图像叙事的构建，包括摄影书、录像作品的介入。力图通过多媒介融合的叙事手段表现死亡与生命力之间的双重特征。`,
      ],
      statementEn: [
        `"Epitaph" is a poetic expression of emotional narrative, starting from the memories of loved ones, integrating individual memories, emotions and objects into the imagery of "spring", and constructing it as a story of a tree in spring. It is derived from four essays by the artist in the spring. The deconstruction of the artist's hidden memories is constructed using the working method of choreographic photography. The artist uses the two burial sites of her grandfather and maternal grandmother as shooting clues, and constructs image narratives through multi-media expression language, including the intervention of photo books and video works. It tries to express the dual characteristics between death and vitality through the narrative of multi-media integration.`,
      ],
      sections: [
        {
          id: "breathing",
          titleZh: "呼吸时",
          titleEn: "Breathing",
          poemZh: [
            "春天，第一月，祖父潮湿的房间里。",
            "春雷和雨，无法停歇的交织。",
            "滴滴落在那日他在梦中与我告别的沙滩上。",
            "睁眼，看到雷声与海浪声交织，我第一次听到了那只来到树下躲雨的麻雀。",
          ],
          poemEn: [
            "Spring, in its first month, unfolds in my grandfather's damp room.",
            "The spring thunder and rain intertwine incessantly,",
            "Each drop falling onto the sandy shore where he bid me farewell in a dream.",
            "Upon opening my eyes, I see and hear the thunder and sea waves blending together, and for the first time, I catch the sound of a sparrow that has sought refuge under a tree from the rain.",
          ],
          images: [
            ...numbered(epitaph, [1, 2], "呼吸时"),
            `${epitaph}/03-呼吸时 .jpg`,
            ...numbered(epitaph, [4, 5, 6, 7, 8, 9, 10], "呼吸时"),
          ],
        },
        {
          id: "photosynthesis",
          titleZh: "光合时",
          titleEn: "Photosynthesis",
          poemZh: [
            "春天，第二月，阳光铺在叶子上。",
            "树缠绕着藤蔓生长，阳光下起舞、合为一体。",
            "正午的阳光，浓绿色的森林。",
            "第二次，我看见麻雀，它身旁散放着幽白色的光尘。",
          ],
          poemEn: [
            "Spring, in its second month, sees sunlight spreading across the leaves.",
            "Trees grow entwined with vines, dancing together in the sunlight and becoming one.",
            "Under the intense midday sun, the forest is a deep, lush green.",
            "For the second time, I catch sight of a sparrow, with a faint, ethereal white light dust surrounding it.",
          ],
          images: [
            ...numbered(epitaph, [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], "光合时"),
            `${epitaph}/25-光合时副本.jpg`,
            `${epitaph}/26-光合时.jpg`,
          ],
        },
        {
          id: "blooming",
          titleZh: "花开时",
          titleEn: "Blooming",
          poemZh: [
            "春天，是三月，春风去了寒意。",
            "草原连接着荒城，野火无法烧尽满地。",
            "春风一吹，又是野草。",
            "第三次，麻雀看见我，羽毛上的灰尘，落在树叶间盛开的花朵。",
            "我对火许愿，希望再见到它。",
          ],
          poemEn: [
            "Spring arrives in March, with the spring breeze dispelling the chill.",
            "The grassland stretches out to meet the deserted city, where wildfires cannot consume the abundance that lies upon the ground.",
            "With a gentle puff of the spring breeze, the wild grass grows anew.",
            "For the third time, a sparrow spots me, and dust from its feathers settles on the blossoms that have opened amidst the leaves.",
            "I make a wish to the fire, hoping to see it again.",
          ],
          images: numbered(epitaph, [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41], "花开时"),
        },
        {
          id: "dissolving",
          titleZh: "化于时",
          titleEn: "Dissolving in Time",
          poemZh: [
            "春天，结束。",
            "麻雀落到树的身边，它带来一切的碎片。",
            "碎片是告别，告别是新的麻雀。",
            "来年春天，还会再见吗。",
          ],
          poemEn: [
            "Spring concludes.",
            "A sparrow lands beside the tree, bringing with it fragments of everything.",
            "These fragments are farewells, and farewells herald new sparrows.",
            "Will we meet again in the spring of next year?",
          ],
          images: numbered(epitaph, [42, 43, 44, 45, 46, 47, 48, 49, 50, 51], "化于时"),
        },
      ],
    },
  ];
})();
