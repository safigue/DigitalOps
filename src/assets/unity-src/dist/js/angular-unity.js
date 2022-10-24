// *******************************************************************************************
// Collection of Unity directives updated to Unity version 1.1.0
// Please contribute at https://gitlab.softwaystaging.com/mudassir/unity-src
// *******************************************************************************************

angular.module('angular-unity', []);

(function () {
  //'use strict';

  // Usage:
  // Add directive to your search <button> tag:
  // <button class="em-c-btn em-c-btn--bare em-js-header-search-trigger" search-button>

  angular
    .module('angular-unity')
    .directive('searchButton', searchButton);

  function searchButton() {
    var directive = {
      restrict: 'A',
      link: function ($scope, $element, $attrs) {

        $element.on('click', function (event) {
          $scope.$apply(function () {

            var k;
            var buttonSwap = $element[0].querySelector('.em-js-btn-swap-icon');
            var iconPath = $element[0].querySelector('.em-js-btn-icon');
            var navPanel = $element[0].parentNode.parentNode.parentNode.parentNode;
            var searchPanel = navPanel.querySelector('.em-js-header-search');
            if ($element[0].classList.contains('em-is-active')) {
              $element[0].classList.remove('em-is-active');
              iconPath.setAttribute('class', 'em-c-btn__icon em-js-btn-icon');
              buttonSwap.setAttribute('class', 'em-c-btn__icon em-js-btn-swap-icon em-u-is-hidden');
              searchPanel.classList.remove('em-is-active');
            }

            else {
              $element[0].classList.add('em-is-active');
              iconPath.setAttribute('class', 'em-c-btn__icon em-js-btn-icon em-u-is-hidden');
              buttonSwap.setAttribute('class', 'em-c-btn__icon em-js-btn-swap-icon');
              searchPanel.classList.add('em-is-active');
              var intervalID = setTimeout(function () { searchPanel.querySelector('input[type=search]').focus(); }, 50);
            }

            var navDropdown = document.querySelectorAll('.em-js-nav-dropdown');
            var navDropdownTrigger = document.querySelectorAll('.em-js-nav-dropdown-trigger');
            for (k = 0; k < navDropdown.length; k++) {
              navDropdown[k].classList.remove('em-is-active');
            }
            for (k = 0; k < navDropdownTrigger.length; k++) {
              navDropdownTrigger[k].classList.remove('em-is-active');
            }

          });
        });
      }
    };
    return directive;
  };

  // Usage:
  // Add directive to your drop down <button> tag:
  // <a class="em-c-global-nav__link em-c-global-nav__link--has-children em-js-nav-dropdown-trigger" href drop-down>
  // Updated to Unity 1.1.0

  angular
    .module('angular-unity')
    .directive('dropDown', dropDown);

  function dropDown() {
    var directive = {
      restrict: 'A',
      link: function ($scope, $element, $attrs) {

        $element.on('click', function (event) {
          $scope.$apply(function () {
            event.preventDefault();

            var i;
            var dropdownPanel = $element[0].nextElementSibling;

            if ($element[0].classList.contains('em-is-active')) {
              $element[0].classList.remove('em-is-active');
              $element[0].setAttribute("aria-expanded", "false");
              $element[0].setAttribute("aria-selected", "false");
              dropdownPanel.classList.remove('em-is-active');
              dropdownPanel.setAttribute('aria-hidden', 'true');
              dropdownPanel.setAttribute('aria-selected', 'false');
            }
            else {
              var dropdownTriggers = document.querySelectorAll('.em-js-nav-dropdown-trigger');
              for (i = 0; i < dropdownTriggers.length; i++) {
                dropdownTriggers[i].classList.remove('em-is-active');
                dropdownTriggers[i].setAttribute('aria-expanded', 'false');
                dropdownTriggers[i].setAttribute('aria-selected', 'false');
              }
              var dropdownPanels = document.querySelectorAll('.em-js-nav-dropdown');
              for (i = 0; i < dropdownPanels.length; i++) {
                dropdownPanels[i].classList.remove('em-is-active');
                dropdownPanels[i].setAttribute('aria-hidden', 'true');
                dropdownPanels[i].setAttribute('aria-selected', 'false');
              }
              $element[0].classList.add('em-is-active');
              $element[0].setAttribute('aria-expanded', 'true');
              $element[0].setAttribute('aria-selected', 'true');
              dropdownPanel.classList.add('em-is-active');
              dropdownPanel.setAttribute('aria-hidden', 'false');
              dropdownPanel.setAttribute('aria-selected', 'true');
            }

          });
        });
      }
    };
    return directive;
  };

  // Usage:
  // Add directive to your drop down <button> tag:
  // <a class="em-c-global-nav__link em-c-global-nav__link--has-children em-js-nav-dropdown-trigger" href drop-down>
  // Updated to Unity 1.1.0
  angular
    .module('angular-unity')
    .directive('appModal', appModal);

  function appModal() {
    var directive = {
      restrict: 'A',
      link: function ($scope, $element, $attrs) {

        /*Disabling other modals if open*/
        var modalPanel = document.querySelectorAll('.em-js-modal');//select all modals
        for (i = 0; i < modalPanel.length; i++) {
          modalPanel[i].setAttribute('aria-hidden', 'true');
          modalPanel[i].setAttribute('tabindex', '-1');
        }

        //var modal = document.getElementById($attrs.appModal);//select target modal
        var modalActivePanel;
        $element.on('click', function (event) {//configuring modal show as per unity guidelines
          var modal = document.getElementById($attrs.appModal)
          modal.classList.remove("em-is-closed");
          modal.setAttribute('aria-hidden', 'false');
          modal.setAttribute('tabindex', '0');
          document.body.classList.add('em-is-disabled');
          if (document.querySelectorAll('#' + $attrs.appModal + ' .em-c-video') && document.querySelectorAll('#' + $attrs.appModal + ' .em-c-video').length) {
            var vid = document.querySelectorAll('#' + $attrs.appModal + ' .em-c-video')[0];
            vid.play();//auto play video
          }
          var modalActivePanel = document.querySelector('.em-js-video:not(.em-is-closed)');//select active modal
          for (var j = 0; j < modalPanel.length; j++) {
            modalPanel[j].addEventListener('click', function (e) {
              if (e.target == modalActivePanel) {
                closeModal();
              }
            });
          }
          var modalClose = document.querySelectorAll('#' + $attrs.appModal + ' .em-js-modal-close-trigger')[0];
          if (modalClose) {
            modalClose.addEventListener("click", function (event) {//configuring modal hide as per unity guidelines
              closeModal()
            });
          }
        });

        document.addEventListener('keyup', function (e) {
          if (e.keyCode == 27) {
            closeModal()
          }
        });

        $scope.$on("closeAllModals", function () {
          closeModal();
        })


        function closeModal() {
          var modal = document.getElementById($attrs.appModal)
          modal.classList.add("em-is-closed");
          modal.setAttribute('aria-hidden', 'true');
          modal.setAttribute('tabindex', '-1');
          document.body.classList.remove('em-is-disabled');
          pauseVid();
        }

        /**
         * Pause video player
         */
        function pauseVid() {
          var vid = document.querySelectorAll(".em-js-modal .em-c-video");
          for (j = 0; j < vid.length; j++) {
            vid[j].pause();
          }
        }
      }
    }
    return directive;
  };

  // Usage
  //Add directive to <ul> tag where we have class="em-c-accordion"
  // Updated to Unity 1.1.0

  angular
    .module('angular-unity')
    .directive('unityAccordion', unityAccordion);

  function unityAccordion() {
    function toggleAccordion(el) {
      if (el.parentNode.classList.contains('em-ss-is-always-open')) {
        el.classList.remove('em-is-closed');
      }
      else if (el.classList.contains('em-is-closed')) {
        el.classList.remove('em-is-closed');
      }
      else {
        el.classList.add('em-is-closed');
      }
    };
    var directive = {
      restrict: 'A',
      compile: function (element, attrs) {
        var list = element[0].querySelectorAll('li.em-js-accordion-item');
        for (var i = 0; i < list.length; i++) {
          if (!element[0].classList.contains('em-ss-is-always-open')) {
            list[i].classList.add('em-is-closed');
            // list[i].classList.add('em-is-closed');
            var trigger = list[i].querySelector('.em-js-accordion-trigger');
            var att = document.createAttribute("ng-click");
            att.value = "triggerAccordion($event)";
            trigger.setAttributeNode(att);
          }
        }

        return function (scope, element, attrs) {
          scope.triggerAccordion = function (e) {
            e.preventDefault();
            var targetElem = e.currentTarget;
            var parent = targetElem.parentNode.parentNode;
            var hrefSub = targetElem.getAttribute('href').substring(1);
            toggleAccordion(parent);
          };
        };
      }
    }
    return directive;
  };


  // Usage
  //Add directive to <video> tag where we have class="em-c-video pause"
  //Should be used along with ng-repeat,  <video class="em-c-video pause" video-controller>
  // Updated to Unity 1.1.0

  angular
    .module('angular-unity')
    .directive('videoController', videoController);

  function videoController() {
    var directive = {
      restrict: 'A',
      link: function ($scope, $element, $attrs) {
        $element.on('click', function (event) {
          if ($element.hasClass('pause')) {
            $element.removeClass('pause');
            $element.addClass('play');
            $element[0].play();
          }
          else if ($element.hasClass('play')) {
            $element.removeClass('play');
            $element.addClass('pause');
            $element[0].pause();
          }
        });
      }
    }
    return directive;
  };

  // Usage <unity-limit-content words-limit="{{wordsLimit}}" content="{{content}}"></unity-limit-content>
  //This directive is used to limit content with show/hide(read more/less) functionality.
  // Updated to Unity 1.1.0

  angular
    .module('angular-unity')
    .directive('unityLimitContent', unityLimitContent);

  function unityLimitContent() {
    function checkContent(str, limit) {
      var elements = [];
      var innerText = "";
      var wordsLimit = limit;
      function constructResponse(str, isHtml) {
        if (str.split(" ").length > wordsLimit) {
          return {
            formattedString: str.split(" ").slice(0, wordsLimit).join(" "),
            isExtra: true,
            isHtml: isHtml
          }
        }
        else {
          return {
            formattedString: str,
            isExtra: false,
            isHtml: isHtml
          }
        }
      };
      try {
        elements = angular.element(str);
      }
      catch (err) {
        return constructResponse(str, false);
      }
      for (var i = 0; i < elements.length; i++) {
        innerText += elements[i].innerText
      }

      return constructResponse(innerText, true);

    };
    var directive = {
      restrict: 'AE',
      scope: {
        wordsLimit: '@',
        content: '@'
      },
      compile: function (element, attrs) {
        return function (scope, element, attrs) {
          scope.list = {
            expand: false
          };
          scope.content = scope.content.trim();
          scope.stringLimit;
          var wordsLeft = scope.wordsLimit;
          var completeString = "";
          scope.checkedContent = checkContent(scope.content, scope.wordsLimit);
          if (!scope.checkedContent.isHtml) {
            scope.stringLimit = scope.checkedContent.formattedString.length;
          }
          else {
            var elements = angular.element(scope.content);
            function addToString(str, element) {
              completeString = completeString + element.split(">")[0] + ">" + str;
              var limit = completeString.length;
              while (scope.content.charAt(limit) !== " ") {
                limit--;
              }
              scope.stringLimit = limit;
            }
            for (var i = 0; i < elements.length; i++) {
              var textWords = elements[i].innerText.split(" ");
              if (textWords.length > wordsLeft) {
                addToString(textWords.slice(0, wordsLeft).join(" "), elements[i].outerHTML)
              }
              else {
                wordsLeft = wordsLeft - textWords.length;
              }
              completeString = completeString + elements[i].outerHTML;
            }
          }
          scope.getIconClass = function (expand) {
            return expand ? 'less' : 'more';
          };
        };
      },
      template: "<p ng-bind-html='content | limitTo:list.expand || !checkedContent.isExtra ? content.length : stringLimit | unsafe '></p><a ng-if='checkedContent.isExtra' class='read-{{getIconClass(list.expand)}}' ng-click='list.expand=!list.expand'>{{list.expand ? 'Less' : 'More'}} <img ng-if='!list.expand' src='/assets/images/more-down-arrow.png' alt=''/><img ng-if='list.expand' src='/assets/images/more-up-arrow.png' alt=''/></a>"
    }
    return directive;
  };

  // Usage:
  //Inject this service and invoke methods in the service.

  angular
    .module('angular-unity')
    .service('$unityMenu', menuService)
    .service('$unityModal', modalService);

  menuService.$inject = [];
  function menuService() {
    this.close = function () {
      var menuButton = document.querySelectorAll('.em-js-nav-trigger');
      for (i = 0; i < menuButton.length; i++) {
        var buttonLabel = menuButton[i].querySelector('.em-js-btn-label');
        var buttonCloseText = buttonLabel.getAttribute('data-em-btn-toggle-text');
        var buttonSwap = menuButton[i].querySelector('.em-js-btn-swap-icon');
        var iconPath = menuButton[i].querySelector('.em-js-btn-icon');
        var bodyClass = document.querySelector('body');
        var header = menuButton[i].parentNode.parentNode.parentNode.parentNode;
        var navPanel = header.querySelector('.em-js-nav-panel');

        buttonLabel.innerHTML = "Menu";
        iconPath.setAttribute('class', 'em-c-btn__icon em-js-btn-icon');
        buttonSwap.setAttribute('class', 'em-c-btn__icon em-js-btn-swap-icon em-u-is-hidden');
        menuButton[i].classList.remove('em-is-active');
        bodyClass.classList.remove('em-is-disabled-small');
        header.classList.remove('em-is-active');
        navPanel.classList.remove('em-is-active');
      }
    };
    this.open = function (element) {
      var angularElement = angular.element(element)[0];
      var buttonLabel = angularElement.querySelector('.em-js-btn-label');
      var buttonText = buttonLabel.innerHTML;
      var buttonCloseText = buttonLabel.getAttribute('data-em-btn-toggle-text');
      var buttonSwap = angularElement.querySelector('.em-js-btn-swap-icon');
      var iconPath = angularElement.querySelector('.em-js-btn-icon');
      var bodyClass = document.querySelector('body');
      var header = angularElement.parentNode.parentNode.parentNode.parentNode;
      var navPanel = header.querySelector('.em-js-nav-panel');
      if (buttonText == "Close") {
        buttonLabel.innerHTML = "Menu";
        iconPath.setAttribute('class', 'em-c-btn__icon em-js-btn-icon');
        buttonSwap.setAttribute('class', 'em-c-btn__icon em-js-btn-swap-icon em-u-is-hidden');
        angularElement.classList.remove('em-is-active');
        bodyClass.classList.remove('em-is-disabled-small');
        header.classList.remove('em-is-active');
        navPanel.classList.remove('em-is-active');

      }
      else {
        buttonLabel.innerHTML = "Close";
        iconPath.setAttribute('class', 'em-c-btn__icon em-js-btn-icon em-u-is-hidden');
        buttonSwap.setAttribute('class', 'em-c-btn__icon em-js-btn-swap-icon');
        angularElement.classList.add('em-is-active');
        bodyClass.classList.add('em-is-disabled-small');
        header.classList.add('em-is-active');
        navPanel.classList.add('em-is-active');
      }
    };
  };

  modalService.$inject = [];
  function modalService() {
    this.close = function () {
      var allDialogBoxes = document.getElementsByClassName('em-js-modal-window');
      for (var i = 0; i < allDialogBoxes.length; i++) {
        allDialogBoxes[i].scrollTop = 0;
      }
      var modalList = document.querySelectorAll('.em-c-modal');
      for (var i = 0; i < modalList.length; i++) {
        var classList = [];
        var modalClassList = angular.element(modalList[i])[0].classList;
        for (var j = 0; j < modalClassList.length; j++) {
          classList.push(modalClassList[j]);
        }
        if (classList.indexOf('em-is-closed') == -1) {
          modalList[i].className += " em-is-closed";
          var bodyClassList = document.querySelectorAll('body')[0].className.split(" ");
          var indexOfDisabled = bodyClassList.indexOf('em-is-disabled');
          if (indexOfDisabled != -1) {
            bodyClassList.splice(indexOfDisabled, 1);
            document.querySelectorAll('body')[0].className = bodyClassList.join(" ");
          }
        }
      }
    };
    this.open = function (modalId) {
      /*Disabling other modals if open*/
      var modalPanel = document.querySelectorAll('.em-js-modal');//select all modals
      for (i = 0; i < modalPanel.length; i++) {
        modalPanel[i].setAttribute('aria-hidden', 'true');
        modalPanel[i].setAttribute('tabindex', '-1');
      }
      var modal = document.getElementById(modalId);//select target modal
      modal.classList.remove("em-is-closed");
      modal.setAttribute('aria-hidden', 'false');
      modal.setAttribute('tabindex', '0');
      document.body.classList.add('em-is-disabled');
      if (document.querySelectorAll('#' + modalId + ' .em-c-video') && document.querySelectorAll('#' + modalId + ' .em-c-video').length) {
        var vid = document.querySelectorAll('#' + modalId + ' .em-c-video')[0];
        vid.play();//auto play video
      }
      var modalActivePanel = document.querySelector('.em-js-video:not(.em-is-closed)');//select active modal
      for (var j = 0; j < modalPanel.length; j++) {
        modalPanel[j].addEventListener('click', function (e) {
          if (e.target == modalActivePanel) {
            closeModal();
          }
        });
      }
      var modalClose = document.querySelectorAll('#' + modalId + ' .em-js-modal-close-trigger')[0];
      if (modalClose) {
        modalClose.addEventListener("click", function (event) {//configuring modal hide as per unity guidelines
          closeModal()
        });
      }

      document.addEventListener('keyup', function (e) {
        if (e.keyCode == 27) {
          closeModal()
        }
      });

      function closeModal() {
        modal.classList.add("em-is-closed");
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('tabindex', '-1');
        document.body.classList.remove('em-is-disabled');
        pauseVid();
      }

      /**
       * Pause video player
       */
      function pauseVid() {
        var vid = document.querySelectorAll(".em-js-modal .em-c-video");
        for (j = 0; j < vid.length; j++) {
          vid[j].pause();
        }
      }
    };
  };


  // Directive for tab navigation functionality
  // Updated to Unity 1.1.0

  angular
    .module('angular-unity')
    .directive('unityTabs', unityTabs);

  function unityTabs() {
    var directive = {
      restrict: 'A',
      compile: function (element, attrs) {
        var list = element[0].querySelectorAll('li');
        var panels = element[0].parentElement.querySelectorAll('.em-js-tabs-panel');
        for (var i = 0; i < list.length; i++) {
          if (list[i].classList.contains('em-is-active')) {
            list[i].removeClass('em-is-active')
          }
          var att = document.createAttribute("ng-class");
          att.value = "{'em-is-active': $index==currentIndex}";
          list[i].setAttributeNode(att);
          var trigger = list[i].querySelector('.em-js-tab');
          var att = document.createAttribute("ng-click");
          att.value = "triggerTab($event)";
          trigger.setAttributeNode(att);
        }
        for (var i = 0; i < panels.length; i++) {
          if (panels[i].classList.contains('em-is-active')) {
            panels[i].removeClass('em-is-active')
          }
          var att = document.createAttribute("ng-class");
          att.value = "{'em-is-active': $index==currentIndex}";
          panels[i].setAttributeNode(att);

        }
        return function (scope, element, attrs) {
          scope.triggerTab = function (e) {
            e.preventDefault();
          };
        };
      }
    }
    return directive;
  };

  //SmoothScroll directive name
  //usage smooth-scroll scroll-to=“id", "id" is div id which we need to trigger 

  angular
    .module('angular-unity')
    .directive('smoothScroll', smoothScroll);
  function smoothScroll() {
    function elmYPosition(eID) {
      var elm = document.getElementById(eID);
      var y = elm.offsetTop;
      var node = elm;
      while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
      } return y;
    }
    function currentYPosition() {
      // Firefox, Chrome, Opera, Safari
      if (self.pageYOffset) return self.pageYOffset;
      // Internet Explorer 6 - standards mode
      if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
      // Internet Explorer 6, 7 and 8
      if (document.body.scrollTop) return document.body.scrollTop;
      return 0;
    }
    var directive = {
      restrict: 'A',
      scope: {
        scrollTo: '@',
        offset: '@'
      },
      link: function (scope, element, attrs) {
        scope.offset = scope.offset || 0;
        element.on('click', function (event) {
          if (document.getElementById(scope.scrollTo)) {
            var startY = currentYPosition();
            var stopY = elmYPosition(scope.scrollTo) - scope.offset;
            var distance = stopY > startY ? stopY - startY : startY - stopY;
            if (distance < 100) {
              scrollTo(0, stopY); return;
            }
            var speed = Math.round(distance / 100);
            if (speed >= 20) speed = 20;
            var step = Math.round(distance / 50);
            var leapY = stopY > startY ? startY + step : startY - step;
            var timer = 0;
            if (stopY > startY) {
              for (var i = startY; i < stopY; i += step) {
                setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
              } return;
            }
            for (var i = startY; i > stopY; i -= step) {
              setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
              leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
            }
          }
        });
      }
    }
    return directive;
  };


})();


