;(function ($) {
    $.modal = function (options) {
        // 默认属性
        var defaultOptions = {
            title: '标题',
            content: '',
            hasFooter: true,
            ok: '确定',
            cancel: '取消',
            onOk: $.noop,
            onCancel: $.noop,
            onClose: $.noop,
            onShow: $.noop,
            rootDom: $('body')
        };

        var settings = $.extend({}, defaultOptions, options);

        var $modalBackDrop = $('<div class="modal-backdrop fade in"></div>').appendTo(settings.rootDom);

        var $modal = $(`<div class="modal" tabindex="-1" role="dialog"><div class="modal-dialog"></div></div>`);
        var $modalContent = $(`<div class="modal-content"></div>`).appendTo($modal.find('.modal-dialog'));

        var $modalHeader = $(`<div class="modal-header"></div>`).appendTo($modalContent);
        var $modalClose = $(`<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`).appendTo($modalHeader);
        var $modalTitle = $(`<h4 class="modal-title" id="myModalLabel">${settings.title}</h4>`).insertAfter($modalClose);

        var $modalBody = $(`<div class="modal-body">${settings.content}</div>`).insertAfter($modalHeader);

        if (settings.ok !== null || settings.cancel !== null) {
            var $modalFooter = $(`<div class="modal-footer"></div>`).insertAfter($modalBody);
            var $modalOk, $modalCancel;
            if (settings.cancel !== null) {
                $modalCancel = $(`<button type="button" class="btn btn-default" data-dismiss="modal">${settings.cancel}</button>`).appendTo($modalFooter);

                $modalCancel.on('click', function (e) {
                    e.preventDefault();

                    if (settings.onCancel !== null && $.type(settings.onCancel) === 'function') {
                        settings.onCancel();
                    }

                    closeModal();
                });
            }

            if (settings.ok !== null) {
                $modalOk = $(`<button type="button" class="btn btn-primary">${settings.ok}</button>`).appendTo($modalFooter);

                $modalOk.on('click', function (e) {
                    e.preventDefault();

                    if (settings.onOk !== null && $.type(settings.onOk) === 'function') {
                        settings.onOk();
                    }

                    closeModal();
                });
            }
        }

        if (settings.onShow !== null && $.type(settings.onShow) === 'function') {
            settings.onShow();
        }

        $modal.appendTo(settings.rootDom);

        $modalClose.on('click', function () {
            if (settings.onClose !== null && $.type(settings.onClose) === 'function') {
                settings.onClose();
            }

            closeModal();
        });

        $modalHeader.off('mousedown').on('mousedown', function (e) {
            // 获取鼠标点击位置相对于窗体left和top的位移.
            // 这里的this指向当前对象节点
            var pageX = e.clientX - this.offsetLeft;
            var pageY = e.clientY = this.offsetTop;

            $(document).on('mousemove', function (event) {
                //在移动过程中窗体的offsetLeft、offsetTop会随着事件触发位置的e.clientX、e.clientY变化而变化，但diffX、diffY是固定不变的
                //故使用e.clientX - diffX可以获取移动后窗体的left值，top值同理
                $modal.css({
                    top: `${event.clientY - pageY}px`,
                    left: `${event.clientX - pageX}px`
                });
            });

            $(document).off('mouseup').on('mouseup', function () {
                $(document).off('mousemove');
            })
        });

        function closeModal() {
            $modal.remove();
            $modalBackDrop.remove();
        }

        return $modal;
    }
})(jQuery);