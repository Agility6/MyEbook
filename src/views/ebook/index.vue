<template>
  <div class="ebook">
    <ebook-title />
    <ebook-reader />
    <ebook-menu />
  </div>
</template>

<script>
import EbookReader from "../../components/ebook/EbookReader";
import EbookTitle from "../../components/ebook/EbookTitle";
import EbookMenu from "../../components/ebook/EbookMenu";
import {ebookMixin} from '../../utils/mixin'
import {getReadTime , saveReadTime } from '../../utils/localStorage'
export default {
  name: "Ebook",
  mixins : [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu
  },
  methods: {
    startLoopReadTime() {
      let readTime = getReadTime(this.fileName)
      if(!readTime) {
        readTime = 0
      }
      this.task = setInterval(() => {
        readTime++
        if(readTime % 30 === 0) {
          saveReadTime(this.fileName,readTime)
        } 
      }, 1000);
    }
  },
  mounted() {
    this.startLoopReadTime()
  },
  beforeDestroy() {
    if(this.startLoopReadTime) {
      clearInterval(this.task)
    }
  },
};
</script>

<style>
</style>