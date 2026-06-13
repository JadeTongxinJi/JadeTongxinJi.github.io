// 这里是 About 页的可编辑内容。
// 以后如果要改简介、学历、导师、驻地、展览或联系方式，只需要改这个文件里引号中的文字。
// 参展 / 入围 / 获奖履历在 exhibitions-data.js 的 jadePresentationHistory 中维护。
// 学历、导师、驻地按 { zh: "中文", en: "English" } 的格式添加或修改。

window.jadeAboutContent = {
  meta: {
    title: "About / Jade Tongxin Ji",
    description:
      "About Jade Tongxin Ji / 纪彤心, artist biography, education, residency, exhibitions and awards.",
  },

  siteName: "Jade Tongxin Ji / 纪彤心",
  eyebrow: "ABOUT / 关于",
  nameZh: "纪彤心",
  nameEn: "JADE\nTongxin Ji",

  heroImage: {
    src: "个人简历照片2.JPG",
    alt: "Portrait of Jade Tongxin Ji",
    caption: "",
  },

  bio: {
    zhTitle: "个人简介 / BIOGRAPHY",
    zh:
      "纪彤心，2002年生。创作常以摄影、影像、行为等综合媒介展开，围绕自我身份、身体经验、记忆与物像之间的关系进行探索。",
    enTitle: "",
    en:
      "Jade Tongxin Ji, born in 2002. The practice often works across photography, moving image and performance, exploring self-identity, bodily experience, memory and the relationship between image and object.",
  },

  facts: [
    {
      title: "学历 / Education",
      entries: [
        {
          zh: "2024.09-至今 硕士，西安美术学院影视动画系，摄影艺术方向",
          en: "2024.09-present MFA Candidate, Photography Art, Department of Film and Animation, Xi'an Academy of Fine Arts",
        },
        {
          zh: "2020.09-2024.06 本科，西安美术学院影视动画系，摄影专业",
          en: "2020.09-2024.06 BFA, Photography, Department of Film and Animation, Xi'an Academy of Fine Arts",
        },
      ],
    },
    {
      title: "导师 / Advisor",
      entries: [
        {
          zh: "苏晟",
          en: "Sheng Su",
        },
      ],
    },
    {
      title: "驻地 / Residency",
      entries: [
        {
          zh: "2026.04-2026.06 巴黎艺术城驻地，法国巴黎",
          en: "2026.04-2026.06 Artist Residency, Cité Internationale des Arts, Paris, France",
        },
        {
          zh: "2025.10-2025.11 鄠邑区蔡家坡村驻地，陕西西安",
          en: "2025.10-2025.11 Artist Residency, Caijiapo Village, Huyi District, Xi'an, Shaanxi, China",
        },
      ],
    },
  ],

  exhibitionsTitle: "参展与获奖\nExhibitions / Awards / Screenings",
  exhibitions: [],

  footerLinks: [],
};
