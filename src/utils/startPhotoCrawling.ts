import ProfilePhotoCrawler from "../class/ProfilePhotoCrawler"

const startPhotoCrawling = async () => {
  try {
    const profilePhotoCrawler = new ProfilePhotoCrawler(1915061056);

    await profilePhotoCrawler.startCrawling();
  } catch (e: unknown) {
    console.log(e);
  }
};

startPhotoCrawling();