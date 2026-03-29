/* Shared image paths and category metadata — load before home.js / category.js */
(function (global) {
  const imagesData = {
    birthday: [
      "images/Birthday/im1.jpg",
      "images/Birthday/im2.jpg",
      "images/Birthday/im3.jpg",
      "images/Birthday/im4.webp",
      "images/Birthday/im5.webp",
      "images/Birthday/im6.webp",
      "images/Birthday/im7.webp",
      "images/Birthday/im8.webp",
      "images/Birthday/im9.webp",
      "images/Birthday/im10.webp",
      "images/Birthday/im11.webp",
      "images/Birthday/im12.webp"
    ],
    wedding: [
      "images/Wedding/im1.webp",
      "images/Wedding/im2.webp",
      "images/Wedding/im3.webp",
      "images/Wedding/im4.webp",
      "images/Wedding/im5.webp",
      "images/Wedding/im6.webp",
      "images/Wedding/im7.webp",
      "images/Wedding/im8.webp",
      "images/Wedding/im9.webp",
      "images/Wedding/im10.webp"
    ],
    "baby-welcome": [
      "images/Baby welcome/im1.webp",
      "images/Baby welcome/im2.webp",
      "images/Baby welcome/im3.webp",
      "images/Baby welcome/im4.webp",
      "images/Baby welcome/im5.webp",
      "images/Baby welcome/im6.webp",
      "images/Baby welcome/im7.webp",
      "images/Baby welcome/im8.webp"
    ],
    naming: [
      "images/Naming/im1.webp",
      "images/Naming/im2.webp",
      "images/Naming/im3.webp",
      "images/Naming/im4.webp",
      "images/Naming/im5.webp",
      "images/Naming/im6.webp",
      "images/Naming/im7.webp",
      "images/Naming/im8.webp"
    ],
    haldi: [
      "images/Haldi/im1.webp",
      "images/Haldi/im2.webp",
      "images/Haldi/im3.webp",
      "images/Haldi/im4.webp",
      "images/Haldi/im5.webp",
      "images/Haldi/im6.webp"
    ]
  };

  const categoryAltLabel = {
    birthday: "Birthday party",
    wedding: "Wedding",
    "baby-welcome": "Baby welcome",
    naming: "Naming ceremony",
    haldi: "Haldi"
  };

  const searchCategories = [
    { slug: "birthday", label: "Birthday" },
    { slug: "wedding", label: "Wedding" },
    { slug: "baby-welcome", label: "Baby Welcome" },
    { slug: "naming", label: "Naming" },
    { slug: "haldi", label: "Haldi" }
  ];

  function altForGalleryImage(category, src) {
    const file = src.split("/").pop();
    const label = categoryAltLabel[category] || "Event";
    return `${label} decoration — ${file}`;
  }

  /** Folder path (with trailing slash) for each category — used to resolve hero.* */
  const folderBaseByCategory = {
    birthday: "images/Birthday/",
    wedding: "images/Wedding/",
    "baby-welcome": "images/Baby welcome/",
    naming: "images/Naming/",
    haldi: "images/Haldi/"
  };

  const categoryDisplayName = {
    birthday: "Birthday",
    wedding: "Wedding",
    "baby-welcome": "Baby Welcome",
    naming: "Naming",
    haldi: "Haldi"
  };

  function buildWhatsappShareUrl(imageSrc) {
    const absoluteUrl = new URL(imageSrc, global.location.href).href;
    const message =
      "Check out this beautiful decoration from Abhi Events! " + absoluteUrl;
    return (
      "https://api.whatsapp.com/send?text=" + encodeURIComponent(message)
    );
  }

  /** Inquiry message: image # is 1-based index in the gallery set */
  function buildWhatsappInquiryUrl(displayName, imageNumber) {
    const msg =
      "Hi Abhi Events, I'm inquiring about " +
      displayName +
      " decoration image #" +
      imageNumber +
      "!";
    return (
      "https://api.whatsapp.com/send?text=" + encodeURIComponent(msg)
    );
  }

  function isHeroFilename(basename) {
    return /^hero\.(jpe?g|png|webp)$/i.test(basename);
  }

  /** Gallery images only (excludes hero.* from the same folder list) */
  function getGridImagesForCategory(categoryKey) {
    const list = imagesData[categoryKey];
    if (!list) return [];
    return list.filter(function (src) {
      const base = src.split("/").pop() || "";
      return !isHeroFilename(base);
    });
  }

  global.AbhiEvents = {
    imagesData,
    categoryAltLabel,
    searchCategories,
    folderBaseByCategory,
    categoryDisplayName,
    altForGalleryImage,
    buildWhatsappShareUrl,
    buildWhatsappInquiryUrl,
    getGridImagesForCategory,
    isHeroFilename
  };
})(typeof window !== "undefined" ? window : this);
