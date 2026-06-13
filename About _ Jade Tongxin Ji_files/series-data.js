window.jadeSeries = (() => {
  const imageList = (base, names) => names.map((name) => `${base}/${name}`);
  const sequence = (base, start, end, ext = "jpg") =>
    Array.from({ length: end - start + 1 }, (_, index) => `${base}/${start + index}.${ext}`);
  const paddedSequence = (base, start, end, ext = "jpg") =>
    Array.from({ length: end - start + 1 }, (_, index) => `${base}/${String(start + index).padStart(2, "0")}.${ext}`);
  const numbered = (base, numbers, suffix) =>
    numbers.map((number) => `${base}/${String(number).padStart(2, "0")}-${suffix}.jpg`);

  const dandelionParis = "works/dandelion-has-not-decided/images";
  const newYearElevator = "works/new-year-elevator/images";
  const natural = "年份/22摄影/大二上/22，5，23广告结课";
  const whale = "年份/22摄影/大三上/2022年11月16日记录摄影与图片编辑/鲸鱼卵图像";
  const zero20 = "年份/22摄影/大三上/22.10.25【020】摄影创作实习结课/1结课/020";
  const tiao = "年份/23摄影/大三下/230320藤蔓身体/苕之华/大图照片";
  const epitaph = "年份/23摄影/大四/毕业设计/素材/final/疑树·Epitaph·jpg/预览版本";
  const hesitation = "年份/23摄影/大四/毕业设计/素材/final/纪彤心《疑树》/2展览现场图/地丁并未决定hesitation";
  const upstreamWind = "年份/23摄影/大四/毕业设计/素材/final/纪彤心《疑树》/2展览现场图/上游的风";

  return [
    {
      id: "dandelion-has-not-decided",
      year: "2026",
      titleZh: "地丁",
      titleEn: "The Dandelion Has Not Decided",
      mediumZh: "摄影、装置、合作视频",
      mediumEn: "Photography, Installation, Collaborative Video",
      cover: `${dandelionParis}/photography/01.jpg`,
      atmosphereImage: `${dandelionParis}/statement-atmosphere.jpg`,
      video: {
        titleZh: "合作视频：对面的窗户",
        titleEn: "Collaborative Video: The Opposite Window",
        embedSrc: "https://www.youtube.com/embed/Q1-2B_Rr4kc",
        descriptionZh: [
          `这件视频作品来自我与 Lars Åkerlund 的合作。他是一位住在我窗对面的电子音乐人。通过房间、窗户、光与声音，我们找到了一种间接的连接。距离、误读、翻译，以及即使无法完全靠近时仍然发生的沟通，构成了这件作品的核心。`,
        ],
        descriptionEn: [
          `This video work comes from a collaboration with Lars Åkerlund, an electronic musician living across from my window. Through rooms, windows, light, and sound, we found an indirect connection. Distance, misreading, translation, and the communication that still takes place when complete closeness is impossible.`,
        ],
        collaborator: {
          titleZh: "合作艺术家",
          titleEn: "Collaborating Artist",
          name: "Lars Åkerlund",
          image: `${dandelionParis}/collaboration/lars-akerlund.png`,
          imageAlt: "Lars Åkerlund biography and performance image",
          instagram: "https://www.instagram.com/akerlund_lars/",
          bioZh: [
            `Lars Åkerlund 是一位音乐人、表演者和作曲家，使用电脑、合成器、模拟声音与田野录音工作，创作扎根于质感、噪音与转化。`,
            `自 1980 年代以来，他以个人创作和跨领域合作的方式与不同学科的音乐人与艺术家工作。近十年来，他主要专注于作曲、现场电子、巡演、合作以及在不同唱片厂牌发表作品。`,
          ],
          bioEn: [
            `Lars Åkerlund is a musician, performer and composer working with computers, synthesizers, analog sound and field recordings, rooted in texture, noise and transformation.`,
            `Since the 1980s he has worked both solo and in collaboration with musicians and artists from various disciplines. Over the past ten years Åkerlund has primarily focused on composition, live electronics, touring, collaborations and the publication of works on different record labels.`,
          ],
        },
      },
      statementZh: [
        `在巴黎的创作过程中，我开始意识到记忆的流逝，以及摄影在其中所能承担的保存作用。`,
        `这组作品并不试图呈现一座城市的完整面貌，而是从个人在异地生活中的身体经验出发，记录那些不断发生、又迅速消失的细节，走过的街道、没有完全理解的语言、突然涌现的情绪、身体的疼痛与疲惫。它们并不构成一个明确事件，却持续地改变着我与周围环境之间的关系。`,
        `皮肤过敏、跌倒后留下的淤青、被带入房间的植物与水果、逐渐变化的气味和表面，都成为作品中的视觉线索。这些细节既来自日常，也超出日常本身。它们共同构成了一种关于停留、流逝和未定状态的叙事。`,
        `地丁——蒲公英，它会散开、落下，在不同的环境中继续生长。它的“并未决定”是一种始终处在移动、受力和重新定位之中的状态。`,
        `它关注的不是抵达某个确定的位置，而是在一段不断流逝的时间中，身体、记忆与场所如何彼此作用。摄影在这里成为一种确认，这些轻微的事情曾经发生过，我曾以身体、情绪和图像的方式停留在这里。`,
      ],
      statementEn: [
        `During my creative process in Paris, I became increasingly aware of the passage of memory, and of photography’s capacity to preserve what is otherwise easily lost.`,
        `This series does not attempt to present a complete image of the city. Instead, it begins with my bodily experience of living in a foreign place, recording details that continually occur and quickly disappear: streets I have walked through, languages I have not fully understood, emotions that arise suddenly, and the pain and fatigue carried by the body. These fragments do not form a clear event, yet they continue to reshape my relationship with the surrounding environment.`,
        `Skin allergies, bruises left after falling, plants and fruits brought into the room, and the gradual changes of smell and surface all become visual clues within the work. These details come from everyday life, yet they also move beyond the everyday. Together, they construct a narrative about staying, passing, and a state of not having decided.`,
        `The dandelion scatters, falls, and continues to grow in different environments. Its state of “not having decided” is not one of confusion, but rather a condition of being constantly in motion, acted upon, and repositioned.`,
        `The work is not concerned with arriving at a fixed position. Rather, it explores how the body, memory, and place act upon one another within a period of time that is constantly passing. Here, photography becomes a form of confirmation: these subtle things once happened, and I once stayed here through my body, my emotions, and my images.`,
      ],
      sections: [
        {
          id: "photography",
          titleZh: "摄影",
          titleEn: "Photography",
          images: paddedSequence(`${dandelionParis}/photography`, 1, 20),
        },
        {
          id: "installation",
          titleZh: "装置",
          titleEn: "Installation",
          images: [
            {
              src: `${dandelionParis}/installation/01-dredged-from-the-album.jpg`,
              captionZh: "从相册中垂钓",
              captionEn: "Dredged from the Album",
              descriptionZh: [
                `我在巴黎的日记：街上看到的事物、身体的状况、偶然的图像，以及那些尚未被整理的瞬间。我把它们挂在晾衣架上，仿佛从相册中打捞出仍然潮湿的图像。`,
              ],
              descriptionEn: [
                `My diary in Paris: things seen on the street, bodily conditions, accidental images, and moments that have not yet been organized. I hang them on a drying rack, as if dredging up images that are still damp from the album.`,
              ],
            },
            {
              src: `${dandelionParis}/installation/02-trivial.jpg`,
              captionZh: "琐碎",
              captionEn: "Trivial",
            },
          ],
        },
      ],
    },
    {
      id: "new-year-elevator",
      year: "2024",
      titleZh: "新年电梯",
      titleEn: "New Year Elevator",
      mediumZh: "摄影、装置",
      mediumEn: "Photography, Installation",
      cover: `${newYearElevator}/photography/01.jpg`,
      layout: "thumbnails",
      statementZh: [
        `本作品以小型电梯模型为核心，通过装置与摄影照片的结合，反映广州旧居民楼老龄住户面对小区加装电梯时的矛盾与无奈。电梯不仅是一个现代化设施，更是旧城区居民们渴望改善生活却因全楼共识而无法实现的梦想。装置上贴附的照片中，老年人在本应有电梯的窗户前讲述着他们的生活故事，表情中透露着隐隐的失落与向往，他们一方面希望通过加装电梯来消除生活中的障碍，带来便捷，另一方面却因复杂的社区关系而面临决策困境。加装电梯的议题在矛盾与挣扎中被搁置，仿佛映射着旧城区住户对生活的另一种无能为力。作品将这个议题还原于展览现场，邀请观众们反思在城市化进程中，个体在社会集体决策中的孤立与无奈感。电梯的存在与否不仅仅是物理空间的转变，更是对旧居民楼住户状况的现实反映。`,
      ],
      statementEn: [
        `This work centers on a small elevator model and combines installation with photographic images to reflect the contradictions and helplessness faced by elderly residents of old residential buildings in Guangzhou when confronted with the installation of elevators in their community. The elevator is not only a modern facility but also represents the dreams of residents in the old city who long to improve their lives but find these aspirations thwarted by the need for consensus among all residents. In the attached photographs, elderly individuals narrate their life stories in front of windows where elevators should be, their expressions revealing subtle feelings of loss and yearning. On one hand, they hope that adding elevators will eliminate barriers in their lives and provide convenience; on the other hand, they face decision-making dilemmas due to complex community relationships. The issue of elevator installation is set aside amidst contradictions and struggles, seemingly reflecting another form of helplessness experienced by the residents of the old district. This work restores this issue within the exhibition space, inviting the audience to reflect on the isolation and helplessness individuals feel in collective decision-making processes during urbanization. The presence or absence of the elevator signifies not just a physical transformation of space, but also serves as a realistic reflection of the conditions faced by the residents of old buildings.`,
      ],
      sections: [
        {
          id: "photography",
          titleZh: "摄影",
          titleEn: "Photography",
          showNumbers: false,
          thumbnailGrid: "new-year-photography",
          images: paddedSequence(`${newYearElevator}/photography`, 1, 49),
        },
        {
          id: "installation",
          titleZh: "装置图片",
          titleEn: "Installation Images",
          thumbnailGrid: "new-year-installation",
          images: paddedSequence(`${newYearElevator}/installation`, 1, 4),
        },
      ],
    },
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
      titleEn: "ON THE WAY",
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
        titleEn: "ON THE WAY",
        embedSrc: "https://www.youtube.com/embed/uN6FlCbxMcs",
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
