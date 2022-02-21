/*  Steps to start to deploy
    1. Render songs
    2. Scroll top
    3. Play / Pause / Seek
    4. CD rotate
    5. Next / Prev
    6. Random
    7. Next/Repeat when ended
    8. Active song
    9. Scroll active song into view
    10. Play song when click
*/
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const favicon = $('#favicon')
const player = $('.player')
const playlist = $('.playlist');
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const togglePlay = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 1,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs : [
        {
            name: 'Chúng ta của hiện tại',
            singer: 'Sơn Tùng MTP',
            path: './songs/ChungTaCuaHienTaiSonTungMTP.mp3',
            img: './img/chungtacuahientai.jpg'
        },
        {
            name: 'Gieo quẻ',
            singer: 'Hoàng Thùy Linh - Đen',
            path: './songs/GieoQueHoangThuyLinh.mp3',
            img: './img/gieoque.jpg'
        },
        {
            name: 'Cơn mưa cuối',
            singer: 'Justa Tee ft Binz',
            path: './songs/ConMuaCuoiBinzJustaTee.mp3',
            img: './img/conmuacuoi.jpg'
        },
        {
            name: 'Beautiful Girls',
            singer: 'Sean Kingston',
            path: './songs/BeautifulGirlsSeanKingston.mp3',
            img: './img/beautifulgirls.jpg'
        },
        {
            name: 'Sứ Thanh Hoa',
            singer: 'Jay Chou',
            path: './songs/SuThanhHoaChauKietLuanJayChou.mp3',
            img: './img/suthanhhoa.jpg'
        },
        {
            name: 'Khói thuốc đợi chờ',
            singer: 'Jimmy Nguyen',
            path: './songs/KhoiThuocDoiChoJimmyNguyen.mp3',
            img: './img/khoithuocdoicho.jpg'
        },
        {
            name: 'Hair like snow',
            singer: 'Jay Chou',
            path: './songs/TocnhutuyetChauKietLuan.mp3',
            img: './img/hairlikesnow.jpg'
        },
        {
            name: 'Tự em đa tình',
            singer: 'Quinn',
            path: './songs/TuEmDaTinh.mp3',
            img: './img/tuemdatinh.png'
        },
    ],
    
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}">
                <div class="thumb"
                    style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        //Scroll to zoom in /zoom out
        document.onscroll = function () {
            const scroll = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdWidth - scroll
            cd.style.width = newWidth > 40 ? newWidth + 'px' : 0
            cd.style.opacity = newWidth / cdWidth
        }

        //cd-thumb rotate
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 20000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //play/pause
        togglePlay.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        //when play song
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = audio.currentTime / audio.duration * 100
                progress.value = progressPercent
            }
        }
        //seeking
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        //prev button
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //next button
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //random songs
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        //repeat songs
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        //when end song
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView( {
                behavior: 'smooth',
                block : 'center'
            })
        }, 300)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
        favicon.attributes.href = this.currentSong.img
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0 ) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        this.defineProperties() //define properties for object
        this.handleEvents() //Listeningand handle DOM events
        this.loadCurrentSong()
        this.render()
    },
}

app.start()








