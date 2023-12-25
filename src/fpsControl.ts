/***
 * requestAnimationFrame控制最大帧率
 * 默认最大帧率为60fps
 */
export type ICallBack = (currentFps?: number) => void;
export const fpsControl = () => {
    let stop = false;
    let frameCount = 0;
    let fpsInterval = 0;
    let startTime = 0;
    let now = 0;
    let then = 0;
    let delta;
    let callback: ICallBack;
    let currentFps;

    const stopLoop = () => {
        stop = true;
    };

    function loop() {
        if (stop) {
            return;
        }
        requestAnimationFrame(loop);
        now = Date.now();
        delta = now - then;

        // if enough time has delta, draw the next frame
        if (delta > fpsInterval) {
            // Get ready for next frame by setting then=now, but...
            // Also, adjust for fpsInterval not being multiple of 16.67
            then = now - (delta % fpsInterval);
            if (callback) {
                const sinceStart = now - startTime;
                currentFps = Math.round((1000 / (sinceStart / ++frameCount)) * 100) / 100;
                callback(currentFps);
            }
        }
    }

    const start = (cb: ICallBack, fps = 60) => {
        stop = false;
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        callback = cb;
        loop();
    };
    return { start, stopLoop, currentFps };
};

export default fpsControl;
