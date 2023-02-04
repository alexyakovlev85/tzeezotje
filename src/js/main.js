/**
 * @class ItcSlider
 * @version 1.0.0
 * @author https://github.com/itchief
 * @copyright Alexander Maltsev 2020 - 2022
 * @license MIT (https://github.com/itchief/ui-components/blob/master/LICENSE)
 * @tutorial https://itchief.ru/javascript/slider
 */ class ItcSlider {
  static #a = 'wrapper';
  static #b = 'items';
  static #c = 'item';
  static #d = 'item_active';
  static #e = 'indicator';
  static #f = 'indicator_active';
  static #g = 'btn_prev';
  static #h = 'btn_next';
  static #i = 'btn_hide';
  static #j = 'transition-none';
  static #k = [];
  #l;
  #m;
  constructor(t, e = {}, s = 'itc-slider__') {
    (this.#m = {
      prefix: s,
      el: t,
      elWrapper: t.querySelector(`.${s}${this.constructor.#a}`),
      elItems: t.querySelector(`.${s}${this.constructor.#b}`),
      elListItem: t.querySelectorAll(`.${s}${this.constructor.#c}`),
      btnPrev: t.querySelector(`.${s}${this.constructor.#g}`),
      btnNext: t.querySelector(`.${s}${this.constructor.#h}`),
      btnClassHide: s + this.constructor.#i,
      exOrderMin: 0,
      exOrderMax: 0,
      exItemMin: null,
      exItemMax: null,
      exTranslateMin: 0,
      exTranslateMax: 0,
      direction: 'next',
      intervalId: null,
      isSwiping: !1,
      swipeX: 0,
    }),
      (this.#l = {
        loop: !0,
        autoplay: !1,
        interval: 5e3,
        refresh: !0,
        swipe: !0,
        ...e,
      }),
      this.#n(),
      this.#o();
  }
  static getInstance(t) {
    let e = this.#k.find((e) => e.target === t);
    return e ? e.instance : null;
  }
  static getOrCreateInstance(t, e = {}, s = 'itc-slider__') {
    try {
      let i = 'string' == typeof t ? document.querySelector(t) : t,
        a = this.getInstance(i);
      if (a) return a;
      let n = new this(i, e, s);
      return this.#k.push({ target: i, instance: n }), n;
    } catch (h) {
      console.error(h);
    }
  }
  static createInstances() {
    document.querySelectorAll('[data-slider="itc-slider"]').forEach((t) => {
      let e = t.dataset,
        s = {};
      Object.keys(e).forEach((t) => {
        if ('slider' === t) return;
        let i = e[t];
        (i = Number.isNaN(
          Number((i = 'false' !== (i = 'true' === i || i) && i))
        )
          ? Number(i)
          : i),
          (s[t] = i);
      }),
        this.getOrCreateInstance(t, s);
    });
  }
  next() {
    (this.#m.direction = 'next'), this.#p();
  }
  prev() {
    (this.#m.direction = 'prev'), this.#p();
  }
  moveTo(t) {
    this.#q(t);
  }
  reset() {
    this.#r();
  }
  dispose() {
    this.#s();
    let t = this.#m.prefix + this.constructor.#j,
      e = this.#m.prefix + this.constructor.#d;
    this.#t('stop'),
      this.#m.elItems.classList.add(t),
      (this.#m.elItems.style.transform = ''),
      this.#m.elListItem.forEach((t) => {
        (t.style.transform = ''), t.classList.remove(e);
      });
    let s = `${this.#m.prefix}${this.constructor.#f}`;
    document.querySelectorAll(`.${s}`).forEach((t) => {
      t.classList.remove(s);
    }),
      this.#m.elItems.offsetHeight,
      this.#m.elItems.classList.remove(t);
    let i = this.constructor.#k.findIndex((t) => t.target === this.#m.el);
    this.constructor.#k.splice(i, 1);
  }
  #u(t) {
    let e = this.#m.prefix + this.constructor.#g,
      s = this.#m.prefix + this.constructor.#h;
    if (
      (this.#t('stop'), t.target.closest(`.${e}`) || t.target.closest(`.${s}`))
    )
      (this.#m.direction = t.target.closest(`.${e}`) ? 'prev' : 'next'),
        this.#p();
    else if (t.target.dataset.slideTo) {
      let i = parseInt(t.target.dataset.slideTo, 10);
      this.#q(i);
    }
    this.#l.loop && this.#t();
  }
  #v() {
    this.#t('stop');
  }
  #w() {
    this.#t();
  }
  #x() {
    window.requestAnimationFrame(this.#r.bind(this));
  }
  #y(a) {
    this.#t('stop');
    let n = 0 === a.type.search('touch') ? a.touches[0] : a;
    (this.#m.swipeX = n.clientX), (this.#m.isSwiping = !0);
  }
  #z(h) {
    if (!this.#m.isSwiping) return;
    let r = 0 === h.type.search('touch') ? h.changedTouches[0] : h,
      l = this.#m.swipeX - r.clientX;
    l > 50
      ? ((this.#m.direction = 'next'), this.#p())
      : l < -50 && ((this.#m.direction = 'prev'), this.#p()),
      (this.#m.isSwiping = !1),
      this.#l.loop && this.#t();
  }
  #A() {
    !this.#m.isBalancing &&
      ((this.#m.isBalancing = !0),
      window.requestAnimationFrame(this.#B.bind(this)));
  }
  #C() {
    this.#m.isBalancing = !1;
  }
  #D(o) {
    o.preventDefault();
  }
  #E() {
    'hidden' === document.visibilityState
      ? this.#t('stop')
      : 'visible' === document.visibilityState && this.#l.loop && this.#t();
  }
  #o() {
    (this.#m.events = {
      click: [this.#m.el, this.#u.bind(this), !0],
      mouseenter: [this.#m.el, this.#v.bind(this), !0],
      mouseleave: [this.#m.el, this.#w.bind(this), !0],
      resize: [window, this.#x.bind(this), this.#l.refresh],
      'itc-slider__transition-start': [
        this.#m.elItems,
        this.#A.bind(this),
        this.#l.loop,
      ],
      transitionend: [this.#m.elItems, this.#C.bind(this), this.#l.loop],
      touchstart: [this.#m.el, this.#y.bind(this), this.#l.swipe],
      mousedown: [this.#m.el, this.#y.bind(this), this.#l.swipe],
      touchend: [document, this.#z.bind(this), this.#l.swipe],
      mouseup: [document, this.#z.bind(this), this.#l.swipe],
      dragstart: [this.#m.el, this.#D.bind(this), !0],
      visibilitychange: [document, this.#E.bind(this), !0],
    }),
      Object.keys(this.#m.events).forEach((t) => {
        if (this.#m.events[t][2]) {
          let e = this.#m.events[t][0],
            s = this.#m.events[t][1];
          e.addEventListener(t, s);
        }
      });
  }
  #s() {
    Object.keys(this.#m.events).forEach((t) => {
      if (this.#m.events[t][2]) {
        let e = this.#m.events[t][0],
          s = this.#m.events[t][1];
        e.removeEventListener(t, s);
      }
    });
  }
  #t(c) {
    if (this.#l.autoplay) {
      if ('stop' === c) {
        clearInterval(this.#m.intervalId), (this.#m.intervalId = null);
        return;
      }
      null === this.#m.intervalId &&
        (this.#m.intervalId = setInterval(() => {
          (this.#m.direction = 'next'), this.#p();
        }, this.#l.interval));
    }
  }
  #B() {
    if (!this.#m.isBalancing) return;
    let d = this.#m.elWrapper.getBoundingClientRect(),
      p = d.width / this.#m.countActiveItems / 2,
      u = this.#m.elListItem.length;
    if ('next' === this.#m.direction) {
      let m = this.#m.exItemMin.getBoundingClientRect().right;
      if (m < d.left - p) {
        let I = this.#m.els.find((t) => t.el === this.#m.exItemMin);
        I.order = this.#m.exOrderMin + u;
        let x = this.#m.exTranslateMin + u * this.#m.width;
        (I.translate = x),
          (this.#m.exItemMin.style.transform = `translate3D(${x}px, 0px, 0.1px)`),
          this.#F();
      }
    } else {
      let v = this.#m.exItemMax.getBoundingClientRect().left;
      if (v > d.right + p) {
        let f = this.#m.els.find((t) => t.el === this.#m.exItemMax);
        f.order = this.#m.exOrderMax - u;
        let g = this.#m.exTranslateMax - u * this.#m.width;
        (f.translate = g),
          (this.#m.exItemMax.style.transform = `translate3D(${g}px, 0px, 0.1px)`),
          this.#F();
      }
    }
    window.requestAnimationFrame(this.#B.bind(this));
  }
  #G() {
    let $ = this.#m.prefix + this.constructor.#d;
    this.#m.activeItems.forEach((t, e) => {
      t
        ? this.#m.elListItem[e].classList.add($)
        : this.#m.elListItem[e].classList.remove($);
      let s = this.#m.el.querySelectorAll(
        `.${this.#m.prefix}${this.constructor.#e}`
      );
      s.length && t
        ? s[e].classList.add(`${this.#m.prefix}${this.constructor.#f}`)
        : s.length &&
          !t &&
          s[e].classList.remove(`${this.#m.prefix}${this.constructor.#f}`);
    });
  }
  #p() {
    let b = 'next' === this.#m.direction ? -this.#m.width : this.#m.width,
      E = this.#m.translate + b;
    if (!this.#l.loop) {
      let y =
        this.#m.width * (this.#m.elListItem.length - this.#m.countActiveItems);
      if (E < -y || E > 0) return;
      this.#m.btnPrev &&
        (this.#m.btnPrev.classList.remove(this.#m.btnClassHide),
        this.#m.btnNext.classList.remove(this.#m.btnClassHide)),
        this.#m.btnPrev && E === -y
          ? this.#m.btnNext.classList.add(this.#m.btnClassHide)
          : this.#m.btnPrev &&
            0 === E &&
            this.#m.btnPrev.classList.add(this.#m.btnClassHide);
    }
    'next' === this.#m.direction
      ? (this.#m.activeItems = [
          ...this.#m.activeItems.slice(-1),
          ...this.#m.activeItems.slice(0, -1),
        ])
      : (this.#m.activeItems = [
          ...this.#m.activeItems.slice(1),
          ...this.#m.activeItems.slice(0, 1),
        ]),
      this.#G(),
      (this.#m.translate = E),
      (this.#m.elItems.style.transform = `translate3D(${E}px, 0px, 0.1px)`),
      this.#m.elItems.dispatchEvent(
        new CustomEvent('itc-slider__transition-start', { bubbles: !0 })
      );
  }
  #q(L) {
    let T = this.#m.activeItems.reduce((t, e, s) => {
      let i = e ? L - s : t;
      return Math.abs(i) < Math.abs(t) ? i : t;
    }, this.#m.activeItems.length);
    if (0 !== T) {
      this.#m.direction = T > 0 ? 'next' : 'prev';
      for (let w = 0; w < Math.abs(T); w++) this.#p();
    }
  }
  #n() {
    (this.#m.els = []),
      (this.#m.translate = 0),
      (this.#m.activeItems = []),
      (this.#m.isBalancing = !1),
      (this.#m.width = this.#m.elListItem[0].getBoundingClientRect().width);
    let M = this.#m.elWrapper.getBoundingClientRect().width;
    if (
      ((this.#m.countActiveItems = Math.round(M / this.#m.width)),
      this.#m.elListItem.forEach((t, e) => {
        (t.style.transform = ''),
          this.#m.activeItems.push(e < this.#m.countActiveItems ? 1 : 0),
          this.#m.els.push({ el: t, index: e, order: e, translate: 0 });
      }),
      this.#l.loop)
    ) {
      let C = this.#m.elListItem.length - 1,
        S = -(C + 1) * this.#m.width;
      (this.#m.elListItem[
        C
      ].style.transform = `translate3D(${S}px, 0px, 0.1px)`),
        (this.#m.els[C].order = -1),
        (this.#m.els[C].translate = S),
        this.#F();
    } else
      this.#m.btnPrev && this.#m.btnPrev.classList.add(this.#m.btnClassHide);
    this.#G(), this.#t();
  }
  #r() {
    let A = this.#m.prefix + this.constructor.#j,
      N = this.#m.elListItem[0].getBoundingClientRect().width,
      _ = this.#m.elWrapper.getBoundingClientRect().width;
    (N !== this.#m.width || Math.round(_ / N) !== this.#m.countActiveItems) &&
      (this.#t('stop'),
      this.#m.elItems.classList.add(A),
      (this.#m.elItems.style.transform = 'translate3D(0px, 0px, 0.1px)'),
      this.#n(),
      window.requestAnimationFrame(() => {
        this.#m.elItems.classList.remove(A);
      }));
  }
  #F() {
    let O = this.#m.els.map((t) => t.el),
      R = this.#m.els.map((t) => t.order);
    (this.#m.exOrderMin = Math.min(...R)),
      (this.#m.exOrderMax = Math.max(...R));
    let B = R.indexOf(this.#m.exOrderMin),
      P = R.indexOf(this.#m.exOrderMax);
    (this.#m.exItemMin = O[B]),
      (this.#m.exItemMax = O[P]),
      (this.#m.exTranslateMin = this.#m.els[B].translate),
      (this.#m.exTranslateMax = this.#m.els[P].translate);
  }
}
ItcSlider.createInstances();

const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
const navClose = document.querySelector('.nav__close');
const navLinks = document.querySelectorAll('.nav__link');
const phone = document.querySelector('.header__phone--mobile');

const openNav = () => nav.classList.add('nav--active');
const closeNav = () => nav.classList.remove('nav--active');

burger.addEventListener('click', openNav);
navClose.addEventListener('click', closeNav);
phone.addEventListener('click', closeNav);
navLinks.forEach((link) => {
  link.addEventListener('click', closeNav);
});

const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal__content');
const modalClose = document.querySelector('.modal__close');
const modalButton = document.querySelector('.promo__button');

const openModal = () => {
  modal.classList.add('modal--active');
  modalContent.classList.add('modal__content--active');
};
const closeModal = () => {
  modal.classList.remove('modal--active');
  modalContent.classList.remove('modal__content--active');
};

modalButton.addEventListener('click', openModal);
modal.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);

const form = document.querySelector('.form');
form.addEventListener('submit', formSend);

async function formSend(e) {
  e.preventDefault();

  let formData = new FormData(form);
  let response = await fetch('sendmail.php', {
    method: 'POST',
    body: formData,
  });
  if (response.ok) {
    let result = await response.json();
    form.reset();
    closeModal();
  }
}