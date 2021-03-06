import { mapGetters , mapActions } from "vuex"
import {themeList,addCss, removeAllCss , getReadTimeByMinute} from './book'
import { saveLocation } from './localStorage';


export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark'
    ]),
    themeList() {
      return themeList(this)
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark'
    ]),
    initGlobalStyle() {
      removeAllCss()
      switch(this.defaultTheme) {
        case 'Default':
          addCss("http://localhost:8080/api/theme/theme_default.css")
          break
        case 'Eye':
          addCss("http://localhost:8080/api/theme/theme_eye.css")
          break
        case 'Gold':
          addCss("http://localhost:8080/api/theme/theme_gold.css")
          break
        case 'Night':
          addCss("http://localhost:8080/api/theme/theme_night.css")
          break
        default : 
         addCss("http://localhost:8080/api/theme/theme_default.css")
      } 
    },
    refreshLocation() {
      const currentLocation = this.currentBook.rendition.currentLocation()
      // console.log(currentLocation.start.cfi !== null);
      if(currentLocation.start !== undefined) {
        let startCfi = currentLocation.start.cfi
        const progress = this.currentBook.locations.percentageFromCfi(startCfi)
        this.setProgress(Math.floor(progress * 100))
        this.setSection(currentLocation.start.index)
        saveLocation(this.fileName , startCfi)
      }
    },
    display(target , cb) {
      if(target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation() 
          if(cb) cb()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if(cb) cb()
        })
      }
      // this.hideTitleAndMenu()
    },
    hideTitleAndMenu() {
      //  this.$store.dispatch('setMenuVisible', false)
      this.setMenuVisible(false);
      this.setSettingVisible(-1);
      this.setFontFamilyVisible(false);
    },
    getReadTimeText() {
      return this.$t('book.haveRead').replace('$1',getReadTimeByMinute(this.fileName))
    },
  },
}