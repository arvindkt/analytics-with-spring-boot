/*!
* Bootstrap v3.1.1 (http://getbootstrap.com)
* Copyright 2011-2014 Twitter, Inc.
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
*/

if (typeof jQuery === 'undefined') { throw new Error('Bootstrap\'s JavaScript requires jQuery') }

/* ========================================================================
* Bootstrap: transition.js v3.1.1
* http://getbootstrap.com/javascript/#transitions
* ========================================================================
* Copyright 2011-2014 Twitter, Inc.
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
* ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(jQuery);

/* ========================================================================
* Bootstrap: alert.js v3.1.1
* http://getbootstrap.com/javascript/#alerts
* ========================================================================
* Copyright 2011-2014 Twitter, Inc.
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
* ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
* Bootstrap: button.js v3.1.1
* http://getbootstrap.com/javascript/#buttons
* ========================================================================
* Copyright 2011-2014 Twitter, Inc.
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
* ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
   var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(jQuery);

/* ========================================================================
* Bootstrap: carousel.js v3.1.1
* http://getbootstrap.com/javascript/#carousel
* ========================================================================
* Copyright 2011-2014 Twitter, Inc.
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
* ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children('.item')

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid". not a typo. past tense of "to slide".
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
   var fallback  = type == 'next' ? 'first' : 'last'
   var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return this.sliding = false

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })
    this.$element.trigger(e)
    if (e.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid.bs.carousel', function () { // yes, "slid". not a typo. past tense of "to slide".
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid.bs.carousel') }, 0) // yes, "slid". not a typo. past tense of "to slide".
        })
        .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid.bs.carousel') // yes, "slid". not a typo. past tense of "to slide".
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
   var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
* Bootstrap: collapse.js v3.1.1
* http://getbootstrap.com/javascript/#collapse
* ========================================================================
* Copyright 2011-2014 Twitter, Inc.
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
* ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)

    this.transitioning = 1

    var complete = function (e) {
      if (e && e.target != this.$element[0]) {
        this.$element
          .one($.support.transition.end, $.proxy(complete, this))
        return
      }
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function (e) {
      if (e && e.target != this.$element[0]) {
        this.$element
          .one($.support.transition.end, $.proxy(complete, this))
        return
      }
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') option = !option
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle="collapse"][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(jQuery);

/* ========================================================================
* Bootstrap: dropdown.js v3.1.1
* http://getbootstrap.com/javascript/#dropdowns
* ========================================================================
* Copyright 2011-2014 Twitter, Inc.
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
* ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.trigger('focus')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $parent = getParent($(this))
      var relatedTarget = { relatedTarget: this }
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role="menu"], [role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
* Bootstrap: modal.js v3.1.1
* http://getbootstrap.com/javascript/#modals
* ========================================================================
* Copyright 2011-2014 Twitter, Inc.
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
* ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options        = options
    this.$body          = $(document.body)
    this.$element       = $(element)
    this.$backdrop      =
    this.isShown        = null
    this.scrollbarWidth = 0

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.DEFAULTS = {
    backdrop: "static",
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.$body.addClass('modal-open')

    this.setScrollbar()
    this.escape()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.$body.removeClass('modal-open')

    this.resetScrollbar()
    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

     doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function() {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one($.support.transition.end, callbackRemove)
          .emulateTransitionEnd(150) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  Modal.prototype.checkScrollbar = function () {
    if (document.body.clientWidth >= window.innerWidth) return
    this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar()
  }

  Modal.prototype.setScrollbar =  function () {
    var bodyPad = parseInt(this.$body.css('padding-right') || 0)
    if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '')
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
  })

}(jQuery);

/* ========================================================================
* Bootstrap: tooltip.js v3.1.1
* http://getbootstrap.com/javascript/#tooltip
* Inspired by the original jQuery.tipsy by Jason Frame
* ========================================================================
* Copyright 2011-2014 Twitter, Inc.
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
* ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return
      var that = this;

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $parent      = this.$element.parent()
        var parentDim    = this.getPosition($parent)

        placement = placement == 'bottom' && pos.top   + pos.height       + actualHeight - parentDim.scroll > parentDim.height ? 'top'    :
                    placement == 'top'    && pos.top   - parentDim.scroll - actualHeight < 0                                   ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth      > parentDim.width                                    ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth      < parentDim.left                                     ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.hoverState = null

      var complete = function() {
        that.$element.trigger('shown.bs.' + that.type)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one($.support.transition.end, complete)
          .emulateTransitionEnd(150) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var arrowDelta          = delta.left ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowPosition       = delta.left ? 'left'        : 'top'
    var arrowOffsetPosition = delta.left ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], arrowPosition)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element.trigger('hidden.bs.' + that.type)
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element
    var el     = $element[0]
    var isBody = el.tagName == 'BODY'
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : null, {
      scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop(),
      width:  isBody ? $(window).width()  : $element.outerWidth(),
      height: isBody ? $(window).height() : $element.outerHeight()
    }, isBody ? {top: 0, left: 0} : $element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    clearTimeout(this.timeout)
   this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
* Bootstrap: popover.js v3.1.1
* http://getbootstrap.com/javascript/#popovers
* ========================================================================
* Copyright 2011-2014 Twitter, Inc.
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
* ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover"><div class="arrow"></div><div class="close" data-popover-dismiss="true">&times;</div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').empty()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
* Bootstrap: scrollspy.js v3.1.1
* http://getbootstrap.com/javascript/#scrollspy
* ========================================================================
* Copyright 2011-2014 Twitter, Inc.
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
* ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scrollspy', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    if (activeTarget && scrollTop <= offsets[0]) {
      return activeTarget != (i = targets[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')

    var selector = this.selector +
       '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(jQuery);

/* ========================================================================
* Bootstrap: tab.js v3.1.1
* http://getbootstrap.com/javascript/#tabs
* ========================================================================
* Copyright 2011-2014 Twitter, Inc.
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
* ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(jQuery);

/* ========================================================================
* Bootstrap: affix.js v3.1.1
* http://getbootstrap.com/javascript/#affix
* ========================================================================
* Copyright 2011-2014 Twitter, Inc.
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
* ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      =
    this.unpin        =
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$window.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin != null) this.$element.css('top', '')

    var affixType = 'affix' + (affix ? '-' + affix : '')
    var e         = $.Event(affixType + '.bs.affix')

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

    this.$element
      .removeClass(Affix.RESET)
      .addClass(affixType)
      .trigger($.Event(affixType.replace('affix', 'affixed')))

    if (affix == 'bottom') {
      this.$element.offset({ top: position.top })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(jQuery);

/* =========================================================
* bootstrap-datepicker.js
* http://www.eyecon.ro/bootstrap-datepicker
* =========================================================
* Copyright 2012 Stefan Petre
* Improvements by Andrew Rowls
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* ========================================================= */

(function( $ ) {

      function UTCDate(){
            return new Date(Date.UTC.apply(Date, arguments));
      }
      function UTCToday(){
            var today = new Date();
            return UTCDate(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
      }

      // Picker object

      var Datepicker = function(element, options) {
            var that = this;

            this._process_options(options);

            this.element = $(element);
            this.isInline = false;
            this.isInput = this.element.is('input');
            this.component = this.element.is('.date') ? this.element.find('.add-on, .btn') : false;
            this.hasInput = this.component && this.element.find('input').length;
            
            if(this.component && this.component.length === 0)
                  this.component = false;

            this.picker = $(DPGlobal.template);
            this._buildEvents();
            this._attachEvents();
            
            if(this.isInline) {
                  this.picker.addClass('datepicker-inline').appendTo(this.element);
            } else {
                  this.picker.addClass('datepicker-dropdown dropdown-menu');
            }

            if (this.o.rtl){
                  this.picker.addClass('datepicker-rtl');
                  this.picker.find('.prev i, .next i')
                                    .toggleClass('fa-chevron-left fa-chevron-right');
            }

            this.viewMode = this.o.startView;

            if (this.o.calendarWeeks)
                  this.picker.find('tfoot th.today')
                                    .attr('colspan', function(i, val){
                                          return parseInt(val) + 1;
                                    });

            this._allow_update = false;

            this.setStartDate(this.o.startDate);
            this.setEndDate(this.o.endDate);
            this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled);

            this.fillDow();
            this.fillMonths();

            this._allow_update = true;

            this.update();
            this.showMode();

            if(this.isInline) {
                  this.show();
            }
      };

      Datepicker.prototype = {
            constructor: Datepicker,

            _process_options: function(opts){
                  // Store raw options for reference
                  this._o = $.extend({}, this._o, opts);
                  // Processed options
                  var o = this.o = $.extend({}, this._o);

                  // Check if "de-DE" style date is available, if not language should
                  // fallback to 2 letter code eg "de"
                  var lang = o.language;
                  if (!dates[lang]) {
                        lang = lang.split('-')[0];
                        if (!dates[lang])
                              lang = $.fn.datepicker.defaults.language;
                  }
                  o.language = lang;

                  switch(o.startView){
                        case 2:
                        case 'decade':
                              o.startView = 2;
                              break;
                        case 1:
                        case 'year':
                              o.startView = 1;
                              break;
                        default:
                              o.startView = 0;
                  }

                  switch (o.minViewMode) {
                        case 1:
                        case 'months':
                              o.minViewMode = 1;
                              break;
                        case 2:
                        case 'years':
                              o.minViewMode = 2;
                              break;
                        default:
                              o.minViewMode = 0;
                  }

                  o.startView = Math.max(o.startView, o.minViewMode);

                  o.weekStart %= 7;
                  o.weekEnd = ((o.weekStart + 6) % 7);

                  var format = DPGlobal.parseFormat(o.format);
                  if (o.startDate !== -Infinity) {
                        o.startDate = DPGlobal.parseDate(o.startDate, format, o.language);
                  }
                  if (o.endDate !== Infinity) {
                        o.endDate = DPGlobal.parseDate(o.endDate, format, o.language);
                  }

                  o.daysOfWeekDisabled = o.daysOfWeekDisabled||[];
                  if (!$.isArray(o.daysOfWeekDisabled))
                        o.daysOfWeekDisabled = o.daysOfWeekDisabled.split(/[,\s]*/);
                  o.daysOfWeekDisabled = $.map(o.daysOfWeekDisabled, function (d) {
                        return parseInt(d, 10);
                  });
            },
            _events: [],
            _secondaryEvents: [],
            _applyEvents: function(evs){
                  for (var i=0, el, ev; i<evs.length; i++){
                        el = evs[i][0];
                        ev = evs[i][1];
                        el.on(ev);
                  }
            },
            _unapplyEvents: function(evs){
                  for (var i=0, el, ev; i<evs.length; i++){
                        el = evs[i][0];
                        ev = evs[i][1];
                        el.off(ev);
                  }
            },
            _buildEvents: function(){
                  if (this.isInput) { // single input
                        this._events = [
                              [this.element, {
                                    focus: $.proxy(this.show, this),
                                    keyup: $.proxy(this.update, this),
                                    keydown: $.proxy(this.keydown, this)
                              }]
                        ];
                  }
                  else if (this.component && this.hasInput){ // component: input + button
                        this._events = [
                              // For components that are not readonly, allow keyboard nav
                              [this.element.find('input'), {
                                    focus: $.proxy(this.show, this),
                                    keyup: $.proxy(this.update, this),
                                    keydown: $.proxy(this.keydown, this)
                              }],
                              [this.component, {
                                    click: $.proxy(this.show, this)
                              }]
                        ];
                  }
                  else if (this.element.is('div')) {  // inline datepicker
                        this.isInline = true;
                  }
                  else {
                        this._events = [
                              [this.element, {
                                    click: $.proxy(this.show, this)
                              }]
                        ];
                  }

                  this._secondaryEvents = [
                        [this.picker, {
                              click: $.proxy(this.click, this)
                        }],
                        [$(window), {
                              resize: $.proxy(this.place, this)
                        }],
                        [$(document), {
                              mousedown: $.proxy(function (e) {
                                    // Clicked outside the datepicker, hide it
                                    if (!(
                                          this.element.is(e.target) ||
                                          this.element.find(e.target).size() ||
                                          this.picker.is(e.target) ||
                                          this.picker.find(e.target).size()
                                    )) {
                                          this.hide();
                                    }
                              }, this)
                        }]
                  ];
            },
            _attachEvents: function(){
                  this._detachEvents();
                  this._applyEvents(this._events);
            },
            _detachEvents: function(){
                  this._unapplyEvents(this._events);
            },
            _attachSecondaryEvents: function(){
                  this._detachSecondaryEvents();
                  this._applyEvents(this._secondaryEvents);
            },
            _detachSecondaryEvents: function(){
                  this._unapplyEvents(this._secondaryEvents);
            },
            _trigger: function(event, altdate){
                  var date = altdate || this.date,
                        local_date = new Date(date.getTime() + (date.getTimezoneOffset()*60000));

                  this.element.trigger({
                        type: event,
                        date: local_date,
                        format: $.proxy(function(altformat){
                              var format = altformat || this.o.format;
                              return DPGlobal.formatDate(date, format, this.o.language);
                        }, this)
                  });
            },

            show: function(e) {
                  if (!this.isInline)
                        this.picker.appendTo('body');
                  this.picker.show();
                  this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
                  this.place();
                  this._attachSecondaryEvents();
                  $('.datepicker button').on('click', $.proxy(this.hide, this));
                  if (e) {
                        e.preventDefault();
                  }
                  this._trigger('show');
            },

            hide: function(e){
                  if(this.isInline) return;
                  if (!this.picker.is(':visible')) return;
                  this.picker.hide().detach();
                  this._detachSecondaryEvents();
                  this.viewMode = this.o.startView;
                  this.showMode();

                  if (
                        this.o.forceParse &&
                        (
                              this.isInput && this.element.val() ||
                              this.hasInput && this.element.find('input').val()
                        )
                  )
                        this.setValue();
                  this._trigger('hide');
            },

            remove: function() {
                  this.hide();
                  this._detachEvents();
                  this._detachSecondaryEvents();
                  this.picker.remove();
                  delete this.element.data().datepicker;
                  if (!this.isInput) {
                        delete this.element.data().date;
                  }
            },

            getDate: function() {
                  var d = this.getUTCDate();
                  return new Date(d.getTime() + (d.getTimezoneOffset()*60000));
            },

            getUTCDate: function() {
                  return this.date;
            },

            setDate: function(d) {
                  this.setUTCDate(new Date(d.getTime() - (d.getTimezoneOffset()*60000)));
            },

            setUTCDate: function(d) {
                  this.date = d;
                  this.setValue();
            },

            setValue: function() {
                  var formatted = this.getFormattedDate();
                  if (!this.isInput) {
                        if (this.component){
                              this.element.find('input').val(formatted);
                        }
                  } else {
                        this.element.val(formatted);
                  }
            },

            getFormattedDate: function(format) {
                  if (format === undefined)
                        format = this.o.format;
                  return DPGlobal.formatDate(this.date, format, this.o.language);
            },

            setStartDate: function(startDate){
                  this._process_options({startDate: startDate});
                  this.update();
                  this.updateNavArrows();
            },

            setEndDate: function(endDate){
                  this._process_options({endDate: endDate});
                  this.update();
                  this.updateNavArrows();
            },

            setDaysOfWeekDisabled: function(daysOfWeekDisabled){
                  this._process_options({daysOfWeekDisabled: daysOfWeekDisabled});
                  this.update();
                  this.updateNavArrows();
            },

            place: function(){
                                    if(this.isInline) return;
                  var zIndex = parseInt(this.element.parents().filter(function() {
                                          return $(this).css('z-index') != 'auto';
                                    }).first().css('z-index'))+1050;
                  var offset = this.component ? this.component.parent().offset() : this.element.offset();
                  var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(true);
                  this.picker.css({
                        top: offset.top + height,
                        left: offset.left,
                        zIndex: zIndex
                  });
            },

            _allow_update: true,
            update: function(){
                  if (!this._allow_update) return;

                  var date, fromArgs = false;
                  if(arguments && arguments.length && (typeof arguments[0] === 'string' || arguments[0] instanceof Date)) {
                        date = arguments[0];
                        fromArgs = true;
                  } else {
                        date = this.isInput ? this.element.val() : this.element.data('date') || this.element.find('input').val();
                        delete this.element.data().date;
                  }

                  this.date = DPGlobal.parseDate(date, this.o.format, this.o.language);

                  if(fromArgs) this.setValue();

                  if (this.date < this.o.startDate) {
                        this.viewDate = new Date(this.o.startDate);
                  } else if (this.date > this.o.endDate) {
                        this.viewDate = new Date(this.o.endDate);
                  } else {
                        this.viewDate = new Date(this.date);
                  }
                  this.fill();
            },

            fillDow: function(){
                  var dowCnt = this.o.weekStart,
                  html = '<tr>';
                  if(this.o.calendarWeeks){
                        var cell = '<th class="cw">&nbsp;</th>';
                        html += cell;
                        this.picker.find('.datepicker-days thead tr:first-child').prepend(cell);
                  }
                  while (dowCnt < this.o.weekStart + 7) {
                        html += '<th class="dow">'+dates[this.o.language].daysMin[(dowCnt++)%7]+'</th>';
                  }
                  html += '</tr>';
                  this.picker.find('.datepicker-days thead').append(html);
            },

            fillMonths: function(){
                  var html = '',
                  i = 0;
                  while (i < 12) {
                        html += '<span class="month">'+dates[this.o.language].monthsShort[i++]+'</span>';
                  }
                  this.picker.find('.datepicker-months td').html(html);
            },

            setRange: function(range){
                  if (!range || !range.length)
                        delete this.range;
                  else
                        this.range = $.map(range, function(d){ return d.valueOf(); });
                  this.fill();
            },

            getClassNames: function(date){
                  var cls = [],
                        year = this.viewDate.getUTCFullYear(),
                        month = this.viewDate.getUTCMonth(),
                        currentDate = this.date.valueOf(),
                        today = new Date();
                  if (date.getUTCFullYear() < year || (date.getUTCFullYear() == year && date.getUTCMonth() < month)) {
                        cls.push('old');
                  } else if (date.getUTCFullYear() > year || (date.getUTCFullYear() == year && date.getUTCMonth() > month)) {
                        cls.push('new');
                  }
                  // Compare internal UTC date with local today, not UTC today
                  if (this.o.todayHighlight &&
                        date.getUTCFullYear() == today.getFullYear() &&
                        date.getUTCMonth() == today.getMonth() &&
                        date.getUTCDate() == today.getDate()) {
                        cls.push('today');
                  }
                  if (currentDate && date.valueOf() == currentDate) {
                        cls.push('active');
                  }
                  if (date.valueOf() < this.o.startDate || date.valueOf() > this.o.endDate ||
                        $.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1) {
                        cls.push('disabled');
                  }
                  if (this.range){
                        if (date > this.range[0] && date < this.range[this.range.length-1]){
                              cls.push('range');
                        }
                        if ($.inArray(date.valueOf(), this.range) != -1){
                              cls.push('selected');
                        }
                  }
                  return cls;
            },

            fill: function() {
                  var d = new Date(this.viewDate),
                        year = d.getUTCFullYear(),
                        month = d.getUTCMonth(),
                        startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
                        startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
                        endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
                        endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
                        currentDate = this.date && this.date.valueOf(),
                        tooltip;
                  this.picker.find('.datepicker-days thead th.datepicker-switch')
                                    .text(dates[this.o.language].months[month]+' '+year);
                  this.picker.find('tfoot th.today')
                                    .text(dates[this.o.language].today)
                                    .toggle(this.o.todayBtn !== false);
                  this.picker.find('tfoot th.clear')
                                    .text(dates[this.o.language].clear)
                                    .toggle(this.o.clearBtn !== false);
                  this.updateNavArrows();
                  this.fillMonths();
                  var prevMonth = UTCDate(year, month-1, 28,0,0,0,0),
                        day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
                  prevMonth.setUTCDate(day);
                  prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.o.weekStart + 7)%7);
                  var nextMonth = new Date(prevMonth);
                  nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
                  nextMonth = nextMonth.valueOf();
                  var html = [];
                  var clsName;
                  while(prevMonth.valueOf() < nextMonth) {
                        if (prevMonth.getUTCDay() == this.o.weekStart) {
                              html.push('<tr>');
                              if(this.o.calendarWeeks){
                                    // ISO 8601: First week contains first thursday.
                                    // ISO also states week starts on Monday, but we can be more abstract here.
                                    var
                                          // Start of current week: based on weekstart/current date
                                          ws = new Date(+prevMonth + (this.o.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5),
                                          // Thursday of this week
                                          th = new Date(+ws + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
                                          // First Thursday of year, year from thursday
                                          yth = new Date(+(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay())%7*864e5),
                                          // Calendar week: ms between thursdays, div ms per day, div 7 days
                                          calWeek =  (th - yth) / 864e5 / 7 + 1;
                                    html.push('<td class="cw">'+ calWeek +'</td>');

                              }
                        }
                        clsName = this.getClassNames(prevMonth);
                        clsName.push('day');

                        var before = this.o.beforeShowDay(prevMonth);
                        if (before === undefined)
                              before = {};
                        else if (typeof(before) === 'boolean')
                              before = {enabled: before};
                        else if (typeof(before) === 'string')
                              before = {classes: before};
                        if (before.enabled === false)
                              clsName.push('disabled');
                        if (before.classes)
                              clsName = clsName.concat(before.classes.split(/\s+/));
                        if (before.tooltip)
                              tooltip = before.tooltip;

                        clsName = $.unique(clsName);
                        html.push('<td class="'+clsName.join(' ')+'"' + (tooltip ? ' title="'+tooltip+'"' : '') + '>'+prevMonth.getUTCDate() + '</td>');
                        if (prevMonth.getUTCDay() == this.o.weekEnd) {
                              html.push('</tr>');
                        }
                        prevMonth.setUTCDate(prevMonth.getUTCDate()+1);
                  }
                  this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
                  var currentYear = this.date && this.date.getUTCFullYear();

                  var months = this.picker.find('.datepicker-months')
                                    .find('th:eq(1)')
                                          .text(year)
                                          .end()
                                    .find('span').removeClass('active');
                  if (currentYear && currentYear == year) {
                        months.eq(this.date.getUTCMonth()).addClass('active');
                  }
                  if (year < startYear || year > endYear) {
                        months.addClass('disabled');
                  }
                  if (year == startYear) {
                        months.slice(0, startMonth).addClass('disabled');
                  }
                  if (year == endYear) {
                        months.slice(endMonth+1).addClass('disabled');
                  }

                  html = '';
                  year = parseInt(year/10, 10) * 10;
                  var yearCont = this.picker.find('.datepicker-years')
                                                .find('th:eq(1)')
                                                      .text(year + '-' + (year + 9))
                                                      .end()
                                                .find('td');
                  year -= 1;
                  for (var i = -1; i < 11; i++) {
                        html += '<span class="year'+(i == -1 ? ' old' : i == 10 ? ' new' : '')+(currentYear == year ? ' active' : '')+(year < startYear || year > endYear ? ' disabled' : '')+'">'+year+'</span>';
                        year += 1;
                  }
                  yearCont.html(html);
            },

            updateNavArrows: function() {
                  if (!this._allow_update) return;

                  var d = new Date(this.viewDate),
                        year = d.getUTCFullYear(),
                        month = d.getUTCMonth();
                  switch (this.viewMode) {
                        case 0:
                              if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() && month <= this.o.startDate.getUTCMonth()) {
                                    this.picker.find('.prev').css({visibility: 'hidden'});
                              } else {
                                    this.picker.find('.prev').css({visibility: 'visible'});
                              }
                              if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() && month >= this.o.endDate.getUTCMonth()) {
                                    this.picker.find('.next').css({visibility: 'hidden'});
                              } else {
                                    this.picker.find('.next').css({visibility: 'visible'});
                              }
                              break;
                        case 1:
                        case 2:
                              if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear()) {
                                    this.picker.find('.prev').css({visibility: 'hidden'});
                              } else {
                                    this.picker.find('.prev').css({visibility: 'visible'});
                              }
                              if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear()) {
                                    this.picker.find('.next').css({visibility: 'hidden'});
                              } else {
                                    this.picker.find('.next').css({visibility: 'visible'});
                              }
                              break;
                  }
            },

            click: function(e) {
                  e.preventDefault();
                  var target = $(e.target).closest('span, td, th');
                  if (target.length == 1) {
                        switch(target[0].nodeName.toLowerCase()) {
                              case 'th':
                                    switch(target[0].className) {
                                          case 'datepicker-switch':
                                                this.showMode(1);
                                                break;
                                          case 'prev':
                                          case 'next':
                                                var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className == 'prev' ? -1 : 1);
                                                switch(this.viewMode){
                                                      case 0:
                                                            this.viewDate = this.moveMonth(this.viewDate, dir);
                                                            break;
                                                      case 1:
                                                      case 2:
                                                            this.viewDate = this.moveYear(this.viewDate, dir);
                                                            break;
                                                }
                                                this.fill();
                                                break;
                                          case 'today':
                                                var date = new Date();
                                                date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

                                                this.showMode(-2);
                                                var which = this.o.todayBtn == 'linked' ? null : 'view';
                                                this._setDate(date, which);
                                                break;
                                          case 'clear':
                                                var element;
                                                if (this.isInput)
                                                      element = this.element;
                                                else if (this.component)
                                                      element = this.element.find('input');
                                                if (element)
                                                      element.val("").change();
                                                this._trigger('changeDate');
                                                this.update();
                                                if (this.o.autoclose)
                                                      this.hide();
                                                break;
                                    }
                                    break;
                              case 'span':
                                    if (!target.is('.disabled')) {
                                          this.viewDate.setUTCDate(1);
                                          if (target.is('.month')) {
                                                var day = 1;
                                                var month = target.parent().find('span').index(target);
                                                var year = this.viewDate.getUTCFullYear();
                                                this.viewDate.setUTCMonth(month);
                                                this._trigger('changeMonth', this.viewDate);
                                                if (this.o.minViewMode === 1) {
                                                      this._setDate(UTCDate(year, month, day,0,0,0,0));
                                                }
                                          } else {
                                                var year = parseInt(target.text(), 10)||0;
                                                var day = 1;
                                                var month = 0;
                                                this.viewDate.setUTCFullYear(year);
                                                this._trigger('changeYear', this.viewDate);
                                                if (this.o.minViewMode === 2) {
                                                      this._setDate(UTCDate(year, month, day,0,0,0,0));
                                                }
                                          }
                                          this.showMode(-1);
                                          this.fill();
                                    }
                                    break;
                              case 'td':
                                    if (target.is('.day') && !target.is('.disabled')){
                                          var day = parseInt(target.text(), 10)||1;
                                          var year = this.viewDate.getUTCFullYear(),
                                                month = this.viewDate.getUTCMonth();
                                          if (target.is('.old')) {
                                                if (month === 0) {
                                                      month = 11;
                                                      year -= 1;
                                                } else {
                                                      month -= 1;
                                                }
                                          } else if (target.is('.new')) {
                                                if (month == 11) {
                                                      month = 0;
                                                      year += 1;
                                                } else {
                                                      month += 1;
                                                }
                                          }
                                          this._setDate(UTCDate(year, month, day,0,0,0,0));
                                    }
                                    break;
                        }
                  }
            },

            _setDate: function(date, which){
                  if (!which || which == 'date')
                        this.date = new Date(date);
                  if (!which || which  == 'view')
                        this.viewDate = new Date(date);
                  this.fill();
                  this.setValue();
                  this._trigger('changeDate');
                  var element;
                  if (this.isInput) {
                        element = this.element;
                  } else if (this.component){
                        element = this.element.find('input');
                  }
                  if (element) {
                        element.change();
                        if (this.o.autoclose && (!which || which == 'date')) {
                              this.hide();
                        }
                  }
            },

            moveMonth: function(date, dir){
                  if (!dir) return date;
                  var new_date = new Date(date.valueOf()),
                        day = new_date.getUTCDate(),
                        month = new_date.getUTCMonth(),
                        mag = Math.abs(dir),
                        new_month, test;
                  dir = dir > 0 ? 1 : -1;
                  if (mag == 1){
                        test = dir == -1
                              // If going back one month, make sure month is not current month
                              // (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
                              ? function(){ return new_date.getUTCMonth() == month; }
                              // If going forward one month, make sure month is as expected
                              // (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
                              : function(){ return new_date.getUTCMonth() != new_month; };
                        new_month = month + dir;
                        new_date.setUTCMonth(new_month);
                        // Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
                        if (new_month < 0 || new_month > 11)
                              new_month = (new_month + 12) % 12;
                  } else {
                        // For magnitudes >1, move one month at a time...
                        for (var i=0; i<mag; i++)
                              // ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
                              new_date = this.moveMonth(new_date, dir);
                        // ...then reset the day, keeping it in the new month
                        new_month = new_date.getUTCMonth();
                        new_date.setUTCDate(day);
                        test = function(){ return new_month != new_date.getUTCMonth(); };
                  }
                  // Common date-resetting loop -- if date is beyond end of month, make it
                  // end of month
                  while (test()){
                        new_date.setUTCDate(--day);
                        new_date.setUTCMonth(new_month);
                  }
                  return new_date;
            },

            moveYear: function(date, dir){
                  return this.moveMonth(date, dir*12);
            },

            dateWithinRange: function(date){
                  return date >= this.o.startDate && date <= this.o.endDate;
            },

            keydown: function(e){
                  if (this.picker.is(':not(:visible)')){
                        if (e.keyCode == 27) // allow escape to hide and re-show picker
                              this.show();
                        return;
                  }
                  var dateChanged = false,
                        dir, day, month,
                        newDate, newViewDate;
                  switch(e.keyCode){
                        case 27: // escape
                              this.hide();
                              e.preventDefault();
                              break;
                        case 37: // left
                        case 39: // right
                              if (!this.o.keyboardNavigation) break;
                              dir = e.keyCode == 37 ? -1 : 1;
                              if (e.ctrlKey){
                                    newDate = this.moveYear(this.date, dir);
                                    newViewDate = this.moveYear(this.viewDate, dir);
                              } else if (e.shiftKey){
                                    newDate = this.moveMonth(this.date, dir);
                                    newViewDate = this.moveMonth(this.viewDate, dir);
                              } else {
                                    newDate = new Date(this.date);
                                    newDate.setUTCDate(this.date.getUTCDate() + dir);
                                    newViewDate = new Date(this.viewDate);
                                    newViewDate.setUTCDate(this.viewDate.getUTCDate() + dir);
                              }
                              if (this.dateWithinRange(newDate)){
                                    this.date = newDate;
                                    this.viewDate = newViewDate;
                                    this.setValue();
                                    this.update();
                                    e.preventDefault();
                                    dateChanged = true;
                              }
                              break;
                        case 38: // up
                        case 40: // down
                              if (!this.o.keyboardNavigation) break;
                              dir = e.keyCode == 38 ? -1 : 1;
                              if (e.ctrlKey){
                                    newDate = this.moveYear(this.date, dir);
                                    newViewDate = this.moveYear(this.viewDate, dir);
                              } else if (e.shiftKey){
                                    newDate = this.moveMonth(this.date, dir);
                                    newViewDate = this.moveMonth(this.viewDate, dir);
                              } else {
                                    newDate = new Date(this.date);
                                    newDate.setUTCDate(this.date.getUTCDate() + dir * 7);
                                    newViewDate = new Date(this.viewDate);
                                    newViewDate.setUTCDate(this.viewDate.getUTCDate() + dir * 7);
                              }
                              if (this.dateWithinRange(newDate)){
                                    this.date = newDate;
                                    this.viewDate = newViewDate;
                                    this.setValue();
                                    this.update();
                                    e.preventDefault();
                                    dateChanged = true;
                              }
                              break;
                        case 13: // enter
                              this.hide();
                              e.preventDefault();
                              break;
                        case 9: // tab
                              this.hide();
                              break;
                  }
                  if (dateChanged){
                        this._trigger('changeDate');
                        var element;
                        if (this.isInput) {
                              element = this.element;
                        } else if (this.component){
                              element = this.element.find('input');
                        }
                        if (element) {
                              element.change();
                        }
                  }
            },

            showMode: function(dir) {
                  if (dir) {
                        this.viewMode = Math.max(this.o.minViewMode, Math.min(2, this.viewMode + dir));
                  }
                  /*
                        vitalets: fixing bug of very special conditions:
                        jquery 1.7.1 + webkit + show inline datepicker in bootstrap popover.
                        Method show() does not set display css correctly and datepicker is not shown.
                        Changed to .css('display', 'block') solve the problem.
                        See https://github.com/vitalets/x-editable/issues/37

                        In jquery 1.7.2+ everything works fine.
                  */
                  //this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
                  this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).css('display', 'block');
                  this.updateNavArrows();
            }
      };

      var DateRangePicker = function(element, options){
            this.element = $(element);
            this.inputs = $.map(options.inputs, function(i){ return i.jquery ? i[0] : i; });
            delete options.inputs;

            $(this.inputs)
                  .datepicker(options)
                  .bind('changeDate', $.proxy(this.dateUpdated, this));

            this.pickers = $.map(this.inputs, function(i){ return $(i).data('datepicker'); });
            this.updateDates();
      };
      DateRangePicker.prototype = {
            updateDates: function(){
                  this.dates = $.map(this.pickers, function(i){ return i.date; });
                  this.updateRanges();
            },
            updateRanges: function(){
                  var range = $.map(this.dates, function(d){ return d.valueOf(); });
                  $.each(this.pickers, function(i, p){
                        p.setRange(range);
                  });
            },
            dateUpdated: function(e){
                  var dp = $(e.target).data('datepicker'),
                        new_date = dp.getUTCDate(),
                        i = $.inArray(e.target, this.inputs),
                        l = this.inputs.length;
                  if (i == -1) return;

                  if (new_date < this.dates[i]){
                        // Date being moved earlier/left
                        while (i>=0 && new_date < this.dates[i]){
                              this.pickers[i--].setUTCDate(new_date);
                        }
                  }
                  else if (new_date > this.dates[i]){
                        // Date being moved later/right
                        while (i<l && new_date > this.dates[i]){
                              this.pickers[i++].setUTCDate(new_date);
                        }
                  }
                  this.updateDates();
            },
            remove: function(){
                  $.map(this.pickers, function(p){ p.remove(); });
                  delete this.element.data().datepicker;
            }
      };

      function opts_from_el(el, prefix){
            // Derive options from element data-attrs
            var data = $(el).data(),
                  out = {}, inkey,
                  replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])'),
                  prefix = new RegExp('^' + prefix.toLowerCase());
            for (var key in data)
                  if (prefix.test(key)){
                        inkey = key.replace(replace, function(_,a){ return a.toLowerCase(); });
                        out[inkey] = data[key];
                  }
            return out;
      }

      function opts_from_locale(lang){
            // Derive options from locale plugins
            var out = {};
            // Check if "de-DE" style date is available, if not language should
            // fallback to 2 letter code eg "de"
            if (!dates[lang]) {
                  lang = lang.split('-')[0]
                  if (!dates[lang])
                        return;
            }
            var d = dates[lang];
            $.each($.fn.datepicker.locale_opts, function(i,k){
                  if (k in d)
                        out[k] = d[k];
            });
            return out;
      }

      var old = $.fn.datepicker;
      $.fn.datepicker = function ( option ) {
            var args = Array.apply(null, arguments);
            args.shift();
            var internal_return,
                  this_return;
            this.each(function () {
                  var $this = $(this),
                        data = $this.data('datepicker'),
                        options = typeof option == 'object' && option;
                  if (!data) {
                        var elopts = opts_from_el(this, 'date'),
                              // Preliminary otions
                              xopts = $.extend({}, $.fn.datepicker.defaults, elopts, options),
                              locopts = opts_from_locale(xopts.language),
                              // Options priority: js args, data-attrs, locales, defaults
                              opts = $.extend({}, $.fn.datepicker.defaults, locopts, elopts, options);
                        if ($this.is('.input-daterange') || opts.inputs){
                              var ropts = {
                                    inputs: opts.inputs || $this.find('input').toArray()
                              };
                              $this.data('datepicker', (data = new DateRangePicker(this, $.extend(opts, ropts))));
                        }
                        else{
                              $this.data('datepicker', (data = new Datepicker(this, opts)));
                        }
                  }
                  if (typeof option == 'string' && typeof data[option] == 'function') {
                        internal_return = data[option].apply(data, args);
                        if (internal_return !== undefined)
                              return false;
                  }
            });
            if (internal_return !== undefined)
                  return internal_return;
            else
                  return this;
      };

      $.fn.datepicker.defaults = {
            autoclose: false,
            beforeShowDay: $.noop,
            calendarWeeks: false,
            clearBtn: false,
            daysOfWeekDisabled: [],
            endDate: Infinity,
            forceParse: true,
            format: 'mm/dd/yyyy',
            keyboardNavigation: true,
            language: 'en',
            minViewMode: 0,
            rtl: false,
            startDate: -Infinity,
            startView: 0,
            todayBtn: false,
            todayHighlight: false,
            weekStart: 0
      };
      $.fn.datepicker.locale_opts = [
            'format',
            'rtl',
            'weekStart'
      ];
      $.fn.datepicker.Constructor = Datepicker;
      var dates = $.fn.datepicker.dates = {
            en: {
                  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
                  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                  monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                  today: "Today",
                  clear: "Clear"
            }
      };

      var DPGlobal = {
            modes: [
                  {
                        clsName: 'days',
                        navFnc: 'Month',
                        navStep: 1
                  },
                  {
                        clsName: 'months',
                        navFnc: 'FullYear',
                        navStep: 1
                  },
                  {
                        clsName: 'years',
                        navFnc: 'FullYear',
                        navStep: 10
            }],
            isLeapYear: function (year) {
                  return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
            },
            getDaysInMonth: function (year, month) {
                  return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
            },
            validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
            nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
            parseFormat: function(format){
                  // IE treats \0 as a string end in inputs (truncating the value),
                  // so it's a bad format delimiter, anyway
                  var separators = format.replace(this.validParts, '\0').split('\0'),
                        parts = format.match(this.validParts);
                  if (!separators || !separators.length || !parts || parts.length === 0){
                        throw new Error("Invalid date format.");
                  }
                  return {separators: separators, parts: parts};
            },
            parseDate: function(date, format, language) {
                  if (date instanceof Date) return date;
                  if (typeof format === 'string')
                        format = DPGlobal.parseFormat(format);
                  if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)) {
                        var part_re = /([\-+]\d+)([dmwy])/,
                              parts = date.match(/([\-+]\d+)([dmwy])/g),
                              part, dir;
                        date = new Date();
                        for (var i=0; i<parts.length; i++) {
                              part = part_re.exec(parts[i]);
                              dir = parseInt(part[1]);
                              switch(part[2]){
                                    case 'd':
                                          date.setUTCDate(date.getUTCDate() + dir);
                                          break;
                                    case 'm':
                                          date = Datepicker.prototype.moveMonth.call(Datepicker.prototype, date, dir);
                                          break;
                                    case 'w':
                                          date.setUTCDate(date.getUTCDate() + dir * 7);
                                          break;
                                    case 'y':
                                          date = Datepicker.prototype.moveYear.call(Datepicker.prototype, date, dir);
                                          break;
                              }
                        }
                        return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
                  }
                  var parts = date && date.match(this.nonpunctuation) || [],
                        date = new Date(),
                        parsed = {},
                        setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
                        setters_map = {
                              yyyy: function(d,v){ return d.setUTCFullYear(v); },
                              yy: function(d,v){ return d.setUTCFullYear(2000+v); },
                              m: function(d,v){
                                    v -= 1;
                                    while (v<0) v += 12;
                                    v %= 12;
                                    d.setUTCMonth(v);
                                    while (d.getUTCMonth() != v)
                                          d.setUTCDate(d.getUTCDate()-1);
                                    return d;
                              },
                              d: function(d,v){ return d.setUTCDate(v); }
                        },
                        val, filtered, part;
                  setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
                  setters_map['dd'] = setters_map['d'];
                  date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                  var fparts = format.parts.slice();
                  // Remove noop parts
                  if (parts.length != fparts.length) {
                        fparts = $(fparts).filter(function(i,p){
                              return $.inArray(p, setters_order) !== -1;
                        }).toArray();
                  }
                  // Process remainder
                  if (parts.length == fparts.length) {
                        for (var i=0, cnt = fparts.length; i < cnt; i++) {
                              val = parseInt(parts[i], 10);
                              part = fparts[i];
                              if (isNaN(val)) {
                                    switch(part) {
                                          case 'MM':
                                                filtered = $(dates[language].months).filter(function(){
                                                      var m = this.slice(0, parts[i].length),
                                                            p = parts[i].slice(0, m.length);
                                                      return m == p;
                                                });
                                                val = $.inArray(filtered[0], dates[language].months) + 1;
                                                break;
                                          case 'M':
                                                filtered = $(dates[language].monthsShort).filter(function(){
                                                      var m = this.slice(0, parts[i].length),
                                                            p = parts[i].slice(0, m.length);
                                                      return m == p;
                                                });
                                                val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
                                                break;
                                    }
                              }
                              parsed[part] = val;
                        }
                        for (var i=0, s; i<setters_order.length; i++){
                              s = setters_order[i];
                              if (s in parsed && !isNaN(parsed[s]))
                                    setters_map[s](date, parsed[s]);
                        }
                  }
                  return date;
            },
            formatDate: function(date, format, language){
                  if (typeof format === 'string')
                        format = DPGlobal.parseFormat(format);
                  var val = {
                        d: date.getUTCDate(),
                        D: dates[language].daysShort[date.getUTCDay()],
                        DD: dates[language].days[date.getUTCDay()],
                        m: date.getUTCMonth() + 1,
                        M: dates[language].monthsShort[date.getUTCMonth()],
                        MM: dates[language].months[date.getUTCMonth()],
                        yy: date.getUTCFullYear().toString().substring(2),
                        yyyy: date.getUTCFullYear()
                  };
                  val.dd = (val.d < 10 ? '0' : '') + val.d;
                  val.mm = (val.m < 10 ? '0' : '') + val.m;
                  var date = [],
                        seps = $.extend([], format.separators);
                  for (var i=0, cnt = format.parts.length; i <= cnt; i++) {
                        if (seps.length)
                              date.push(seps.shift());
                        date.push(val[format.parts[i]]);
                  }
                  return date.join('');
            },
            headTemplate: '<thead>'+
                                          '<tr>'+
                                                '<th class="prev"><i class="fa fa-chevron-left"/></th>'+
                                                '<th colspan="5" class="datepicker-switch"></th>'+
                                                '<th class="next"><i class="fa fa-chevron-right"/></th>'+
                                          '</tr>'+
                                    '</thead>',
            contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
            footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'
      };
      DPGlobal.template = '<div class="datepicker">'+
                                          '<div class="datepicker-days">'+
                                                '<table class=" table-condensed">'+
                                                      DPGlobal.headTemplate+
                                                      '<tbody></tbody>'+
                                                      DPGlobal.footTemplate+
                                                '</table>'+
                                          '</div>'+
                                          '<div class="datepicker-months">'+
                                                '<table class="table-condensed">'+
                                                      DPGlobal.headTemplate+
                                                      DPGlobal.contTemplate+
                                                      DPGlobal.footTemplate+
                                                '</table>'+
                                          '</div>'+
                                          '<div class="datepicker-years">'+
                                                '<table class="table-condensed">'+
                                                      DPGlobal.headTemplate+
                                                      DPGlobal.contTemplate+
                                                      DPGlobal.footTemplate+
                                                '</table>'+
                                          '</div>'+
                                    '<button class="btn btn-mini btn-success pull-right" id="datepicker_close" >Done</button></div>';

      $.fn.datepicker.DPGlobal = DPGlobal;


      /* DATEPICKER NO CONFLICT
      * =================== */

      $.fn.datepicker.noConflict = function(){
            $.fn.datepicker = old;
            return this;
      };


      /* DATEPICKER DATA-API
      * ================== */

      $(document).on(
            'focus.datepicker.data-api click.datepicker.data-api',
            '[data-provide="datepicker"]',
            function(e){
                  var $this = $(this);
                  if ($this.data('datepicker')) return;
                  e.preventDefault();
                  // component click requires us to explicitly show it
                  $this.datepicker('show');
            }
      );
      $(function(){
            $('[data-provide="datepicker-inline"]').datepicker();
      });

}( window.jQuery ));

/**
* @license
* =========================================================
* bootstrap-datetimepicker.js
* http://www.eyecon.ro/bootstrap-datepicker
* =========================================================
* Copyright 2012 Stefan Petre
*
* Contributions:
*  - Andrew Rowls
*  - Thiago de Arruda
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =========================================================
*/
(function($) {
      var smartPhone = window.orientation != undefined;
      var DateTimePicker = function(element, options) {
            this.id = dpgId++;
            this.init(element, options)
      };
      var dateToDate = function(dt) {
            if ( typeof dt === "string") {
                  return new Date(dt)
            }
            return dt
      };
      DateTimePicker.prototype = {
            constructor : DateTimePicker,
            init : function(element, options) {
                  var icon;
                  if (!(options.pickTime || options.pickDate))
                        throw new Error("Must choose at least one picker");
                  this.options = options;
                  this.$element = $(element);
                  this.language = options.language in dates ? options.language : "en";
                  this.pickDate = options.pickDate;
                  this.pickTime = options.pickTime;
                  this.isInput = this.$element.is("input");
                  this.component = false;
                  if (this.$element.find(".input-append") || this.$element.find(".input-prepend"))
                        this.component = this.$element.find(".add-on");
                  this.format = options.format;
                  if (!this.format) {
                        if (this.isInput)
                              this.format = this.$element.data("format");
                        else
                              this.format = this.$element.find("input").data("format");
                        if (!this.format)
                              this.format = "MM/dd/yyyy";
                  }
                  this._compileFormat();
                  if (this.component) {
                        icon = this.component.find("i");
                  }
                  if (this.pickTime) {
                        if (icon && icon.length)
                              this.timeIcon = icon.data("time-icon");
                        if (!this.timeIcon)
                              this.timeIcon = "icon-time";
                        icon.addClass(this.timeIcon);
                  }
                  if (this.pickDate) {
                        if (icon && icon.length)
                              this.dateIcon = icon.data("date-icon");
                        if (!this.dateIcon)
                              this.dateIcon = "icon-calendar";
                        icon.removeClass(this.timeIcon);
                        icon.addClass(this.dateIcon);
                  }
                  this.widget = $(getTemplate(this.timeIcon, options.pickDate, options.pickTime, options.pick12HourFormat, options.pickSeconds, options.collapse)).appendTo("body");
                  this.minViewMode = options.minViewMode || this.$element.data("date-minviewmode") || 0;
                  if ( typeof this.minViewMode === "string") {
                        switch(this.minViewMode) {
                              case"months":
                                    this.minViewMode = 1;
                                    break;
                              case"years":
                                    this.minViewMode = 2;
                                    break;
                              default:
                                    this.minViewMode = 0;
                                    break
                        }
                  }
                  this.viewMode = options.viewMode || this.$element.data("date-viewmode") || 0;
                  if ( typeof this.viewMode === "string") {
                        switch(this.viewMode) {
                              case"months":
                                    this.viewMode = 1;
                                    break;
                              case"years":
                                    this.viewMode = 2;
                                    break;
                              default:
                                    this.viewMode = 0;
                                    break
                        }
                  }
                  this.startViewMode = this.viewMode;
                  this.weekStart = options.weekStart || this.$element.data("date-weekstart") || 0;
                  this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;
                  this.setStartDate(options.startDate || this.$element.data("date-startdate"));
                  this.setEndDate(options.endDate || this.$element.data("date-enddate"));
                  this.fillDow();
                  this.fillMonths();
                  this.fillHours();
                  this.fillMinutes();
                  this.fillSeconds();
                  this.update();
                  this.showMode();
                  this._attachDatePickerEvents();
            },
            show : function(e) {
                  this.widget.show();
                  this.height = this.component ? this.component.outerHeight() : this.$element.outerHeight();
                  this.place();
                  this.$element.trigger({
                        type : "show",
                        date : this._date
                  });
                  this._attachDatePickerGlobalEvents();
                  if (e) {
                        e.stopPropagation();
                        e.preventDefault();
                  }
            },
            disable : function() {
                  this.$element.find("input").prop("disabled", true);
                  this._detachDatePickerEvents();
            },
            enable : function() {
                  this.$element.find("input").prop("disabled", false);
                  this._attachDatePickerEvents();
            },
            hide : function() {
                  var collapse = this.widget.find(".collapse");
                  for (var i = 0; i < collapse.length; i++) {
                        var collapseData = collapse.eq(i).data("collapse");
                        if (collapseData && collapseData.transitioning)
                              return;
                  }
                  this.widget.hide();
                  this.viewMode = this.startViewMode;
                  this.showMode();
                  this.set();
                  this.$element.trigger({
                        type : "hide",
                        date : this._date
                  });
                  this._detachDatePickerGlobalEvents();
            },
            set : function() {
                  var formatted = "";
                  if (!this._unset)
                        formatted = this.formatDate(this._date);
                  if (!this.isInput) {
                        if (this.component) {
                              var input = this.$element.find("input");
                              input.val(formatted);
                              this._resetMaskPos(input)
                        }
                        this.$element.data("date", formatted);
                  } else {
                        this.$element.val(formatted);
                        this._resetMaskPos(this.$element);
                  }
            },
            setValue : function(newDate) {
                  if (!newDate) {
                        this._unset = true;
                  } else {
                        this._unset = false;
                  }
                  if ( typeof newDate === "string") {
                        this._date = this.parseDate(newDate);
                  } else if (newDate) {
                        this._date = new Date(newDate);
                  }
                  this.set();
                  this.viewDate = UTCDate(this._date.getUTCFullYear(), this._date.getUTCMonth(), 1, 0, 0, 0, 0);
                 this.fillDate();
                  this.fillTime();
            },
            getDate : function() {
                  if (this._unset)
                        return null;
                  return new Date(this._date.valueOf());
            },
            setDate : function(date) {
                  if (!date)
                        this.setValue(null);
                  else
                        this.setValue(date.valueOf());
            },
            setStartDate : function(date) {
                  if ( date instanceof Date) {
                        this.startDate = date;
                  } else if ( typeof date === "string") {
                        this.startDate = new UTCDate(date);
                        if (!this.startDate.getUTCFullYear()) {
                              this.startDate = -Infinity;
                        }
                  } else {
                        this.startDate = -Infinity;
                  }
                  if (this.viewDate) {
                        this.update();
                  }
            },
            setEndDate : function(date) {
                  if ( date instanceof Date) {
                        this.endDate = date;
                  } else if ( typeof date === "string") {
                        this.endDate = new UTCDate(date);
                        if (!this.endDate.getUTCFullYear()) {
                              this.endDate = Infinity;
                        }
                  } else {
                        this.endDate = Infinity;
                  }
                  if (this.viewDate) {
                        this.update();
                  }
            },
            getLocalDate : function() {
                  if (this._unset)
                        return null;
                  var d = this._date;
                  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
            },
            setLocalDate : function(localDate) {
                  if (!localDate)
                        this.setValue(null);
                  else
                        this.setValue(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), localDate.getHours(), localDate.getMinutes(), localDate.getSeconds(), localDate.getMilliseconds()));
            },
            place : function() {
                  var position = "absolute";
                  var offset = this.component ? this.component.offset() : this.$element.offset();
                  this.width = this.component ? this.component.outerWidth() : this.$element.outerWidth();
                  offset.top = offset.top + this.height;
                  var $window = $(window);
                  if (this.options.width != undefined) {
                        this.widget.width(this.options.width);
                  }
                  if (this.options.orientation == "left") {
                        this.widget.addClass("left-oriented");
                        offset.left = offset.left - this.widget.width() + 20;
                  }
                  if (this._isInFixed()) {
                        position = "fixed";
                        offset.top -= $window.scrollTop();
                        offset.left -= $window.scrollLeft();
                  }
                  if ($window.width() < offset.left + this.widget.outerWidth()) {
                        offset.right = $window.width() - offset.left - this.width;
                        offset.left = "auto";
                        this.widget.addClass("pull-right");
                  } else {
                        offset.right = "auto";
                        this.widget.removeClass("pull-right");
                  }
                  this.widget.css({
                        position : position,
                        top : offset.top,
                        left : offset.left,
                        right : offset.right
                  });
            },
            notifyChange : function() {
                  this.$element.trigger({
                        type : "changeDate",
                        date : this.getDate(),
                        localDate : this.getLocalDate()
                  });
            },
            update : function(newDate) {
                  var dateStr = newDate;
                  if (!dateStr) {
                        if (this.isInput) {
                              dateStr = this.$element.val();
                        } else {
                              dateStr = this.$element.find("input").val();
                        }
                        if (dateStr) {
                              this._date = this.parseDate(dateStr);
                        }
                        if (!this._date) {
                              var tmp = new Date;
                              this._date = UTCDate(tmp.getFullYear(), tmp.getMonth(), tmp.getDate(), tmp.getHours(), tmp.getMinutes(), tmp.getSeconds(), tmp.getMilliseconds());
                        }
                  }
                  this.viewDate = UTCDate(this._date.getUTCFullYear(), this._date.getUTCMonth(), 1, 0, 0, 0, 0);
                  this.fillDate();
                  this.fillTime();
            },
            fillDow : function() {
                  var dowCnt = this.weekStart;
                  var html = $("<tr>");
                  while (dowCnt < this.weekStart + 7) {
                        html.append('<th class="dow">' + dates[this.language].daysMin[dowCnt++ % 7] + "</th>");
                  }
                  this.widget.find(".datepicker-days thead").append(html);
            },
            fillMonths : function() {
                  var html = "";
                  var i = 0;
                  while (i < 12) {
                        html += '<span class="month">' + dates[this.language].monthsShort[i++] + "</span>";
                  }
                  this.widget.find(".datepicker-months td").append(html);
            },
            fillDate : function() {
                  var year = this.viewDate.getUTCFullYear();
                  var month = this.viewDate.getUTCMonth();
                  var currentDate = UTCDate(this._date.getUTCFullYear(), this._date.getUTCMonth(), this._date.getUTCDate(), 0, 0, 0, 0);
                  var startYear = typeof this.startDate === "object" ? this.startDate.getUTCFullYear() : -Infinity;
                  var startMonth = typeof this.startDate === "object" ? this.startDate.getUTCMonth() : -1;
                  var endYear = typeof this.endDate === "object" ? this.endDate.getUTCFullYear() : Infinity;
                  var endMonth = typeof this.endDate === "object" ? this.endDate.getUTCMonth() : 12;
                  this.widget.find(".datepicker-days").find(".disabled").removeClass("disabled");
                  this.widget.find(".datepicker-months").find(".disabled").removeClass("disabled");
                  this.widget.find(".datepicker-years").find(".disabled").removeClass("disabled");
                  this.widget.find(".datepicker-days th:eq(1)").text(dates[this.language].months[month] + " " + year);
                  var prevMonth = UTCDate(year, month - 1, 28, 0, 0, 0, 0);
                  var day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
                  prevMonth.setUTCDate(day);
                  prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7) % 7);
                  if (year == startYear && month <= startMonth || year < startYear) {
                        this.widget.find(".datepicker-days th:eq(0)").addClass("disabled");
                  }
                  if (year == endYear && month >= endMonth || year > endYear) {
                        this.widget.find(".datepicker-days th:eq(2)").addClass("disabled");
                  }
                  var nextMonth = new Date(prevMonth.valueOf());
                  nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
                  nextMonth = nextMonth.valueOf();
                  var html = [];
                  var row;
                  var clsName;
                  while (prevMonth.valueOf() < nextMonth) {
                        if (prevMonth.getUTCDay() === this.weekStart) {
                              row = $("<tr>");
                              html.push(row)
                        }
                        clsName = "";
                        if (prevMonth.getUTCFullYear() < year || prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() < month) {
                              clsName += " old";
                        } else if (prevMonth.getUTCFullYear() > year || prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() > month) {
                              clsName += " new";
                        }
                        if (prevMonth.valueOf() === currentDate.valueOf()) {
                              clsName += " active";
                        }
                        if (prevMonth.valueOf() + 864e5 <= this.startDate) {
                              clsName += " disabled";
                        }
                        if (prevMonth.valueOf() > this.endDate) {
                              clsName += " disabled"
                        }
                        row.append('<td class="day' + clsName + '">' + prevMonth.getUTCDate() + "</td>");
                        prevMonth.setUTCDate(prevMonth.getUTCDate() + 1)
                  }
                  this.widget.find(".datepicker-days tbody").empty().append(html);
                  var currentYear = this._date.getUTCFullYear();
                  var months = this.widget.find(".datepicker-months").find("th:eq(1)").text(year).end().find("span").removeClass("active");
                  if (currentYear === year) {
                        months.eq(this._date.getUTCMonth()).addClass("active")
                  }
                  if (currentYear - 1 < startYear) {
                        this.widget.find(".datepicker-months th:eq(0)").addClass("disabled")
                  }
                  if (currentYear + 1 > endYear) {
                        this.widget.find(".datepicker-months th:eq(2)").addClass("disabled")
                  }
                  for (var i = 0; i < 12; i++) {
                        if (year == startYear && startMonth > i || year < startYear) {
                              $(months[i]).addClass("disabled")
                        } else if (year == endYear && endMonth < i || year > endYear) {
                              $(months[i]).addClass("disabled")
                        }
                  }
                  html = "";
                  year = parseInt(year / 10, 10) * 10;
                  var yearCont = this.widget.find(".datepicker-years").find("th:eq(1)").text(year + "-" + (year + 9)).end().find("td");
                  this.widget.find(".datepicker-years").find("th").removeClass("disabled");
                  if (startYear > year) {
                        this.widget.find(".datepicker-years").find("th:eq(0)").addClass("disabled")
                  }
                  if (endYear < year + 9) {
                        this.widget.find(".datepicker-years").find("th:eq(2)").addClass("disabled")
                  }
                  year -= 1;
                  for (var i = -1; i < 11; i++) {
                        html += '<span class="year' + (i === -1 || i === 10 ? " old" : "") + (currentYear === year ? " active" : "") + (year < startYear || year > endYear ? " disabled" : "") + '">' + year + "</span>";
                        year += 1
                  }
                  yearCont.html(html)
            },
            fillHours : function() {
                  var table = this.widget.find(".timepicker .timepicker-hours table");
                  table.parent().hide();
                  var html = "";
                  if (this.options.pick12HourFormat) {
                        var current = 1;
                        for (var i = 0; i < 3; i += 1) {
                              html += "<tr>";
                              for (var j = 0; j < 4; j += 1) {
                                    var c = current.toString();
                                    html += '<td class="hour">' + padLeft(c, 2, "0") + "</td>";
                                    current++
                              }
                              html += "</tr>"
                        }
                  } else {
                        var current = 0;
                        for (var i = 0; i < 6; i += 1) {
                              html += "<tr>";
                              for (var j = 0; j < 4; j += 1) {
                                    var c = current.toString();
                                    html += '<td class="hour">' + padLeft(c, 2, "0") + "</td>";
                                   current++
                              }
                              html += "</tr>"
                        }
                  }
                  table.html(html)
            },
            fillMinutes : function() {
                  var table = this.widget.find(".timepicker .timepicker-minutes table");
                  table.parent().hide();
                  var html = "";
                  var current = 0;
                  for (var i = 0; i < 5; i++) {
                        html += "<tr>";
                        for (var j = 0; j < 4; j += 1) {
                              var c = current.toString();
                              html += '<td class="minute">' + padLeft(c, 2, "0") + "</td>";
                              current += 3
                        }
                        html += "</tr>"
                  }
                  table.html(html)
            },
            fillSeconds : function() {
                  var table = this.widget.find(".timepicker .timepicker-seconds table");
                  table.parent().hide();
                  var html = "";
                  var current = 0;
                  for (var i = 0; i < 5; i++) {
                        html += "<tr>";
                        for (var j = 0; j < 4; j += 1) {
                              var c = current.toString();
                              html += '<td class="second">' + padLeft(c, 2, "0") + "</td>";
                              current += 3
                        }
                        html += "</tr>"
                  }
                  table.html(html)
            },
            fillTime : function() {
                  if (!this._date)
                        return;
                  var timeComponents = this.widget.find(".timepicker span[data-time-component]");
                  var table = timeComponents.closest("table");
                  var is12HourFormat = this.options.pick12HourFormat;
                  var hour = this._date.getUTCHours();
                  var period = "AM";
                  if (is12HourFormat) {
                        if (hour >= 12)
                              period = "PM";
                        if (hour === 0)
                              hour = 12;
                        else if (hour != 12)
                              hour = hour % 12;
                        this.widget.find(".timepicker [data-action=togglePeriod]").text(period)
                  }
                  hour = padLeft(hour.toString(), 2, "0");
                  var minute = padLeft(this._date.getUTCMinutes().toString(), 2, "0");
                  var second = padLeft(this._date.getUTCSeconds().toString(), 2, "0");
                  timeComponents.filter("[data-time-component=hours]").text(hour);
                  timeComponents.filter("[data-time-component=minutes]").text(minute);
                  timeComponents.filter("[data-time-component=seconds]").text(second)
            },
            click : function(e) {
                  e.stopPropagation();
                  e.preventDefault();
                  this._unset = false;
                  var target = $(e.target).closest("span, td, th");
                  if (target.length === 1) {
                        if (!target.is(".disabled")) {
                              switch(target[0].nodeName.toLowerCase()) {
                                    case"th":
                                          switch(target[0].className) {
                                                case"switch":
                                                      this.showMode(1);
                                                      break;
                                                case"prev":
                                                case"next":
                                                      var vd = this.viewDate;
                                                      var navFnc = DPGlobal.modes[this.viewMode].navFnc;
                                                      var step = DPGlobal.modes[this.viewMode].navStep;
                                                      if (target[0].className === "prev")
                                                            step = step * -1;
                                                      vd["set"+navFnc](vd["get"+navFnc]() + step);
                                                      this.fillDate();
                                                      this.set();
                                                      break
                                          }
                                          break;
                                    case"span":
                                          if (target.is(".month")) {
                                                var month = target.parent().find("span").index(target);
                                                this.viewDate.setUTCMonth(month)
                                          } else {
                                                var year = parseInt(target.text(), 10) || 0;
                                                this.viewDate.setUTCFullYear(year)
                                          }
                                          if (this.viewMode !== 0) {
                                                this._date = UTCDate(this.viewDate.getUTCFullYear(), this.viewDate.getUTCMonth(), this.viewDate.getUTCDate(), this._date.getUTCHours(), this._date.getUTCMinutes(), this._date.getUTCSeconds(), this._date.getUTCMilliseconds());
                                                this.notifyChange()
                                          }
                                          this.showMode(-1);
                                          this.fillDate();
                                          this.set();
                                          break;
                                    case"td":
                                          if (target.is(".day")) {
                                                var day = parseInt(target.text(), 10) || 1;
                                                var month = this.viewDate.getUTCMonth();
                                                var year = this.viewDate.getUTCFullYear();
                                                if (target.is(".old")) {
                                                      if (month === 0) {
                                                            month = 11;
                                                            year -= 1
                                                      } else {
                                                            month -= 1
                                                      }
                                                } else if (target.is(".new")) {
                                                      if (month == 11) {
                                                            month = 0;
                                                            year += 1
                                                      } else {
                                                            month += 1
                                                      }
                                                }
                                                this._date = UTCDate(year, month, day, this._date.getUTCHours(), this._date.getUTCMinutes(), this._date.getUTCSeconds(), this._date.getUTCMilliseconds());
                                                this.viewDate = UTCDate(year, month, Math.min(28, day), 0, 0, 0, 0);
                                                this.fillDate();
                                                this.set();
                                                this.notifyChange()
                                          }
                                          break
                              }
                        }
                  }
            },
            actions : {
                  incrementHours : function(e) {
                        this._date.setUTCHours(this._date.getUTCHours() + 1)
                  },
                  incrementMinutes : function(e) {
                        this._date.setUTCMinutes(this._date.getUTCMinutes() + 1)
                  },
                  incrementSeconds : function(e) {
                        this._date.setUTCSeconds(this._date.getUTCSeconds() + 1)
                  },
                  decrementHours : function(e) {
                        this._date.setUTCHours(this._date.getUTCHours() - 1)
                  },
                  decrementMinutes : function(e) {
                        this._date.setUTCMinutes(this._date.getUTCMinutes() - 1)
                  },
                  decrementSeconds : function(e) {
                        this._date.setUTCSeconds(this._date.getUTCSeconds() - 1)
                  },
                  togglePeriod : function(e) {
                        var hour = this._date.getUTCHours();
                        if (hour >= 12)
                              hour -= 12;
                        else
                              hour += 12;
                        this._date.setUTCHours(hour)
                  },
                  showPicker : function() {
                        this.widget.find(".timepicker > div:not(.timepicker-picker)").hide();
                        this.widget.find(".timepicker .timepicker-picker").show()
                  },
                  showHours : function() {
                        this.widget.find(".timepicker .timepicker-picker").hide();
                        this.widget.find(".timepicker .timepicker-hours").show()
                  },
                  showMinutes : function() {
                        this.widget.find(".timepicker .timepicker-picker").hide();
                        this.widget.find(".timepicker .timepicker-minutes").show()
                  },
                  showSeconds : function() {
                        this.widget.find(".timepicker .timepicker-picker").hide();
                        this.widget.find(".timepicker .timepicker-seconds").show()
                  },
                  selectHour : function(e) {
                        var tgt = $(e.target);
                        var value = parseInt(tgt.text(), 10);
                        if (this.options.pick12HourFormat) {
                              var current = this._date.getUTCHours();
                              if (current >= 12) {
                                    if (value != 12)
                                          value = (value + 12) % 24
                              } else {
                                    if (value === 12)
                                          value = 0;
                                    else
                                          value = value % 12
                              }
                        }
                        this._date.setUTCHours(value);
                        this.actions.showPicker.call(this)
                  },
                  selectMinute : function(e) {
                        var tgt = $(e.target);
                        var value = parseInt(tgt.text(), 10);
                        this._date.setUTCMinutes(value);
                        this.actions.showPicker.call(this)
                  },
                  selectSecond : function(e) {
                        var tgt = $(e.target);
                        var value = parseInt(tgt.text(), 10);
                        this._date.setUTCSeconds(value);
                        this.actions.showPicker.call(this)
                  }
            },
            doAction : function(e) {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!this._date)
                        this._date = UTCDate(1970, 0, 0, 0, 0, 0, 0);
                  var action = $(e.currentTarget).data("action");
                  var rv = this.actions[action].apply(this, arguments);
                  this.set();
                  this.fillTime();
                  this.notifyChange();
                  return rv
            },
            stopEvent : function(e) {
                  e.stopPropagation();
                  e.preventDefault()
            },
            keydown : function(e) {
                  var self = this, k = e.which, input = $(e.target);
                  if (k == 8 || k == 46) {
                        setTimeout(function() {
                              self._resetMaskPos(input)
                        })
                  }
            },
            keypress : function(e) {
                  var k = e.which;
                  if (k == 8 || k == 46) {
                        return
                  }
                  var input = $(e.target);
                  var c = String.fromCharCode(k);
                  var val = input.val() || "";
                  val += c;
                  var mask = this._mask[this._maskPos];
                  if (!mask) {
                        return false
                  }
                  if (mask.end != val.length) {
                        return
                  }
                  if (!mask.pattern.test(val.slice(mask.start))) {
                        val = val.slice(0, val.length - 1);
                        while (( mask = this._mask[this._maskPos]) && mask.character) {
                              val += mask.character;
                              this._maskPos++
                        }
                        val += c;
                        if (mask.end != val.length) {
                              input.val(val);
                              return false
                        } else {
                              if (!mask.pattern.test(val.slice(mask.start))) {
                                    input.val(val.slice(0, mask.start));
                                    return false
                              } else {
                                    input.val(val);
                                    this._maskPos++;
                                    return false
                              }
                        }
                  } else {
                        this._maskPos++
                  }
            },
            change : function(e) {
                  var input = $(e.target);
                  var val = input.val();
                  
                  if (this._formatPattern.test(val)) {
                        this.update();
                        this.setValue(this._date.getTime());
                        this.notifyChange();
                        this.set()
                  } else if (val && val.trim()) {
                        if(this._formatPattern.test(val)){
                        this.setValue(this._date.getTime());
                        
                        if (this._date)
                              this.set();
                        else
                              input.val("")
                        }
                  } else {
                        console.log(2);
                        if (this._date) {
                              this.setValue(null);
                              this.notifyChange();
                              this._unset = true
                        }
                  }
                  this._resetMaskPos(input)
            },
            showMode : function(dir) {
                  if (dir) {
                        this.viewMode = Math.max(this.minViewMode, Math.min(2, this.viewMode + dir))
                  }
                  this.widget.find(".datepicker > div").hide().filter(".datepicker-" + DPGlobal.modes[this.viewMode].clsName).show()
            },
            destroy : function() {
                  this._detachDatePickerEvents();
                  this._detachDatePickerGlobalEvents();
                  this.widget.remove();
                  this.$element.removeData("datetimepicker");
                  this.component.removeData("datetimepicker")
            },
            formatDate : function(d) {
                  return this.format.replace(formatReplacer, function(match) {
                        var methodName, property, rv, len = match.length;
                        if (match === "ms")
                              len = 1;
                        property = dateFormatComponents[match].property;
                        if (property === "Hours12") {
                              rv = d.getUTCHours();
                              if (rv === 0)
                                    rv = 12;
                              else if (rv !== 12)
                                    rv = rv % 12
                        } else if (property === "Period12") {
                              if (d.getUTCHours() >= 12)
                                    return "PM";
                              else
                                    return "AM"
                        } else {
                              methodName = "get" + property;
                              rv = d[methodName]()
                        }
                        if (methodName === "getUTCMonth")
                              rv = rv + 1;
                        if (methodName === "getUTCYear")
                              rv = rv + 1900 - 2e3;
                        return padLeft(rv.toString(), len, "0")
                  })
            },
            parseDate : function(str) {
                  var match, i, property, methodName, value, parsed = {};
                  if (!( match = this._formatPattern.exec(str)))
                        return null;
                  for ( i = 1; i < match.length; i++) {
                        property = this._propertiesByIndex[i];
                        if (!property)
                              continue;
                        value = match[i];
                        if (/^\d+$/.test(value))
                              value = parseInt(value, 10);
                        parsed[property] = value
                  }
                  return this._finishParsingDate(parsed)
            },
            _resetMaskPos : function(input) {
                  var val = input.val();
                  for (var i = 0; i < this._mask.length; i++) {
                        if (this._mask[i].end > val.length) {
                              this._maskPos = i;
                              break
                        } else if (this._mask[i].end === val.length) {
                              this._maskPos = i + 1;
                              break
                        }
                  }
            },
            _finishParsingDate : function(parsed) {
                  var year, month, date, hours, minutes, seconds, milliseconds;
                  year = parsed.UTCFullYear;
                  if (parsed.UTCYear)
                        year = 2e3 + parsed.UTCYear;
                  if (!year)
                        year = 1970;
                  if (parsed.UTCMonth)
                        month = parsed.UTCMonth - 1;
                  else
                        month = 0;
                  date = parsed.UTCDate || 1;
                  hours = parsed.UTCHours || 0;
                  minutes = parsed.UTCMinutes || 0;
                  seconds = parsed.UTCSeconds || 0;
                  milliseconds = parsed.UTCMilliseconds || 0;
                  if (parsed.Hours12) {
                        hours = parsed.Hours12
                  }
                  if (parsed.Period12) {
                        if (/pm/i.test(parsed.Period12)) {
                              if (hours != 12)
                                    hours = (hours + 12) % 24
                        } else {
                              hours = hours % 12
                        }
                  }
                  return UTCDate(year, month, date, hours, minutes, seconds, milliseconds)
            },
            _compileFormat : function() {
                  var match, component, components = [], mask = [], str = this.format, propertiesByIndex = {}, i = 0, pos = 0;
                  while ( match = formatComponent.exec(str)) {
                        component = match[0];
                        if ( component in dateFormatComponents) {
                              i++;
                              propertiesByIndex[i] = dateFormatComponents[component].property;
                              components.push("\\s*" + dateFormatComponents[component].getPattern(this) + "\\s*");
                              mask.push({
                                    pattern : new RegExp(dateFormatComponents[component].getPattern(this)),
                                    property : dateFormatComponents[component].property,
                                    start : pos,
                                    end : pos += component.length
                              })
                        } else {
                              components.push(escapeRegExp(component));
                              mask.push({
                                    pattern : new RegExp(escapeRegExp(component)),
                                    character : component,
                                    start : pos,
                                    end : ++pos
                              })
                        }
                        str = str.slice(component.length)
                  }
                  this._mask = mask;
                  this._maskPos = 0;
                  this._formatPattern = new RegExp("^\\s*" + components.join("") + "\\s*$");
                  this._propertiesByIndex = propertiesByIndex
            },
            _attachDatePickerEvents : function() {
                  var self = this;
                  this.widget.on("click", ".datepicker *", $.proxy(this.click, this));
                  this.widget.on("click", "[data-action]", $.proxy(this.doAction, this));
                  this.widget.on("mousedown", $.proxy(this.stopEvent, this));
                  if (this.pickDate && this.pickTime) {
                        this.widget.on("click.togglePicker", ".accordion-toggle", function(e) {
                              e.stopPropagation();
                              var $this = $(this);
                              var $parent = $this.closest("ul");
                              var expanded = $parent.find(".collapse.in");
                              var closed = $parent.find(".collapse:not(.in)");
                              if (expanded && expanded.length) {
                                    var collapseData = expanded.data("collapse");
                                    if (collapseData && collapseData.transitioning)
                                          return;
                                    expanded.collapse("hide");
                                    closed.collapse("show");
                                    $this.find("i").toggleClass(self.timeIcon + " " + self.dateIcon);
                                    self.$element.find(".add-on i").toggleClass(self.timeIcon + " " + self.dateIcon)
                              }
                        })
                  }
                  if (this.isInput) {
                        this.$element.on({
                              focus : $.proxy(this.show, this),
                              change : $.proxy(this.change, this)
                        });
                        if (this.options.maskInput) {
                              this.$element.on({
                                    keydown : $.proxy(this.keydown, this),
                                    keypress : $.proxy(this.keypress, this)
                              })
                        }
                  } else {
                        this.$element.on({
                              change : $.proxy(this.change, this)
                        }, "input");
                        if (this.options.maskInput) {
                              this.$element.on({
                                    keydown : $.proxy(this.keydown, this),
                                    keypress : $.proxy(this.keypress, this)
                              }, "input")
                        }
                        if (this.component) {
                              this.component.on("click", $.proxy(this.show, this))
                        } else {
                              this.$element.on("click", $.proxy(this.show, this))
                        }
                  }
            },
            _attachDatePickerGlobalEvents : function() {
                  $(window).on("resize.datetimepicker" + this.id, $.proxy(this.place, this));
                  if (!this.isInput) {
                        $(document).on("mousedown.datetimepicker" + this.id, $.proxy(this.hide, this));
                  }
            },
            _detachDatePickerEvents : function() {
                  this.widget.off("click", ".datepicker *", this.click);
                  this.widget.off("click", "[data-action]");
                  this.widget.off("mousedown", this.stopEvent);
                  if (this.pickDate && this.pickTime) {
                        this.widget.off("click.togglePicker");
                  }
                  if (this.isInput) {
                        this.$element.off({
                              focus : this.show,
                              change : this.change
                        });
                        if (this.options.maskInput) {
                              this.$element.off({
                                    keydown : this.keydown,
                                    keypress : this.keypress
                              });
                        }
                  } else {
                        this.$element.off({
                              change : this.change
                        }, "input");
                        if (this.options.maskInput) {
                              this.$element.off({
                                    keydown : this.keydown,
                                    keypress : this.keypress
                              }, "input");
                        }
                        if (this.component) {
                              this.component.off("click", this.show);
                        } else {
                              this.$element.off("click", this.show);
                        }
                  }
            },
            _detachDatePickerGlobalEvents : function() {
                  $(window).off("resize.datetimepicker" + this.id);
                  if (!this.isInput) {
                        $(document).off("mousedown.datetimepicker" + this.id)
                  }
            },
            _isInFixed : function() {
                  if (this.$element) {
                        var parents = this.$element.parents();
                        var inFixed = false;
                        for (var i = 0; i < parents.length; i++) {
                              if ($(parents[i]).css("position") == "fixed") {
                                    inFixed = true;
                                    break
                              }
                        }
                        return inFixed
                  } else {
                        return false
                  }
            }
      };
      $.fn.datetimepicker = function(option, val) {
            return this.each(function() {
                  var $this = $(this), data = $this.data("datetimepicker"), options = typeof option === "object" && option;
                  if (!data) {
                        $this.data("datetimepicker", data = new DateTimePicker(this, $.extend({}, $.fn.datetimepicker.defaults, options)))
                  }
                  if ( typeof option === "string")
                        data[option](val)
            })
      };
      $.fn.datetimepicker.defaults = {
            maskInput : false,
            pickDate : true,
            pickTime : true,
            pick12HourFormat : false,
            pickSeconds : true,
            startDate : -Infinity,
            endDate : Infinity,
            collapse : true
      };
      $.fn.datetimepicker.Constructor = DateTimePicker;
      var dpgId = 0;
      var dates = $.fn.datetimepicker.dates = {
            en : {
                  days : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  daysShort : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  daysMin : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
                  months : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                  monthsShort : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            }
      };
      var dateFormatComponents = {
            dd : {
                  property : "UTCDate",
                  getPattern : function() {
                        return "(0?[1-9]|[1-2][0-9]|3[0-1])\\b"
                  }
            },
            MM : {
                  property : "UTCMonth",
                  getPattern : function() {
                        return "(0?[1-9]|1[0-2])\\b"
                  }
            },
            yy : {
                  property : "UTCYear",
                  getPattern : function() {
                        return "(\\d{2})\\b"
                  }
            },
            yyyy : {
                  property : "UTCFullYear",
                  getPattern : function() {
                        return "(\\d{4})\\b"
                  }
            },
            hh : {
                  property : "UTCHours",
                  getPattern : function() {
                        return "(0?[0-9]|1[0-9]|2[0-3])\\b"
                  }
            },
            mm : {
                  property : "UTCMinutes",
                  getPattern : function() {
                        return "(0?[0-9]|[1-5][0-9])\\b"
                  }
            },
            ss : {
                  property : "UTCSeconds",
                  getPattern : function() {
                        return "(0?[0-9]|[1-5][0-9])\\b"
                  }
            },
            ms : {
                  property : "UTCMilliseconds",
                  getPattern : function() {
                        return "([0-9]{1,3})\\b"
                  }
            },
            HH : {
                  property : "Hours12",
                  getPattern : function() {
                        return "(0?[1-9]|1[0-2])\\b"
                  }
            },
            PP : {
                  property : "Period12",
                  getPattern : function() {
                        return "(AM|PM|am|pm|Am|aM|Pm|pM)\\b"
                  }
            }
      };
      var keys = [];
      for (var k in dateFormatComponents)
      keys.push(k);
      keys[keys.length - 1] += "\\b";
      keys.push(".");
      var formatComponent = new RegExp(keys.join("\\b|"));
      keys.pop();
      var formatReplacer = new RegExp(keys.join("\\b|"), "g");
      function escapeRegExp(str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
      }

      function padLeft(s, l, c) {
            if (l < s.length)
                  return s;
            else
                  return Array(l - s.length + 1).join(c || " ") + s
      }

      function getTemplate(timeIcon, pickDate, pickTime, is12Hours, showSeconds, collapse) {
            if (pickDate && pickTime) {
                  return '<div class="bootstrap-datetimepicker-widget dropdown-menu">' + "<ul>" + "<li" + ( collapse ? ' class="collapse in"' : "") + ">" + '<div class="datepicker">' + DPGlobal.template + "</div>" + "</li>" + '<li class="picker-switch accordion-toggle"><a><i class="' + timeIcon + '"></i></a></li>' + "<li" + ( collapse ? ' class="collapse"' : "") + ">" + '<div class="timepicker">' + TPGlobal.getTemplate(is12Hours, showSeconds) + "</div>" + "</li>" + "</ul>" + "</div>"
            } else if (pickTime) {
                  return '<div class="bootstrap-datetimepicker-widget dropdown-menu">' + '<div class="timepicker">' + TPGlobal.getTemplate(is12Hours, showSeconds) + "</div>" + "</div>"
            } else {
                  return '<div class="bootstrap-datetimepicker-widget dropdown-menu">' + '<div class="datepicker">' + DPGlobal.template + "</div>" + "</div>"
            }
      }

      function UTCDate() {
            return new Date(Date.UTC.apply(Date, arguments))
      }

      var DPGlobal = {
            modes : [{
                  clsName : "days",
                  navFnc : "UTCMonth",
                  navStep : 1
            }, {
                  clsName : "months",
                  navFnc : "UTCFullYear",
                  navStep : 1
            }, {
                  clsName : "years",
                  navFnc : "UTCFullYear",
                  navStep : 10
            }],
            isLeapYear : function(year) {
                  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0
            },
            getDaysInMonth : function(year, month) {
                  return [31,DPGlobal.isLeapYear(year)?29:28,31,30,31,30,31,31,30,31,30,31][month]
            },
            headTemplate : "<thead>" + "<tr>" + '<th class="prev">&lsaquo;</th>' + '<th colspan="5" class="switch"></th>' + '<th class="next">&rsaquo;</th>' + "</tr>" + "</thead>",
            contTemplate : '<tbody><tr><td colspan="7"></td></tr></tbody>'
      };
      DPGlobal.template = '<div class="datepicker-days">' + '<table class="table-condensed">' + DPGlobal.headTemplate + "<tbody></tbody>" + "</table>" + "</div>" + '<div class="datepicker-months">' + '<table class="table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + "</table>" + "</div>" + '<div class="datepicker-years">' + '<table class="table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + "</table>" + "</div>";
      var TPGlobal = {
            hourTemplate : '<span data-action="showHours" data-time-component="hours" class="timepicker-hour"></span>',
            minuteTemplate : '<span data-action="showMinutes" data-time-component="minutes" class="timepicker-minute"></span>',
            secondTemplate : '<span data-action="showSeconds" data-time-component="seconds" class="timepicker-second"></span>'
      };
      TPGlobal.getTemplate = function(is12Hours, showSeconds) {
            return '<div class="timepicker-picker">' + '<table class="table-condensed"' + ( is12Hours ? ' data-hour-format="12"' : "") + ">" + "<tr>" + '<td><a href="#" class="btn" data-action="incrementHours"><i class="fa fa-chevron-up"></i></a></td>' + '<td class="separator"></td>' + '<td><a href="#" class="btn" data-action="incrementMinutes"><i class="fa fa-chevron-up"></i></a></td>' + ( showSeconds ? '<td class="separator"></td>' + '<td><a href="#" class="btn" data-action="incrementSeconds"><i class="fa fa-chevron-up"></i></a></td>' : "") + ( is12Hours ? '<td class="separator"></td>' : "") + "</tr>" + "<tr>" + "<td>" + TPGlobal.hourTemplate + "</td> " + '<td class="separator">:</td>' + "<td>" + TPGlobal.minuteTemplate + "</td> " + ( showSeconds ? '<td class="separator">:</td>' + "<td>" + TPGlobal.secondTemplate + "</td>" : "") + ( is12Hours ? '<td class="separator"></td>' + "<td>" + '<button type="button" class="btn btn-primary" data-action="togglePeriod"></button>' + "</td>" : "") + "</tr>" + "<tr>" + '<td><a href="#" class="btn" data-action="decrementHours"><i class="fa fa-chevron-down"></i></a></td>' + '<td class="separator"></td>' + '<td><a href="#" class="btn" data-action="decrementMinutes"><i class="fa fa-chevron-down"></i></a></td>' + ( showSeconds ? '<td class="separator"></td>' + '<td><a href="#" class="btn" data-action="decrementSeconds"><i class="fa fa-chevron-down"></i></a></td>' : "") + ( is12Hours ? '<td class="separator"></td>' : "") + "</tr>" + "</table>" + "</div>" + '<div class="timepicker-hours" data-action="selectHour">' + '<table class="table-condensed">' + "</table>" + "</div>" + '<div class="timepicker-minutes" data-action="selectMinute">' + '<table class="table-condensed">' + "</table>" + "</div>" + ( showSeconds ? '<div class="timepicker-seconds" data-action="selectSecond">' + '<table class="table-condensed">' + "</table>" + "</div>" : "");
      };
})(window.jQuery); 




/*//timepicker*/
/*!
* Timepicker Component for Twitter Bootstrap
* Copyright 2013 Joris de Wit
* Contributors https://github.com/jdewit/bootstrap-timepicker/graphs/contributors
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
(function($, window, document, undefined) {
  'use strict';

  // TIMEPICKER PUBLIC CLASS DEFINITION
  var Timepicker = function(element, options) {
    this.widget = '';
    this.$element = $(element);
    this.defaultTime = options.defaultTime;
    this.disableFocus = options.disableFocus;
    this.isOpen = options.isOpen;
    this.minuteStep = options.minuteStep;
    this.modalBackdrop = options.modalBackdrop;
    this.secondStep = options.secondStep;
    this.showInputs = options.showInputs;
    this.showMeridian = options.showMeridian;
    this.showSeconds = options.showSeconds;
    this.template = options.template;
    this.appendWidgetTo = options.appendWidgetTo;

    this._init();
  };

  Timepicker.prototype = {

    constructor: Timepicker,

    _init: function() {
      var self = this;

      if (this.$element.parent().hasClass('input-append') || this.$element.parent().hasClass('input-prepend')) {
        this.$element.parent('.input-append, .input-prepend').find('.add-on').on({
          'click.timepicker': $.proxy(this.showWidget, this)
        });
        this.$element.on({
          'focus.timepicker': $.proxy(this.highlightUnit, this),
          'click.timepicker': $.proxy(this.highlightUnit, this),
          'keydown.timepicker': $.proxy(this.elementKeydown, this),
          'blur.timepicker': $.proxy(this.blurElement, this)
        });
      } else {
        if (this.template) {
          this.$element.on({
            'focus.timepicker': $.proxy(this.showWidget, this),
            'click.timepicker': $.proxy(this.showWidget, this),
            'blur.timepicker': $.proxy(this.blurElement, this)
          });
        } else {
          this.$element.on({
            'focus.timepicker': $.proxy(this.highlightUnit, this),
            'click.timepicker': $.proxy(this.highlightUnit, this),
            'keydown.timepicker': $.proxy(this.elementKeydown, this),
            'blur.timepicker': $.proxy(this.blurElement, this)
          });
        }
      }

      if (this.template !== false) {
        this.$widget = $(this.getTemplate()).prependTo(this.$element.parents(this.appendWidgetTo)).on('click', $.proxy(this.widgetClick, this));
      } else {
        this.$widget = false;
      }

      if (this.showInputs && this.$widget !== false) {
        this.$widget.find('input').each(function() {
          $(this).on({
            'click.timepicker': function() { $(this).select(); },
            'keydown.timepicker': $.proxy(self.widgetKeydown, self)
          });
        });
      }

      this.setDefaultTime(this.defaultTime);
    },

    blurElement: function() {
      this.highlightedUnit = undefined;
      this.updateFromElementVal();
    },

    decrementHour: function() {
      if (this.showMeridian) {
        if (this.hour === 1) {
          this.hour = 12;
        } else if (this.hour === 12) {
          this.hour--;

          return this.toggleMeridian();
        } else if (this.hour === 0) {
          this.hour = 11;

          return this.toggleMeridian();
        } else {
          this.hour--;
        }
      } else {
        if (this.hour === 0) {
          this.hour = 23;
        } else {
          this.hour--;
        }
      }
      this.update();
    },

    decrementMinute: function(step) {
      var newVal;

      if (step) {
        newVal = this.minute - step;
      } else {
        newVal = this.minute - this.minuteStep;
      }

      if (newVal < 0) {
        this.decrementHour();
        this.minute = newVal + 60;
      } else {
        this.minute = newVal;
      }
      this.update();
    },

    decrementSecond: function() {
      var newVal = this.second - this.secondStep;

      if (newVal < 0) {
        this.decrementMinute(true);
        this.second = newVal + 60;
      } else {
        this.second = newVal;
      }
      this.update();
    },

    elementKeydown: function(e) {
      switch (e.keyCode) {
      case 9: //tab
        this.updateFromElementVal();

        switch (this.highlightedUnit) {
        case 'hour':
          e.preventDefault();
          this.highlightNextUnit();
          break;
        case 'minute':
          if (this.showMeridian || this.showSeconds) {
            e.preventDefault();
            this.highlightNextUnit();
          }
          break;
        case 'second':
          if (this.showMeridian) {
            e.preventDefault();
            this.highlightNextUnit();
          }
          break;
        }
        break;
      case 27: // escape
        this.updateFromElementVal();
        break;
      case 37: // left arrow
        e.preventDefault();
        this.highlightPrevUnit();
        this.updateFromElementVal();
        break;
      case 38: // up arrow
        e.preventDefault();
        switch (this.highlightedUnit) {
        case 'hour':
          this.incrementHour();
          this.highlightHour();
          break;
        case 'minute':
          this.incrementMinute();
          this.highlightMinute();
          break;
        case 'second':
          this.incrementSecond();
          this.highlightSecond();
          break;
        case 'meridian':
          this.toggleMeridian();
          this.highlightMeridian();
          break;
        }
        break;
      case 39: // right arrow
        e.preventDefault();
        this.updateFromElementVal();
        this.highlightNextUnit();
        break;
      case 40: // down arrow
        e.preventDefault();
        switch (this.highlightedUnit) {
        case 'hour':
          this.decrementHour();
          this.highlightHour();
          break;
        case 'minute':
          this.decrementMinute();
          this.highlightMinute();
          break;
        case 'second':
          this.decrementSecond();
          this.highlightSecond();
          break;
        case 'meridian':
          this.toggleMeridian();
          this.highlightMeridian();
          break;
        }
        break;
      }
    },

    formatTime: function(hour, minute, second, meridian) {
      hour = hour < 10 ? '0' + hour : hour;
      minute = minute < 10 ? '0' + minute : minute;
      second = second < 10 ? '0' + second : second;

      return hour + ':' + minute + (this.showSeconds ? ':' + second : '') + (this.showMeridian ? ' ' + meridian : '');
    },

    getCursorPosition: function() {
      var input = this.$element.get(0);

      if ('selectionStart' in input) {// Standard-compliant browsers

        return input.selectionStart;
      } else if (document.selection) {// IE fix
        input.focus();
        var sel = document.selection.createRange(),
          selLen = document.selection.createRange().text.length;

        sel.moveStart('character', - input.value.length);

        return sel.text.length - selLen;
      }
    },

    getTemplate: function() {
      var template,
        hourTemplate,
        minuteTemplate,
        secondTemplate,
        meridianTemplate,
        templateContent;

      if (this.showInputs) {
        hourTemplate = '<input type="text" name="hour" class="bootstrap-timepicker-hour" maxlength="2"/>';
        minuteTemplate = '<input type="text" name="minute" class="bootstrap-timepicker-minute" maxlength="2"/>';
        secondTemplate = '<input type="text" name="second" class="bootstrap-timepicker-second" maxlength="2"/>';
        meridianTemplate = '<input type="text" name="meridian" class="bootstrap-timepicker-meridian" maxlength="2"/>';
      } else {
        hourTemplate = '<span class="bootstrap-timepicker-hour"></span>';
        minuteTemplate = '<span class="bootstrap-timepicker-minute"></span>';
        secondTemplate = '<span class="bootstrap-timepicker-second"></span>';
        meridianTemplate = '<span class="bootstrap-timepicker-meridian"></span>';
      }

      templateContent = '<table>'+
         '<tr>'+
           '<td><a href="#" data-action="incrementHour"><span class="fa fa-chevron-up"></span></a></td>'+
           '<td class="separator">&nbsp;</td>'+
           '<td><a href="#" data-action="incrementMinute"><span class="fa fa-chevron-up"></span></a></td>'+
           (this.showSeconds ?
             '<td class="separator">&nbsp;</td>'+
             '<td><a href="#" data-action="incrementSecond"><span class="fa fa-chevron-up"></span></a></td>'
          : '') +
           (this.showMeridian ?
             '<td class="separator">&nbsp;</td>'+
             '<td class="meridian-column"><a href="#" data-action="toggleMeridian"><span class="fa fa-chevron-up"></span></a></td>'
          : '') +
         '</tr>'+
         '<tr>'+
           '<td>'+ hourTemplate +'</td> '+
           '<td class="separator">:</td>'+
           '<td>'+ minuteTemplate +'</td> '+
           (this.showSeconds ?
            '<td class="separator">:</td>'+
            '<td>'+ secondTemplate +'</td>'
          : '') +
           (this.showMeridian ?
            '<td class="separator">&nbsp;</td>'+
            '<td>'+ meridianTemplate +'</td>'
          : '') +
         '</tr>'+
         '<tr>'+
           '<td><a href="#" data-action="decrementHour"><span class="fa fa-chevron-down"></span></a></td>'+
           '<td class="separator"></td>'+
           '<td><a href="#" data-action="decrementMinute"><span class="fa fa-chevron-down"></span></a></td>'+
           (this.showSeconds ?
            '<td class="separator">&nbsp;</td>'+
            '<td><a href="#" data-action="decrementSecond"><span class="fa fa-chevron-down"></span></a></td>'
          : '') +
           (this.showMeridian ?
            '<td class="separator">&nbsp;</td>'+
            '<td><a href="#" data-action="toggleMeridian"><span class="fa fa-chevron-down"></span></a></td>'
          : '') +
         '</tr>'+
       '</table>';

      switch(this.template) {
      case 'modal':
        template = '<div class="bootstrap-timepicker-widget modal hide fade in" data-backdrop="'+ (this.modalBackdrop ? 'true' : 'false') +'">'+
          '<div class="modal-header">'+
            '<a href="#" class="close" data-dismiss="modal">×</a>'+
            '<h3>Pick a Time</h3>'+
          '</div>'+
          '<div class="modal-content">'+
            templateContent +
          '</div>'+
          '<div class="modal-footer">'+
            '<a href="#" class="btn btn-primary" data-dismiss="modal">OK</a>'+
          '</div>'+
        '</div>';
        break;
      case 'dropdown':
        template = '<div class="bootstrap-timepicker-widget dropdown-menu"><div class="dropdown-header"><button type="button" class="close dropdown-close" aria-hidden="true" data-dropdown-close="bootstrap-timepicker-widget"><i class="fa fa-times-circle"></i></button></div>'+ templateContent +'</div>';
        break;
      }

      return template;
    },

    getTime: function() {
      return this.formatTime(this.hour, this.minute, this.second, this.meridian);
    },

    hideWidget: function() {
      if (this.isOpen === false) {
        return;
      }

                  if (this.showInputs) {
                        this.updateFromWidgetInputs();
                  }

      this.$element.trigger({
        'type': 'hide.timepicker',
        'time': {
          'value': this.getTime(),
          'hours': this.hour,
          'minutes': this.minute,
          'seconds': this.second,
          'meridian': this.meridian
        }
      });

      if (this.template === 'modal' && this.$widget.modal) {
        this.$widget.modal('hide');
      } else {
        this.$widget.removeClass('open');
      }

      $(document).off('mousedown.timepicker');

      this.isOpen = false;
    },

    highlightUnit: function() {
      this.position = this.getCursorPosition();
      if (this.position >= 0 && this.position <= 2) {
        this.highlightHour();
      } else if (this.position >= 3 && this.position <= 5) {
        this.highlightMinute();
      } else if (this.position >= 6 && this.position <= 8) {
        if (this.showSeconds) {
          this.highlightSecond();
        } else {
          this.highlightMeridian();
        }
      } else if (this.position >= 9 && this.position <= 11) {
        this.highlightMeridian();
      }
    },

    highlightNextUnit: function() {
      switch (this.highlightedUnit) {
      case 'hour':
        this.highlightMinute();
        break;
      case 'minute':
        if (this.showSeconds) {
          this.highlightSecond();
        } else if (this.showMeridian){
          this.highlightMeridian();
        } else {
          this.highlightHour();
        }
        break;
      case 'second':
        if (this.showMeridian) {
          this.highlightMeridian();
        } else {
          this.highlightHour();
        }
        break;
      case 'meridian':
        this.highlightHour();
        break;
      }
    },

    highlightPrevUnit: function() {
      switch (this.highlightedUnit) {
      case 'hour':
        this.highlightMeridian();
        break;
      case 'minute':
        this.highlightHour();
        break;
      case 'second':
        this.highlightMinute();
        break;
      case 'meridian':
        if (this.showSeconds) {
          this.highlightSecond();
        } else {
          this.highlightMinute();
        }
        break;
      }
    },

    highlightHour: function() {
      var $element = this.$element.get(0);

      this.highlightedUnit = 'hour';

                  if ($element.setSelectionRange) {
                        setTimeout(function() {
                              $element.setSelectionRange(0,2);
                        }, 0);
                  }
    },

    highlightMinute: function() {
      var $element = this.$element.get(0);

      this.highlightedUnit = 'minute';

                  if ($element.setSelectionRange) {
                        setTimeout(function() {
                              $element.setSelectionRange(3,5);
                        }, 0);
                  }
    },

    highlightSecond: function() {
      var $element = this.$element.get(0);

      this.highlightedUnit = 'second';

                  if ($element.setSelectionRange) {
                        setTimeout(function() {
                              $element.setSelectionRange(6,8);
                        }, 0);
                  }
    },

    highlightMeridian: function() {
      var $element = this.$element.get(0);

      this.highlightedUnit = 'meridian';

                  if ($element.setSelectionRange) {
                        if (this.showSeconds) {
                              setTimeout(function() {
                                    $element.setSelectionRange(9,11);
                              }, 0);
                        } else {
                              setTimeout(function() {
                                    $element.setSelectionRange(6,8);
                              }, 0);
                        }
                  }
    },

    incrementHour: function() {
      if (this.showMeridian) {
        if (this.hour === 11) {
          this.hour++;
          return this.toggleMeridian();
        } else if (this.hour === 12) {
          this.hour = 0;
        }
      }
      if (this.hour === 23) {
        this.hour = 0;

        return;
      }
      this.hour++;
      this.update();
    },

    incrementMinute: function(step) {
      var newVal;

      if (step) {
        newVal = this.minute + step;
      } else {
        newVal = this.minute + this.minuteStep - (this.minute % this.minuteStep);
      }

      if (newVal > 59) {
        this.incrementHour();
        this.minute = newVal - 60;
      } else {
        this.minute = newVal;
      }
      this.update();
    },

    incrementSecond: function() {
      var newVal = this.second + this.secondStep - (this.second % this.secondStep);

      if (newVal > 59) {
        this.incrementMinute(true);
        this.second = newVal - 60;
      } else {
        this.second = newVal;
      }
      this.update();
    },

    remove: function() {
      $('document').off('.timepicker');
      if (this.$widget) {
        this.$widget.remove();
      }
      delete this.$element.data().timepicker;
    },

    setDefaultTime: function(defaultTime){
      if (!this.$element.val()) {
        if (defaultTime === 'current') {
          var dTime = new Date(),
            hours = dTime.getHours(),
            minutes = Math.floor(dTime.getMinutes() / this.minuteStep) * this.minuteStep,
            seconds = Math.floor(dTime.getSeconds() / this.secondStep) * this.secondStep,
            meridian = 'AM';

          if (this.showMeridian) {
            if (hours === 0) {
              hours = 12;
            } else if (hours >= 12) {
              if (hours > 12) {
                hours = hours - 12;
              }
              meridian = 'PM';
            } else {
              meridian = 'AM';
            }
          }

          this.hour = hours;
          this.minute = minutes;
          this.second = seconds;
          this.meridian = meridian;

          this.update();

        } else if (defaultTime === false) {
          this.hour = 0;
          this.minute = 0;
          this.second = 0;
          this.meridian = 'AM';
        } else {
          this.setTime(defaultTime);
        }
      } else {
        this.updateFromElementVal();
      }
    },

    setTime: function(time) {
      var arr,
        timeArray;

      if (this.showMeridian) {
        arr = time.split(' ');
        timeArray = arr[0].split(':');
        this.meridian = arr[1];
      } else {
        timeArray = time.split(':');
      }

      this.hour = parseInt(timeArray[0], 10);
      this.minute = parseInt(timeArray[1], 10);
      this.second = parseInt(timeArray[2], 10);

      if (isNaN(this.hour)) {
        this.hour = 0;
      }
      if (isNaN(this.minute)) {
        this.minute = 0;
      }

      if (this.showMeridian) {
        if (this.hour > 12) {
          this.hour = 12;
        } else if (this.hour < 1) {
          this.hour = 12;
        }

        if (this.meridian === 'am' || this.meridian === 'a') {
          this.meridian = 'AM';
       } else if (this.meridian === 'pm' || this.meridian === 'p') {
          this.meridian = 'PM';
        }

        if (this.meridian !== 'AM' && this.meridian !== 'PM') {
          this.meridian = 'AM';
        }
      } else {
        if (this.hour >= 24) {
          this.hour = 23;
        } else if (this.hour < 0) {
          this.hour = 0;
        }
      }

      if (this.minute < 0) {
        this.minute = 0;
      } else if (this.minute >= 60) {
        this.minute = 59;
      }

      if (this.showSeconds) {
        if (isNaN(this.second)) {
          this.second = 0;
        } else if (this.second < 0) {
          this.second = 0;
        } else if (this.second >= 60) {
          this.second = 59;
        }
      }

      this.update();
    },

    showWidget: function() {
      if (this.isOpen) {
        return;
      }

      if (this.$element.is(':disabled')) {
        return;
      }

      var self = this;
      $(document).on('mousedown.timepicker', function (e) {
        // Clicked outside the timepicker, hide it
        if ($(e.target).closest('.bootstrap-timepicker-widget').length === 0) {
          self.hideWidget();
        }
      });

      this.$element.trigger({
        'type': 'show.timepicker',
        'time': {
          'value': this.getTime(),
          'hours': this.hour,
          'minutes': this.minute,
          'seconds': this.second,
          'meridian': this.meridian
        }
      });

      if (this.disableFocus) {
        this.$element.blur();
      }

      this.updateFromElementVal();

      if (this.template === 'modal' && this.$widget.modal) {
        this.$widget.modal('show').on('hidden', $.proxy(this.hideWidget, this));
      } else {
        if (this.isOpen === false) {
          this.$widget.addClass('open');
        }
      }

      this.isOpen = true;
    },

    toggleMeridian: function() {
      this.meridian = this.meridian === 'AM' ? 'PM' : 'AM';
      this.update();
    },

    update: function() {
      this.$element.trigger({
        'type': 'changeTime.timepicker',
        'time': {
          'value': this.getTime(),
          'hours': this.hour,
          'minutes': this.minute,
          'seconds': this.second,
          'meridian': this.meridian
        }
      });

      this.updateElement();
      this.updateWidget();
    },

    updateElement: function() {
      this.$element.val(this.getTime()).change();
    },

    updateFromElementVal: function() {
                  var val = this.$element.val();

                  if (val) {
                        this.setTime(val);
                  }
    },

    updateWidget: function() {
      if (this.$widget === false) {
        return;
      }

      var hour = this.hour < 10 ? '0' + this.hour : this.hour,
          minute = this.minute < 10 ? '0' + this.minute : this.minute,
          second = this.second < 10 ? '0' + this.second : this.second;

      if (this.showInputs) {
        this.$widget.find('input.bootstrap-timepicker-hour').val(hour);
        this.$widget.find('input.bootstrap-timepicker-minute').val(minute);

        if (this.showSeconds) {
          this.$widget.find('input.bootstrap-timepicker-second').val(second);
        }
        if (this.showMeridian) {
          this.$widget.find('input.bootstrap-timepicker-meridian').val(this.meridian);
        }
      } else {
        this.$widget.find('span.bootstrap-timepicker-hour').text(hour);
        this.$widget.find('span.bootstrap-timepicker-minute').text(minute);

        if (this.showSeconds) {
          this.$widget.find('span.bootstrap-timepicker-second').text(second);
        }
        if (this.showMeridian) {
          this.$widget.find('span.bootstrap-timepicker-meridian').text(this.meridian);
        }
      }
    },

    updateFromWidgetInputs: function() {
      if (this.$widget === false) {
        return;
      }
      var time = $('input.bootstrap-timepicker-hour', this.$widget).val() + ':' +
        $('input.bootstrap-timepicker-minute', this.$widget).val() +
        (this.showSeconds ? ':' + $('input.bootstrap-timepicker-second', this.$widget).val() : '') +
        (this.showMeridian ? ' ' + $('input.bootstrap-timepicker-meridian', this.$widget).val() : '');

      this.setTime(time);
    },

    widgetClick: function(e) {
      if(!$(e.target).is('[data-dropdown-close]')){
            e.stopPropagation();
                  e.preventDefault();
      }

      var action = $(e.target).closest('a').data('action');
      if (action) {
        this[action]();
      }
    },

    widgetKeydown: function(e) {
      var $input = $(e.target).closest('input'),
          name = $input.attr('name');

      switch (e.keyCode) {
      case 9: //tab
        if (this.showMeridian) {
          if (name === 'meridian') {
            return this.hideWidget();
          }
        } else {
          if (this.showSeconds) {
            if (name === 'second') {
              return this.hideWidget();
            }
          } else {
            if (name === 'minute') {
              return this.hideWidget();
            }
          }
        }

        this.updateFromWidgetInputs();
        break;
      case 27: // escape
        this.hideWidget();
        break;
      case 38: // up arrow
        e.preventDefault();
        switch (name) {
        case 'hour':
          this.incrementHour();
          break;
        case 'minute':
          this.incrementMinute();
          break;
        case 'second':
          this.incrementSecond();
          break;
        case 'meridian':
          this.toggleMeridian();
          break;
        }
        break;
      case 40: // down arrow
        e.preventDefault();
        switch (name) {
        case 'hour':
          this.decrementHour();
          break;
        case 'minute':
          this.decrementMinute();
          break;
        case 'second':
          this.decrementSecond();
          break;
        case 'meridian':
          this.toggleMeridian();
          break;
        }
        break;
      }
    }
  };


  //TIMEPICKER PLUGIN DEFINITION
  $.fn.timepicker = function(option) {
    var args = Array.apply(null, arguments);
    args.shift();
    return this.each(function() {
      var $this = $(this),
        data = $this.data('timepicker'),
        options = typeof option === 'object' && option;

      if (!data) {
        $this.data('timepicker', (data = new Timepicker(this, $.extend({}, $.fn.timepicker.defaults, options, $(this).data()))));
      }

      if (typeof option === 'string') {
        data[option].apply(data, args);
      }
    });
  };

  $.fn.timepicker.defaults = {
    defaultTime: 'current',
    disableFocus: false,
    isOpen: false,
    minuteStep: 15,
    modalBackdrop: false,
    secondStep: 15,
    showSeconds: false,
    showInputs: true,
    showMeridian: true,
    template: 'dropdown',
    appendWidgetTo: '.bootstrap-timepicker'
  };

  $.fn.timepicker.Constructor = Timepicker;

})(jQuery, window, document);

/*//timepicker*/

/* =============================================================
* bootstrap-typeahead.js v2.3.0
* http://twitter.github.com/bootstrap/javascript.html#typeahead
* =============================================================
* Copyright 2012 Twitter, Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* ============================================================ */


!function($){

  "use strict"; // jshint ;_;


/* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.typeahead.defaults, options);
    this.matcher = this.options.matcher || this.matcher;
    this.sorter = this.options.sorter || this.sorter;
    this.highlighter = this.options.highlighter || this.highlighter;
    this.updater = this.options.updater || this.updater;
    this.source = this.options.source;
    this.$menu = $(this.options.menu);
    this.shown = false;
    this.listen();
  };

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , focus: function (e) {
      this.focused = true
    }

  , blur: function (e) {
      this.focused = false
      if (!this.mousedover && this.shown) this.hide()
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
      this.$element.focus()
    }

  , mouseenter: function (e) {
      this.mousedover = true
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  , mouseleave: function (e) {
      this.mousedover = false
      if (!this.focused && this.shown) this.hide()
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu arrow-left"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


/* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


/* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    $this.typeahead($this.data())
  });

}(window.jQuery);

