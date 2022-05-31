import Storage from 'web-storage-cache'

const localStorage = new Storage() 

// 写入值
export function setLocalStorage(key,value) {
  return localStorage.set(key, value)
}

// 查看值
export function getLocalStorage(key) {
  return localStorage.get(key)
}

// 移除值
export function removeLocalStorage(key) {
  return localStorage.delete(key)
}

// 清空所有缓存
export function clearLocalStorage() {
  return localStorage.clear()
}

/**
 * 
 * @param {*} fileName 电子书名称
 * @param {*} key 
 * @param {*} value
 * 每一本电子书的设置可能都不一样，所以为每一本电子书都设置 
 * 因此fileName为key
 * value又为一个key value对象
 * 例如xxx : {fontSize : 16},{fontFamily : yyy}
 */
export function setBookObject(fileName,key,value) {
   let book = getLocalStorage(`${fileName}-info`)
   if(!book) {
     book = {}
   }
   book[key] = value
   setLocalStorage(`${fileName}-info`,book)
}

export function getBookObject(fileName , key) {
  let book = getLocalStorage(`${fileName}-info`)
   if(book) {
     return book[key]
   } else {
     return null
   }
}


export function getLocale() {
  return getLocalStorage('locale')
}

export function saveLocale(locale) {
  return setLocalStorage('locale', locale)
}

export function getLocation(fileName) {
  return getBookObject(fileName, 'location')
}

export function saveLocation(fileName, location) {
  setBookObject(fileName, 'location', location)
}

export function getBookmark(fileName) {
  return getBookObject(fileName, 'bookmark')
}

export function saveBookmark(fileName, bookmark) {
  setBookObject(fileName, 'bookmark', bookmark)
}

export function getReadTime(fileName) {
  return getBookObject(fileName, 'time')
}

export function saveReadTime(fileName, theme) {
  setBookObject(fileName, 'time', theme)
}

export function getProgress(fileName) {
  return getBookObject(fileName, 'progress')
}

export function saveProgress(fileName, progress) {
  setBookObject(fileName, 'progress', progress)
}

export function getNavigation(fileName) {
  return getBookObject(fileName, 'navigation')
}

export function saveNavigation(fileName, navigation) {
  setBookObject(fileName, 'navigation', navigation)
}

export function getMetadata(fileName) {
  return getBookObject(fileName, 'metadata')
}

export function saveMetadata(fileName, metadata) {
  setBookObject(fileName, 'metadata', metadata)
}

export function getCover(fileName) {
  return getBookObject(fileName, 'cover')
}

export function saveCover(fileName, cover) {
  setBookObject(fileName, 'cover', cover)
}

export function getFontFamily(fileName) {
  return getBookObject(fileName, 'fontFamily')
}

export function saveFontFamily(fileName, fontFamily) {
  setBookObject(fileName, 'fontFamily', fontFamily)
}

export function getTheme(fileName) {
  return getBookObject(fileName, 'theme')
}

export function saveTheme(fileName, theme) {
  setBookObject(fileName, 'theme', theme)
}

export function getFontSize(fileName) {
  return getBookObject(fileName, 'fontSize')
}

export function saveFontSize(fileName, fontSize) {
  setBookObject(fileName, 'fontSize', fontSize)
}
