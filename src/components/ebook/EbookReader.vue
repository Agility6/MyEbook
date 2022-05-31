<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";
import Epub from "epubjs";
import {
  getFontFamily,
  getFontSize,
  getLocation,
  getTheme,
  saveFontFamily,
  saveFontSize,
  saveTheme,
} from "../../utils/localStorage.js";

global.ePub = Epub;
export default {
  name: "EbookReader",
  mixins: [ebookMixin],
  methods: {
    initFontSize() {
      let fontSize = getFontSize(this.fileName);
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize);
      } else {
        this.rendition.themes.fontSize(fontSize);
        this.setDefaultFontSize(fontSize);
      }
    },
    initFontFamily() {
      let font = getFontFamily(this.fileName);
      /**
       * 判断字体存不存在
       * 不存在：说明是默认值
       * 存在：对存在的font设置,对字体选择进行更新
       */
      if (!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily);
      } else {
        this.rendition.themes.font(font);
        this.setDefaultFontFamily(font);
      }
    },
    initTheme() {
      let defaultTheme = getTheme(this.fileName);
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name;
        saveTheme(this.fileName, defaultTheme);
      }
      //
      this.setDefaultTheme(defaultTheme);
      this.themeList.forEach((theme) => {
        this.rendition.themes.register(theme.name, theme.style);
      });
      this.rendition.themes.select(defaultTheme);
    },

    prevPage() {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation();
        });
        this.hideTitleAndMenu();
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation();
        });
        this.hideTitleAndMenu();
      }
    },
    toggleTitleAndMenu() {
      if (this.menuVisible) {
        this.setSettingVisible(-1);
        this.setFontFamilyVisible(false);
      }
      // this.$store.dispatch('setMenuVisible', !this.menuVisible)
      this.setMenuVisible(!this.menuVisible);
    },
    initRendition() {
      // 展示
      this.rendition = this.book.renderTo("read", {
        width: innerWidth,
        height: innerHeight,
        // 微信兼容
        method: "default",
      });
      const location = getLocation(this.fileName);
        // 初始化到浏览器中
        this.display(location, () => {
          this.initFontSize();
          this.initFontFamily();
          this.initTheme();
          this.initGlobalStyle();
        });
    

      this.rendition.hooks.content.register((contents) => {
        contents.addStylesheet("http://localhost:8080/api/fonts/daysOne.css");
        contents.addStylesheet("http://localhost:8080/api/fonts/cabin.css");
        contents.addStylesheet(
          "http://localhost:8080/api/fonts/montserrat.css"
        );
        contents.addStylesheet("http://localhost:8080/api/fonts/tangerine.css");
      });
    },
    initGesture() {
      // 绑定手势
      this.rendition.on("touchstart", (event) => {
        // 保存手指在屏幕的位置
        this.touchStartX = event.changedTouches[0].clientX;
        // 手指在屏幕的时间
        this.touchStartTime = event.timeStamp;
      });
      this.rendition.on("touchend", (event) => {
        // 计算手指移动的距离
        const offsetX = event.changedTouches[0].clientX - this.touchStartX;
        // 手指在屏幕停留的时间
        const time = event.timeStamp - this.touchStartTime;
        // console.log('offsetX =' + offsetX , 'tiem =' + time);

        /**
         * 下一页(从左往右滑动)offsetX是负数
         * 上一页(从右往左滑动)offsetX是正数
         * time这里规定是小于500毫秒
         *
         * 上一页：time<500&&offsetX>40  翻页this.prevPage()
         * 下一页：time<500&&offsetX<40  翻页this.nextPage()
         * 显示标题栏this.toggleTitleAndMenu()
         */
        if (time < 500 && offsetX > 40) {
          console.log("offsetX =" + offsetX, "tiem =" + time);
          this.prevPage();
        } else if (time < 500 && offsetX < 40 && offsetX !== 0) {
          console.log("offsetX =" + offsetX, "tiem =" + time);

          this.nextPage();
        } else {
          this.toggleTitleAndMenu();
        }
        // 禁止事件传播
        if (event.cancelable) {
          event.preventDefault();
        }
        event.stopPropagation();
      });
    },

    initEpub() {

      const url = "http://localhost:8080/api/epub/" + this.fileName + ".epub";

      // 实例化Epub
      this.book = new Epub(url);
      // 将book传入到currentBook
      this.setCurrentBook(this.book);
      // 渲染
      this.initRendition();
      this.initGesture();
      this.book.ready
        .then(() => {
          return this.book.locations.generate(
            750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)
          );

        })
        .then((location) => {
          this.setBookAvailable(true);
          this.refreshLocation()
        });
    },
  },
  mounted() {
    // /epub/EarthSciences%7C2015_Book_PerspectivesOnEuropeanEarthqua.epub
    // 电子书的路径,格式：ebook/EarthSciences|2015_Book_PerspectivesOnEuropeanEarthqua.epub
    // this.$store
    //   .dispatch("setFileName", this.$route.params.fileName.split("|").join("/"))
    //   .then(() => {
    //     this.initEpub();
    //   });
    this.setFileName(this.$route.params.fileName.split("|").join("/")).then(
      () => {
        this.initEpub();
      }
    );
  },
};
</script>

<style>
</style>