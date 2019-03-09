import { currentPageName } from '../wikipedia-api';

export default function createOverlay(abortYofication, acceptReplace, rejectReplace) {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const onTouch = event => {
        // в мобильной версии доступны четыре действия, выполняемые путём нажатия в определённое место на экране:
        //     верхнюю 1/4 часть экрана:
        //         правая половина → отмена ёфикации и переход к следующей странице
        //          левая половина → отмена ёфикации и возвращение в мобильную версия (на обычную страницу просмотра текущей статьи)
        //     нижняя 1/4 часть экрана:
        //         правая половина →   принять замену
        //          левая половина → отклонить замену
        event.preventDefault();
        const touch = event.touches[0];
        const y = touch.clientY;
        const x = touch.clientX;
        if (y <= windowHeight / 4) {
            if (x >= windowWidth / 2) {
                abortYofication();
            } else {
                window.location.href = `//ru.m.wikipedia.org/wiki/${currentPageName}?mobileaction=toggle_view_mobile`;
            }
        } else {
            if (x >= windowWidth / 2) {
                acceptReplace();
            } else {
                rejectReplace();
            }
        }
    };
    window.addEventListener('touchstart', onTouch, { passive: false });

    return () => window.removeEventListener('touchstart', onTouch);
}
